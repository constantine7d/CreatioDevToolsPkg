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

	#region Class: UsrEntitySchemasHelper

	/// <summary>
	/// Хелпер для интеграционного тестирвоания <see cref="EntitySchemasHelper">
	/// </summary>
	internal class EntitySchemasHelper
	{

		#region Properties: Public

		/// <summary>
		/// Активное подключение
		/// </summary>
		public UserConnection UserConnection { get; }

		#endregion

		#region Constructors

		/// <summary>
		/// Инициализация <see cref="EntitySchemasHelper"/>.
		/// </summary>
		/// <param name="userConnection">Активное подключение</param>
		public EntitySchemasHelper(UserConnection userConnection)
		{
			UserConnection = userConnection ?? throw new ArgumentNullException(nameof(userConnection));
		}

		#endregion

		#region Properties: Private



		#endregion

		#region Methods: Private

		private bool MatchBySchema(EntitySchemaConfig schemaConfig, FilterConfig filterConfig)
		{
			if (string.IsNullOrWhiteSpace(filterConfig.SchemaName))
			{
				return true;
			}
			return schemaConfig.Name.Contains(filterConfig.SchemaName) ||
				schemaConfig.Caption.Contains(filterConfig.SchemaName);
		}
		private bool MatchByColumn(EntitySchemaConfig schemaConfig, FilterConfig filterConfig)
		{
			if (string.IsNullOrWhiteSpace(filterConfig.ColumnName))
			{
				return true;
			}
			return schemaConfig.Columns.Any(it => it.Name.Contains(filterConfig.ColumnName) ||
				it.Caption.Contains(filterConfig.ColumnName));
		}

		#endregion

		#region Methods: Public

		internal IEnumerable<EntitySchemaConfig> GetSchemasList(FilterConfig filterConfig, bool force = false)
		{
			if (filterConfig is null)
			{
				throw new ArgumentNullException(nameof(filterConfig));
			}
			var result = new List<EntitySchemaConfig>();
			var schemaConfigs = EntitySchemaConfigs.Get(UserConnection.EntitySchemaManager, force);
			//int maxCount = 40;
			foreach (var schemaConfig in schemaConfigs)
			{
				if (!MatchBySchema(schemaConfig, filterConfig))
				{
					continue;
				}
				if (!MatchByColumn(schemaConfig, filterConfig))
				{
					continue;
				}
				result.Add(schemaConfig);
				//if (result.Count == maxCount) break;
			}
			return result;
		}

		#endregion
	}

	#endregion

	#region Class: FilterConfig
	[DataContract]
	public class FilterConfig
	{
		[DataMember]
		public string SchemaName { get; set; }
		[DataMember]
		public string ColumnName { get; set; }
	}

	#endregion

	#region Class: EntitySysSchemaConfig

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

	#endregion

	#region Class: EntitySchemaConfig

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
			Name = entitySchema.Name;
			Caption = entitySchema.Caption?.Value ?? nullString;
			ParentSchemaName = entitySchema.ParentSchema.Name;
			ParentSchemaCaption = entitySchema.ParentSchema.Caption?.Value ?? nullString;
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

	#endregion

	#region Class: ColumnConfig

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

	#endregion

	#region Class: EntitySchemaConfigs

	/// <summary>
	///  <see cref="EntitySchemaConfigs">
	/// </summary>
	internal static class EntitySchemaConfigs
	{

		#region Fields

		private static List<EntitySchemaConfig> entitySchemaConfigs;

		private static bool Initialized = false;
		private static readonly object _lockObject = new object();

		#endregion

		#region Methods: Private

		private static void InitInternal(EntitySchemaManager entitySchemaManager)
		{
			if (Initialized)
			{
				return;
			}
			if (entitySchemaConfigs != null)
			{
				return;
			}
			entitySchemaConfigs = new List<EntitySchemaConfig>();
			var entitySchemaManagerItems = entitySchemaManager.GetItems();
			Dictionary<EntitySchemaConfig, EntitySchema> entitySchemaConfigsDict = new Dictionary<EntitySchemaConfig, EntitySchema>();
			foreach (var entitySchemaManagerItem in entitySchemaManagerItems)
			{
				var entitySchema = entitySchemaManager.GetInstanceByName(entitySchemaManagerItem.Name);
				var schemaConfig = new EntitySchemaConfig(entitySchema);
				entitySchemaConfigsDict.Add(schemaConfig, entitySchema);
				entitySchemaConfigs.Add(schemaConfig);
			}
			foreach (var item in entitySchemaConfigsDict)
			{
				item.Key.InitColumns(item.Value, entitySchemaConfigs);
			}
			Initialized = true;
		}

		#endregion

		#region Methods: Public

		public static void Init(EntitySchemaManager entitySchemaManager, bool force = false)
		{
			lock (_lockObject)
			{
				if (force)
				{
					Initialized = false;
					entitySchemaConfigs = null;
				}
				InitInternal(entitySchemaManager);
			}
		}

		public static IEnumerable<EntitySchemaConfig> Get(EntitySchemaManager entitySchemaManager, bool force = false)
		{
			if (entitySchemaConfigs == null || force)
			{
				Init(entitySchemaManager, force);
			}
			return entitySchemaConfigs;
		}

		#endregion
	}

	#endregion

}