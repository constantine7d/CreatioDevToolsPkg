namespace UsrDevTools
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Runtime.Serialization;
	using Terrasoft.Common;
	using Terrasoft.Core;
	using Terrasoft.Core.DB;
	using Terrasoft.Core.Entities;

	[DataContract]
	public class EntitySchemaConfig
	{
		#region Consts

		static readonly string[] ExcludeColumns = { "Id", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "ProcessListeners" };

		const string nullString = "---null---";

		#endregion

		#region Parameters

		[DataMember]
		public string Name { get; set; }
		[DataMember]
		public string Caption { get; set; }

		[DataMember]
		public string ParentSchemaName { get; set; }
		[DataMember]
		public string ParentSchemaCaption { get; set; }

		[DataMember]
		public string Type { get; set; }

		[DataMember]
		public List<ColumnConfig> Columns { get; set; } = new List<ColumnConfig>();
		[DataMember]
		public List<EntitySysSchemaConfig> SysSchemas { get; set; } = new List<EntitySysSchemaConfig>();

		#endregion

		#region Constructors

		public EntitySchemaConfig()
		{
			Type = "Schema";
		}

		public EntitySchemaConfig(EntitySchema entitySchema) : this()
		{
			if (entitySchema is null)
			{
				throw new ArgumentNullException(nameof(entitySchema));
			}

			Name = entitySchema.Name;
			Caption = entitySchema.Caption?.Value ?? nullString;
			ParentSchemaName = entitySchema.ParentSchema?.Name ?? nullString;
			ParentSchemaCaption = entitySchema.ParentSchema?.Caption?.Value ?? nullString;
			InitSysSchemas(entitySchema.SystemUserConnection, entitySchema.Name);
		}

		#endregion

		private void InitSysSchemas(UserConnection systemUserConnection, string name)
		{
			var select = new Select(systemUserConnection)
					.Column("SysSchema", "UId").As("UId")
					.Column("SysSchema", "ExtendParent").As("ExtendParent")
					.Column("SysPackage", "Name").As("PackageName")
					.Column("SysPackage", "Maintainer").As("Maintainer")
					.Column("SysPackage", "InstallType").As("InstallType")
				.From("SysSchema")
				.LeftOuterJoin("SysPackage").On("SysPackage", "Id").IsEqual("SysSchema", "SysPackageId")
				.Where("SysSchema", "Name").IsEqual(Column.Parameter(name)) as Select;
			var dbConverter = systemUserConnection.DBTypeConverter;
			using (DBExecutor dbExecutor = systemUserConnection.EnsureDBConnection())
			{
				using (System.Data.IDataReader dr = select.ExecuteReader(dbExecutor))
				{
					while (dr.Read())
					{
						SysSchemas.Add(new EntitySysSchemaConfig
						{
							UId = dbConverter.DBValueToGuid(dr.GetValue(dr.GetOrdinal("UId"))),
							ExtendParent = dbConverter.DBValueToBool(dr.GetValue(dr.GetOrdinal("ExtendParent"))),
							PackageName = dr.GetValue(dr.GetOrdinal("PackageName")).ToString(),
							Maintainer = dr.GetValue(dr.GetOrdinal("Maintainer")).ToString(),
							InstallType = dbConverter.DBValueToInt(dr.GetValue(dr.GetOrdinal("InstallType"))),
						});
					}
				}
			}
		}

		public void InitColumns(EntitySchema entitySchema, IEnumerable<EntitySchemaConfig> entitySchemaConfigs)
		{
			foreach (var column in entitySchema.Columns)
			{
				if (ExcludeColumns.Contains(column.Name))
				{
					continue;
				}
				var columnConfig = new ColumnConfig
				{
					Name = column.Name,
					Caption = column.Caption?.Value ?? nullString,
					Parent = entitySchema.Name,
					DataTypeName = column.DataValueType.Name,
					RequirementType = column.RequirementType.ToString()
				};
				try
				{
					if (column.HasConstDefValue || column.HasDefValue)
					{
						columnConfig.DefValue = column.DefValue?.Value?.ToString() ?? String.Empty;
					}
				}
				catch (Exception ex)
				{
					columnConfig.DefValue = ex.ToString();
				}
				if (column.ReferenceSchema != null)
				{
					columnConfig.ReferenceSchema = new EntitySchemaConfig(column.ReferenceSchema);
					//columnConfig.ReferenceSchema = entitySchemaConfigs.FirstOrDefault(it => it.Name == column.ReferenceSchema.Name);
				}
				Columns.Add(columnConfig);
			}
		}

	}

}