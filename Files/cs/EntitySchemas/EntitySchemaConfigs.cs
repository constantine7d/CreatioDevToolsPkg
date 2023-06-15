namespace UsrDevTools
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using Terrasoft.Core.Entities;

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
			if (entitySchemaManager is null)
			{
				throw new ArgumentNullException(nameof(entitySchemaManager));
			}

			if (entitySchemaConfigs == null || force)
			{
				Init(entitySchemaManager, force);
			}
			return entitySchemaConfigs;
		}

		public static EntitySchemaConfig Get(EntitySchemaManager entitySchemaManager, string schemaName)
		{
			if (entitySchemaManager is null)
			{
				throw new ArgumentNullException(nameof(entitySchemaManager));
			}

			if (string.IsNullOrEmpty(schemaName))
			{
				throw new ArgumentException($"'{nameof(schemaName)}' cannot be null or empty.", nameof(schemaName));
			}

			if (entitySchemaConfigs == null)
			{
				Init(entitySchemaManager);
			}
			return entitySchemaConfigs.Where(it => it.Name == schemaName).First();
		}

		#endregion
	}

}