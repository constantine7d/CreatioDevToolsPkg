namespace Terrasoft.Configuration.UsrDevTools
{
	using System.Collections.Generic;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using Terrasoft.Core.Factories;
	using Terrasoft.Web.Common;

	/// <summary>
	/// Сервис  <see cref="UsrDevelopingHelperService">
	/// </summary>
	[ServiceContract]
	public class UsrDevelopingHelperService : BaseService
	{

		#region Properties: Private

		private UsrDevelopingHelperServiceHelper Helper
		{
			get
			{
				return ClassFactory.Get<UsrDevelopingHelperServiceHelper>(new ConstructorArgument("userConnection", UserConnection));
			}
		}

		#endregion

		public class PlaceholderResponse : ConfigurationServiceResponse
		{
			public List<string> StringList { get; set; }
		}

		#region Methods: Public

		[OperationContract]
		[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
		public void Placeholder(string name)
		{
			//Helper
		}

		#endregion

	}

}