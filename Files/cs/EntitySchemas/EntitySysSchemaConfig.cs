namespace UsrDevTools
{
	using System;
	using System.Runtime.Serialization;

	[DataContract]
	public class EntitySysSchemaConfig
	{
		[DataMember]
		public Guid UId { get; set; }

		[DataMember]
		public bool ExtendParent { get; set; }

		[DataMember]
		public string PackageName { get; set; }

		[DataMember]
		public string Maintainer { get; internal set; }

		[DataMember]
		public int InstallType { get; set; }
	}

}