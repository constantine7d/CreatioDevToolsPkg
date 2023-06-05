define(["require", "exports"], function (require, exports) {
	"use strict";

	const newLine = "\r\n";

	function lowerFirstLetter(string) {
		return string.charAt(0).toLowerCase() + string.slice(1);
	}

	/**
	 * @param {Schema} schema - The schema to use for generating the query.
	 * @return {String} generated query.
	 */
	function generateQueryEsqClient(schema) {
		const columnsAddArr = [];
		const columnsGetInObjArr = [];
		const columnsGetInVarArr = [];
		for (const column of schema.Columns) {
			columnsAddArr.push(`esq.addColumn("${column.Name}");`);
			columnsGetInObjArr.push(
				`${lowerFirstLetter(column.Name)}: item.get("${column.Name}"),`
			);
			columnsGetInVarArr.push(
				`const ${lowerFirstLetter(column.Name)} = item.get("${column.Name}");`
			);
		}
		const queryTemplate = `const esq = Ext.create("Terrasoft.EntitySchemaQuery", {
	rootSchemaName: "${schema.Name}"
});
esq.addColumn("Id", "PrimaryColumn");
esq.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_DISPLAY_COLUMN, "PrimaryDisplayColumn");
${columnsAddArr.join(newLine)}
//esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "ColumnName", value));
//optional
esq.addColumn("CreatedBy");
esq.addColumn("ModifiedBy");
esq.addColumn("ModifiedOn"); //CreatedOn
const sortColumn = esq.addColumn("CreatedOn"); //ModifiedOn
sortColumn.orderPosition = 0;
sortColumn.orderDirection = Terrasoft.OrderDirection.DESC;
//or simple esq.usrSetColumnSortDesc("ModifiedOn"); //from EntitySchemaQueryExtension
esq.rowCount = 20;
//..optional
//esq.getFirstOrDefaultEntity((entity) => {}); //from EntitySchemaQueryExtension
//esq.getFirstOrDefaultEntityValue(("columnName", entity) => {}); //from EntitySchemaQueryExtension
//const entityCollection = await esq.getEntityCollectionAsync(); //from EntitySchemaQueryExtension
//const entity = await esq.getFirstOrDefaultEntityAsync(); //from EntitySchemaQueryExtension
//const entityValue = await esq.getFirstOrDefaultEntityValueAsync("columnName"); //from EntitySchemaQueryExtension
esq.getEntityCollection((result) => {
	if (!result.success) {
		console.error(result);
		//callback(scope || this);
		return;
	}
	const arr = [];
	Terrasoft.each(
		result.collection.getItems(),
		(item) => {
			console.log({
				value: item.get("PrimaryColumn"),
				displayValue: item.get("PrimaryDisplayColumn")
			});
			const entity = {
				id: item.get("PrimaryColumn"),
				CreatedOn: item.get("CreatedOn")?.toISOString(),
				ModifiedOn: item.get("ModifiedOn")?.toISOString(),
				CreatedBy: esq.addColumn("CreatedBy"),
				ModifiedBy: esq.addColumn("ModifiedBy"),
				${columnsGetInObjArr.join(newLine)}
			}
			console.table(entity);
			const id = item.get("PrimaryColumn");
			${columnsGetInVarArr.join(newLine)}
			arr.push(entity);
		}
	);
	console.log(arr);
   console.table(arr);
});
`;
		return queryTemplate;
	}

	/**
	 * @param {Schema} schema - The schema to use for generating the query.
	 * @return {String} generated query.
	 */
	function generateQueryEsqServer(schema) {
		const columnsAddArr = [];
		const columnsGetArr = [];
		for (const column of schema.Columns) {
			columnsAddArr.push(`esq.AddColumn("${column.Name}").Name = "${column.Name}";`);
			columnsGetArr.push(
				`\tvar ${lowerFirstLetter(column.Name)} = entity.GetTypedColumnValue<${
					column.Type
				}>("${column.Name}");`
			);
		}
		const queryTemplate = `
var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "${schema.Name}");
//esq.AddAllSchemaColumns();
esq.PrimaryQueryColumn.IsAlwaysSelect = true; //Id. esq.PrimaryColumnValue
//esq.RowCount = 1;
//esq.AddColumn("CreatedOn").OrderByDesc();
${columnsAddArr.join(newLine)}
//esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "ColumnName", value));
EntityCollection entityCollection = esq.GetEntityCollection(UserConnection);
// if (entityCollection.IsEmpty()) { }
// if (entityCollection.IsNotEmpty()) { }
// Entity entity = entityCollection.FirstOrDefault();
// if (entity is null) { }
// if (entity != null) { }
foreach (var entity in entityCollection)
{
${columnsGetArr.join(newLine)}
}
`;
		return queryTemplate;
	}

	/**
	 * @param {Schema} schema - The schema to use for generating the query.
	 * @return {String} generated query.
	 */
	function generateQueryEsqServerForDataUtilities(schema) {
		//TODO generateQueryEsqServerForDataUtilities
		return "generateQueryEsqServerForDataUtilities";
	}

	/**
	 * @param {Schema} schema - The schema to use for generating the query.
	 * @return {String} generated query.
	 */
	function generateQuerySelectServer(schema) {
		//TODO generateQuerySelectServer
		return "generateQuerySelectServer";
	}

	/**
	 * Represents a column in a schema.
	 *
	 * @typedef {Object} Column
	 * @property {string} Caption - The caption of the column.
	 * @property {string} DataTypeName - The name of the data type of the column.
	 * @property {any} DefValue - The default value of the column.
	 * @property {string} LookupCaption - The caption of the lookup associated with the column.
	 * @property {string} Name - The name of the column.
	 * @property {string} Parent - The name of the parent schema.
	 * @property {string} ReferenceSchema - The name of the reference schema associated with the column.
	 * @property {string} RequirementType - The requirement type of the column.
	 * @property {string} Type - The type of the column.
	 */

	/**
	 * Represents a system schema.
	 *
	 * @typedef {Object} SysSchema
	 * @property {boolean} ExtendParent - Indicates if the parent schema is extended.
	 * @property {number} InstallType - The install type of the schema.
	 * @property {string} Maintainer - The maintainer of the schema.
	 * @property {string} PackageName - The name of the package associated with the schema.
	 * @property {string} UId - The UID of the schema.
	 */

	/**
	 * Represents a entity schema information.
	 *
	 * @typedef {Object} Schema
	 * @property {string} Caption - The caption of the schema.
	 * @property {Array<Column>} Columns - An array of columns in the schema.
	 * @property {string} Name - The name of the schema.
	 * @property {string} ParentSchemaCaption - The caption of the parent schema.
	 * @property {string} ParentSchemaName - The name of the parent schema.
	 * @property {Array<SysSchema>} SysSchemas - An array of system schemas.
	 * @property {string} Type - The type of the schema.
	 */

	/**
	 * Generates code based on the given type and schema.
	 *
	 * @param {string} type - The type of query to generate.
	 * @param {Schema} schema - The schema to use for generating the query.
	 * @return {string} The generated code.
	 */
	const generate = function (type, schema) {
		let generatedCode = "";
		switch (type) {
			case "QueryEsqClient":
				generatedCode = generateQueryEsqClient(schema);
				break;
			case "QueryEsqServer":
				generatedCode = generateQueryEsqServer(schema);
				break;
			case "QueryEsqServerForDataUtilities":
				generatedCode = generateQueryEsqServerForDataUtilities(schema);
				break;
			case "QuerySelectServer":
				generatedCode = generateQuerySelectServer(schema);
				break;
			default:
				console.error(`generateQuery: type "${type}" not implemented`);
				return `generateQuery: type "${type}" not implemented`;
		}
		return generatedCode;
	};
	return { generate: generate };
});
