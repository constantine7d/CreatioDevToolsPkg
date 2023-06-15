namespace UsrDevTools
{
	using System.Runtime.Serialization;

	[DataContract]
	public class ColumnConfig
	{
		#region Parameters

		[DataMember]
		public string Name { get; set; }
		[DataMember]
		public string Caption { get; set; }

		[DataMember]
		public string Parent { get; set; }

		[DataMember]
		public string Type { get; set; }

		[DataMember]
		public string DataTypeName { get; set; }

		[DataMember]
		public string RequirementType { get; set; }

		[DataMember]
		public string DefValue { get; set; }

		[DataMember]
		public EntitySchemaConfig ReferenceSchema { get; set; }

		[DataMember]
		public string LookupCaption { get; set; }

		#endregion

		public ColumnConfig()
		{
			Type = "Column";
		}
	}

}