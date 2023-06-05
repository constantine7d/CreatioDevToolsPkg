namespace UsrDevTools
{
	using System;
	using System.ServiceModel;
	using System.ServiceModel.Activation;
	using System.ServiceModel.Web;
	using Terrasoft.Core.Factories;
	using Terrasoft.Web.Common;

	#region Class: CompletenessServiceResponse

	/*[DataContract]
	public class GetTestsResponse : ConfigurationServiceResponse
	{

		[DataMember(Name = "GeneratedCode")]
		public string GeneratedCode { get; set; }
		public GetTestsResponse(string generatedCode) : base()
		{
			GeneratedCode = generatedCode;
		}

		public GetTestsResponse(Exception e) : base(e)
		{
		}
	}*/

	#endregion

	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class UsrCodeGeneratorService : BaseService
	{

		#region Properties: Private

		private CodeGeneratorHelper Helper
		{
			get
			{
				return ClassFactory.Get<CodeGeneratorHelper>(new ConstructorArgument("userConnection", UserConnection));
			}
		}

		#endregion

		#region Methods: Public

		[OperationContract] //TODO Method = Get
		[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped,
			RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
		public string GetSql(string type, string schemaName)
		{
			try
			{
				return Helper.GetSql(type, schemaName);
			}
			catch (Exception e)
			{
				return "Error: " + e.ToString();
			}
		}

		#endregion

	}

}