namespace UsrDevTools
{
	using System;
	using System.Collections.Generic;
	using System.ServiceModel;
	using System.ServiceModel.Activation;
	using System.ServiceModel.Web;
	using Terrasoft.Core.Factories;
	using Terrasoft.Web.Common;
	using Terrasoft.Web.Common.ServiceRouting;

	/// <summary>
	/// Сервис для интеграционного тестирвоания <see cref="UsrIntegrationTests">
	/// </summary>
	[ServiceContract]
	[DefaultServiceRoute]
	[SspServiceRoute]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class UsrEntitySchemasHelperService : BaseService
	{

		#region Properties: Private

		private EntitySchemasHelper Helper
		{
			get
			{
				return ClassFactory.Get<EntitySchemasHelper>(new ConstructorArgument("userConnection", UserConnection));
			}
		}

		#endregion

		#region Methods: Public

		[OperationContract]
		[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped,
			RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
		public IEnumerable<EntitySchemaConfig> GetSchemasList(FilterConfig filterConfig, bool force = false)
		{
			if (filterConfig is null)
			{
				throw new ArgumentNullException(nameof(filterConfig));
			}
			return Helper.GetSchemasList(filterConfig, force);
		}

		#endregion

	}

}