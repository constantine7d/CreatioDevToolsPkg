namespace UsrDevTools
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using Terrasoft.Core;

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

}