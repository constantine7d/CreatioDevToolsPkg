namespace UsrDevTools
{
	using System;
	using System.Collections.Generic;
	using System.Globalization;
	using System.IO;
	using System.Net.Http.Headers;
	using System.Net.Http;
	using System.Net;
	using System.Runtime.InteropServices.ComTypes;
	using System.ServiceModel;
	using System.ServiceModel.Activation;
	using System.ServiceModel.Web;
	using System.Windows;
	using Terrasoft.Common;
	using Terrasoft.Core.Entities;
	using Terrasoft.Core.Factories;
	using Terrasoft.Web.Common;
	using Terrasoft.Web.Common.ServiceRouting;
	using Terrasoft.Web.Http.Abstractions;
	using static System.Net.WebRequestMethods;

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

		private HttpContext CurrentContext => HttpContextAccessor.GetInstance();

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

		[OperationContract]
		[WebGet(UriTemplate = "GetSchemaExport/{schemaName}")]
		public void GetSchemaExport(string schemaName)
		{
			if (string.IsNullOrEmpty(schemaName))
			{
				throw new ArgumentException($"'{nameof(schemaName)}' cannot be null or empty.", nameof(schemaName));
			}
			string fileName = $"{schemaName}.csv";
			var generator = new EntitySchemasExport();
			var config = EntitySchemaConfigs.Get(UserConnection.EntitySchemaManager, schemaName);
			using (var memoryStream = new MemoryStream())
			{
				using (var writer = new StreamWriter(memoryStream))
				{
					generator.GetCsv(config, writer);
					memoryStream.Seek(0, SeekOrigin.Begin);
					CurrentContext.Response.ContentType = "application/octet-stream";
					CurrentContext.Response.Headers["Content-Length"] = memoryStream.Length.ToString(CultureInfo.InvariantCulture);
					CurrentContext.Response.AddHeader("Content-Disposition", $"attachment; filename=\"{fileName}\"");
					MimeTypeResult mimeTypeResult = MimeTypeDetector.GetMimeType(fileName);
					CurrentContext.Response.ContentType = "application/octet-stream";
					memoryStream.WriteTo(CurrentContext.Response.OutputStream);
				}
			}
			
		}

		#endregion

	}

}