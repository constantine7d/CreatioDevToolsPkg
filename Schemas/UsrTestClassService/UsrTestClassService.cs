namespace Terrasoft.Configuration.UsrDevTools
{

	using Newtonsoft.Json;
	using System;
	using System.Collections.Generic;
	using System.ComponentModel;
	using System.Linq;
	using System.Reflection;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using Terrasoft.Core;
	using Terrasoft.Core.Factories;
	using Terrasoft.Web.Common;

	#region Class: TestClass
	[ServiceContract]
	public class TestClass : BaseService
	{

		#region Properties: Private

		private UsrReflectionHelper Helper
		{
			get
			{
				return ClassFactory.Get<UsrReflectionHelper>(new ConstructorArgument("userConnection", UserConnection));
			}
		}

		#endregion

		[OperationContract]
		[WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
		public string TestByAdmin(string methodPath, string constructorParametersJson, string methodParametersJson)
		{
			try
			{
				var methodName = methodPath.Split('.').Last();
				var className = methodPath.Remove(methodPath.LastIndexOf(methodName) - 1);
				var type = Type.GetType(className);
				if (type == null)
				{
					return $"{className} not found";
				}
				if (!type.IsClass)
				{
					return $"{className} not a class";
				}
				object result = null;
				var helper = Helper;
				Dictionary<string, object> methodParameters = helper.GetParameters(methodParametersJson);
				if (type.IsAbstract && type.IsSealed)
				{
					result = helper.InvokeStaticClassMethod(type, methodName, methodParameters);
				}
				else
				{
					result = helper.InvokeClassMethod(type, methodName, constructorParametersJson, methodParameters);
				}
				if (result != null)
				{
					return result.ToString();
				}
				else
				{
					return "Success";
				}
			}
			catch (Exception ex)
			{
				return ex.ToString();
			}
		}
	}

	#endregion

	#region Class: UsrReflectionUtils

	public class UsrReflectionHelper
	{

		#region Properties: Public

		/// <summary>
		/// Активное подключение
		/// </summary>
		public UserConnection UserConnection { get; }

		#endregion

		#region Constructors

		/// <summary>
		/// Инициализация <see cref="UsrIntegrationTestsHelper"/>.
		/// </summary>
		/// <param name="userConnection">Активное подключение</param>
		public UsrReflectionHelper(UserConnection userConnection)
		{
			UserConnection = userConnection ?? throw new ArgumentNullException(nameof(userConnection));
		}

		#endregion

		#region Methods: Public

		public object GetParamValue<T>(Type methodType, T value)
		{
			var valueType = value?.GetType();
			if (methodType.Name == valueType?.Name)
			{
				return value;
			}
			if (methodType.Name == "Int32" && valueType?.Name == "Int64")
			{
				return Convert.ToInt32(value);
			}
			var converter = TypeDescriptor.GetConverter(methodType);
			return converter.ConvertFrom(value);
		}

		public object[] GetInvokeParameters(ParameterInfo[] parameterInfos, Dictionary<string, object> parameters)
		{
			var constructorParameters = new object[parameterInfos.Length];
			if (parameterInfos.Length > 0)
			{

				for (int i = 0; i < parameterInfos.Length; i++)
				{
					var parameterInfo = parameterInfos[i];
					if (parameterInfo.ParameterType.Name == "UserConnection")
					{
						constructorParameters[i] = UserConnection;
						continue;
					}
					var param = parameters.First(it => it.Key == parameterInfo.Name);
					var paramType = parameterInfo.ParameterType;
					constructorParameters[i] = GetParamValue(paramType, param.Value);
				}

			}
			return constructorParameters;
		}

		public object InvokeStaticClassMethod(Type type, string methodName, Dictionary<string, object> parameters)
		{
			var method = type.GetMethod(methodName, BindingFlags.Public | BindingFlags.Static);
			if (method == null)
			{
				throw new NullReferenceException($"Static public method [{methodName}] not found");
			}
			ParameterInfo[] parameterInfos = method.GetParameters();
			object[] methodParameters = GetInvokeParameters(parameterInfos, parameters);
			if (parameters.Any())
			{
				return method.Invoke(null, methodParameters);
			}
			else
			{
				return method.Invoke(null, null);
			}
		}

		public object InvokeClassMethod(Type type, string methodName, string constructorParametersJson, Dictionary<string, object> parameters)
		{
			Dictionary<string, object> constructorParameters = GetParameters(constructorParametersJson);
			var initiatedObject = GetClassInstanse(type, constructorParameters);
			if (initiatedObject == null)
			{
				return "Public or matched constructor not found";
			}
			return InvokeMethod(type, methodName, initiatedObject, parameters);
		}

		public object InvokeMethod(Type type, string methodName, object initiatedObject, Dictionary<string, object> parameters = null)
		{
			if (parameters == null)
			{
				parameters = new Dictionary<string, object>();
			}
			var method = GetMethod(type, methodName);
			return InvokeMethod(method, initiatedObject, parameters);
		}

		public MethodInfo GetMethod(Type type, string methodName)
		{
			var method = type.GetMethod(methodName, BindingFlags.Public | BindingFlags.Instance);
			if (method == null)
			{
				throw new NullReferenceException($"Public method [{methodName}] not found");
			}
			return method;
		}

		public object InvokeMethod(MethodInfo method, object initiatedObject, Dictionary<string, object> parameters = null)
		{
			if (method == null)
			{
				throw new ArgumentNullException(nameof(method));
			}
			ParameterInfo[] parameterInfos = method.GetParameters();
			object[] methodParameters = GetInvokeParameters(parameterInfos, parameters);
			if (parameters.Any())
			{
				return method.Invoke(initiatedObject, methodParameters);
			}
			else
			{
				return method.Invoke(initiatedObject, null);
			}
		}

		public Dictionary<string, object> GetParameters(string json)
		{
			if (!string.IsNullOrEmpty(json))
			{
				return JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
			}
			else
			{
				return new Dictionary<string, object>();
			}
		}

		public object GetClassInstanse(Type type, Dictionary<string, object> parameters = null)
		{
			if (parameters == null)
			{
				parameters = new Dictionary<string, object>();
			}
			var constructors = type.GetConstructors(BindingFlags.Public | BindingFlags.Instance);
			ConstructorInfo constructorInfo = null;
			ParameterInfo[] parameterInfos = null;
			foreach (var constructor in constructors)
			{
				constructorInfo = constructor;
				parameterInfos = constructor.GetParameters();
				if (parameterInfos.Any(it => it.ParameterType.Name == "UserConnection") &&
					parameterInfos.Length == parameters.Count + 1)
				{
					break;
				}
			}
			if (constructorInfo == null)
			{
				return null;
			}
			object[] constructorParameters = GetInvokeParameters(parameterInfos, parameters);
			return constructorInfo.Invoke(constructorParameters);
		}

		#endregion
	}

	#endregion
}