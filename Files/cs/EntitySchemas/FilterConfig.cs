namespace UsrDevTools
{
	using System.Runtime.Serialization;

	[DataContract]
	public class FilterConfig
	{
		[DataMember]
		public string SchemaName { get; set; }
		[DataMember]
		public string ColumnName { get; set; }
	}

}