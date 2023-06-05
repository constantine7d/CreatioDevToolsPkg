namespace UsrDevTools
{

	using System;
	using Terrasoft.Core;
	using Terrasoft.Core.Configuration;
	using Terrasoft.Core.DB;
	using Terrasoft.Core.Entities;

	/// <summary>
	/// Хелпер  <see cref="CodeGeneratorHelper">
	/// </summary>
	public class CodeGeneratorHelper
	{
		#region Properties

		private UserConnection UserConnection { get; }

		#endregion

		#region Constructors

		/// <summary>
		/// Инициализация <see cref="CodeGeneratorHelper"/>.
		/// </summary>
		/// <param name="userConnection">Активное подключение</param>
		public CodeGeneratorHelper(UserConnection userConnection)
		{
			UserConnection = userConnection ?? throw new ArgumentNullException(nameof(userConnection));
		}

		#endregion

		#region Methods: Private

		private string GetSelectSQL(EntitySchema entitySchema)
		{
			var esq = new EntitySchemaQuery(entitySchema);
			esq.AddAllSchemaColumns();
			Select query = esq.GetSelectQuery(UserConnection);
			query.BuildParametersAsValue = true;
			return query.GetSqlText();
		}

		private string GetInsertSQL(EntitySchema entitySchema)
		{
			Entity entity = entitySchema.CreateEntity(UserConnection);
			entity.SetDefColumnValues();
			Insert query = entity.CreateInsert();
			query.BuildParametersAsValue = true;
			return query.GetSqlText();
		}

		private string GetUpdateSQL(EntitySchema entitySchema)
		{
			/*
			 var query = new Select(UserConnection)
					.Column("Product", "Id").As("ProductId")
				.From("Product")
				.LeftOuterJoin("UsrProductProperties").On("UsrProductProperties", "UsrProductId").IsEqual("Product", "Id")
				.Where("Product", "TypeId").In(Column.Parameters(typeList))
				as Select;

			query.BuildParametersAsValue = true;
			return query.GetSqlText();

			*/
			throw new NotImplementedException();
		}

		private string GetDeleteSQL(EntitySchema entitySchema)
		{
			throw new NotImplementedException();
		}

		#endregion

		#region Methods: Public
		public string GetSql(string type, string schemaName)
		{
			EntitySchema entitySchema = UserConnection.EntitySchemaManager.GetInstanceByName(schemaName);
			switch (type)
			{
				case "QuerySelectSQL":
					return GetSelectSQL(entitySchema);
				case "QueryInsertSQL":
					return GetInsertSQL(entitySchema);
				case "QueryUpdateSQL":
					return GetUpdateSQL(entitySchema);
				case "QueryDeleteSQL":
					return GetDeleteSQL(entitySchema);
			}

			throw new NotImplementedException($"CodeGeneratorHelper.GetSQL: type \"{type}\" not implemented");
		}

		#endregion
	}

}