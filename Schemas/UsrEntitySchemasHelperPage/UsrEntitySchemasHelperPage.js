define("UsrEntitySchemasHelperPage", ["UsrDevHelpersUtilsJs", "UsrGenerateQueryJs"], function (
	DevHelpersUtils,
	GenerateQuery
) {
	const SCHEMA_ROW_ELEMENT_TYPE_NAME = "Schema";
	const COLUMN_ROW_ELEMENT_TYPE_NAME = "Column";
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

	let schemasList = null;
	const filterTip =
		'Default filter is "strats with". Start with "%" for contains filter. Start or end with "=" for equals filter.';
	const SaveAttrList = ["SkipPackageDialog", "DblClickAction"];
	return {
		messages: {},
		diff: /**SCHEMA_DIFF*/ [
			{
				"operation": "insert",
				"name": "ModulePageContainer",
				"propertyName": "items",
				"values": {
					"id": "EntitySchemasHelperPageContainer",
					"itemType": this.Terrasoft.ViewItemType.CONTAINER,
					"items": [],
					"wrapClass": ["header-container-margin-bottom"]
				}
			},
			{
				"operation": "insert",
				"name": "HeaderContainer",
				"parentName": "ModulePageContainer",
				"propertyName": "items",
				"values": {
					"itemType": this.Terrasoft.ViewItemType.CONTAINER,
					"items": [],
					"wrapClass": ["header-container"]
				}
			},
			{
				"operation": "insert",
				"name": "PublishButtonContainer",
				"propertyName": "items",
				"parentName": "ModulePageContainer",
				"values": {
					"itemType": this.Terrasoft.ViewItemType.CONTAINER,
					"items": [],
					"wrapClass": ["publishButton"]
				}
			},
			{
				"operation": "insert",
				"name": "GridContainer",
				"propertyName": "items",
				"parentName": "ModulePageContainer",
				"values": {
					"itemType": this.Terrasoft.ViewItemType.CONTAINER,
					"items": [],
					"wrapClass": ["gridContainer"]
				}
			},
			{
				"operation": "insert",
				"name": "FooterContainer",
				"parentName": "ModulePageContainer",
				"propertyName": "items",
				"values": {
					"itemType": this.Terrasoft.ViewItemType.CONTAINER,
					"items": [],
					"wrapClass": ["footer-container"]
				}
			},
			{
				"operation": "insert",
				"name": "FindSchemaValue",
				"parentName": "HeaderContainer",
				"propertyName": "items",
				"values": {
					"bindTo": "FindSchemaValue",
					"wrapClass": ["header-element"],
					"tip": { "content": filterTip }
				}
			},
			{
				"operation": "insert",
				"name": "FindSchemaColumnValue",
				"parentName": "HeaderContainer",
				"propertyName": "items",
				"values": {
					"bindTo": "FindSchemaColumnValue",
					"wrapClass": ["header-element"],
					"tip": { "content": filterTip }
				}
			},
			{
				"operation": "insert",
				"name": "FindSchemaColumnByLookupValue",
				"parentName": "HeaderContainer",
				"propertyName": "items",
				"values": {
					"bindTo": "FindSchemaColumnByLookupValue",
					"wrapClass": ["header-element"],
					"tip": { "content": filterTip }
				}
			},
			{
				"operation": "insert",
				"name": "ShowOnlyFilteredColumnsValue",
				"parentName": "HeaderContainer",
				"propertyName": "items",
				"values": {
					"bindTo": "ShowOnlyFilteredColumnsValue",
					"wrapClass": ["header-element"]
				}
			},
			{
				"operation": "insert",
				"name": "MaxSchemaRowCount",
				"parentName": "HeaderContainer",
				"propertyName": "items",
				"values": {
					"id": "UsrLoadMaxSchemaRowCount",
					"bindTo": "MaxSchemaRowCount",
					"wrapClass": ["header-element"],
					"caption": { "bindTo": "MaxSchemaRowCountCaption" }
				}
			},
			{
				"operation": "insert",
				"name": "SkipPackageDialog",
				"parentName": "HeaderContainer",
				"propertyName": "items",
				"values": {
					"bindTo": "SkipPackageDialog",
					"wrapClass": ["header-element"]
				}
			},
			{
				"operation": "insert",
				"name": "DblClickAction",
				"parentName": "HeaderContainer",
				"propertyName": "items",
				"values": {
					"contentType": Terrasoft.ContentType.ENUM,
					"bindTo": "DblClickAction",
					"controlConfig": {
						"list": { "bindTo": "DblClickActionList" },
						"prepareList": {
							"bindTo": "onPrepareDblClickActionList"
						}
					},
					"wrapClass": ["header-element"]
				}
			},
			{
				"operation": "insert",
				"name": "ReloadButton",
				"propertyName": "items",
				"parentName": "PublishButtonContainer",
				"values": {
					"itemType": this.Terrasoft.ViewItemType.BUTTON,
					"style": this.Terrasoft.controls.ButtonEnums.style.BLUE,
					"caption": "Reload / Collapse all",
					"click": {
						"bindTo": "reloadData"
					}
				}
			},
			{
				"operation": "insert",
				"name": "ForceReloadButton",
				"propertyName": "items",
				"parentName": "PublishButtonContainer",
				"values": {
					"itemType": this.Terrasoft.ViewItemType.BUTTON,
					"style": this.Terrasoft.controls.ButtonEnums.style.BLUE,
					"caption": "Force Reload",
					"click": {
						"bindTo": "forceReloadData"
					}
				}
			},
			{
				"operation": "insert",
				"name": "DataGrid",
				"parentName": "GridContainer",
				"propertyName": "items",
				"values": {
					safeBind: true,
					itemType: Terrasoft.ViewItemType.GRID,
					listedZebra: true,
					collection: { "bindTo": "GridData" },
					selectRow: { "bindTo": "rowSelected" },
					activeRow: { "bindTo": "ActiveRow" },
					openRecord: { "bindTo": "onGridDoubleClick" },
					activeRowAction: { "bindTo": "onActiveRowAction" },
					activeRowActions: [
						{
							className: "Terrasoft.Button",
							style: Terrasoft.controls.ButtonEnums.style.TRANSPERENT,
							caption: "Edit schema",
							tag: "Edit",
							visible: { "bindTo": "getActiveRowActionVisible" }
						},
						{
							className: "Terrasoft.Button",
							style: Terrasoft.controls.ButtonEnums.style.TRANSPERENT,
							caption: "Copy path",
							tag: "CopyPath",
							visible: { "bindTo": "getActiveRowActionVisible" },
							menu: {
								items: [
									{
										caption: "En",
										tag: "CopyEn"
									},
									{
										caption: "Ru",
										tag: "CopyRu"
									},
									{
										caption: "RuEn",
										tag: "CopyRuEn"
									},
									{
										caption: "En+S",
										tag: "CopyEnWithSchema"
									},
									{
										caption: "Ru+S",
										tag: "CopyRuWithSchema"
									},
									{
										caption: "RuEn+S",
										tag: "CopyRuEnWithSchema"
									}
								]
							}
						},
						{
							className: "Terrasoft.Button",
							style: Terrasoft.controls.ButtonEnums.style.TRANSPERENT,
							caption: "Generate Code",
							tag: "GenerateCode",
							visible: { "bindTo": "getActiveRowActionVisible" },
							menu: {
								items: [
									{
										caption: "ConstantsJs",
										tag: "ConstantsJs"
									},
									{
										caption: "ConstantsCs",
										tag: "ConstantsCs"
									},
									{
										caption: "Client Esq",
										tag: "QueryEsqClient"
									},
									{
										caption: "Server Esq",
										tag: "QueryEsqServer"
									},
									{
										caption: "Server Esq for DataUtilities",
										tag: "QueryEsqServerForDataUtilities"
									},
									{
										caption: "Server Select",
										tag: "QuerySelect"
									},
									{
										caption: "SQL Select",
										tag: "QuerySelectSQL"
									},
									{
										caption: "SQL Insert",
										tag: "QueryInsertSQL"
									},
									{
										caption: "SQL Update",
										tag: "QueryUpdateSQL"
									},
									{
										caption: "SQL Delete",
										tag: "QueryDeleteSQL"
									}
								]
							}
						}
					],
					primaryColumnName: "Id",
					selectedRows: { "bindTo": "SelectedRows" },
					type: "listed",
					captionsConfig: [
						{
							cols: 8,
							name: "Name"
						},
						{
							cols: 6,
							name: "Caption"
						},
						{
							cols: 10,
							name: "AddInfo"
						}
					],
					columnsConfig: [
						{
							cols: 8,
							key: [
								{
									name: {
										bindTo: "Name"
									}
								}
							]
						},
						{
							cols: 6,
							key: [
								{
									name: {
										bindTo: "Caption"
									}
								}
							]
						},
						{
							cols: 10,
							key: [
								{
									name: {
										bindTo: "AddInfo"
									}
								}
							]
						}
					],
					hierarchical: true,
					hierarchicalColumnName: "Parent",
					expandHierarchyLevels: { "bindTo": "ExpandHierarchyLevels" },
					updateExpandHierarchyLevels: { "bindTo": "onExpandHierarchyLevels" },
					autoExpandHierarchyLevels: true
				}
			},
			{
				"operation": "insert",
				"parentName": "FooterContainer",
				"propertyName": "items",
				"name": "ResultText",
				"values": {
					"bindTo": "ResultText",
					"contentType": Terrasoft.ContentType.LONG_TEXT,
					"labelConfig": {
						"visible": false
					}
				}
			}
		] /**SCHEMA_DIFF*/,
		attributes: {
			/**
			 * Publish message enabled flag.
			 */
			"IsPublishButtonEnabled": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN
			},
			/**
			 * Publish button hint.
			 */
			"PublishButtonHint": {
				dataValueType: this.Terrasoft.DataValueType.TEXT
			},

			/**
			 * Collection of the menu items.
			 * @type {Terrasoft.ObjectCollection}
			 */
			"GridData": {
				dataValueType: Terrasoft.DataValueType.COLLECTION
			},
			"SelectedRows": {
				dataValueType: Terrasoft.DataValueType.COLLECTION
			},
			"ActiveRow": {
				dataValueType: Terrasoft.DataValueType.TEXT
			},
			/**
			 * List of expand hierarchy levels folder.
			 */
			"ExpandHierarchyLevels": {
				dataValueType: Terrasoft.DataValueType.COLLECTION
			},
			"ResponseCollection": {
				dataValueType: Terrasoft.DataValueType.COLLECTION
			},
			"FindSchemaValue": {
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"dataValueType": Terrasoft.DataValueType.TEXT,
				"caption": "Schema",
				"value": "",
				"onChange": "reloadData"
			},
			"FindSchemaColumnValue": {
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"dataValueType": Terrasoft.DataValueType.TEXT,
				"caption": "Column",
				"value": "",
				"onChange": "reloadData"
			},
			"FindSchemaColumnByLookupValue": {
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"dataValueType": Terrasoft.DataValueType.TEXT,
				"caption": "ByLookup",
				"value": "",
				"onChange": "reloadData"
			},
			"ShowOnlyFilteredColumnsValue": {
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"caption": "Show only filtered columns",
				"value": "",
				"onChange": "reloadData"
			},
			"MaxSchemaRowCount": {
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"dataValueType": Terrasoft.DataValueType.INTEGER,
				"caption": "MaxSchemaRowCount",
				"value": 50,
				"onChange": "reloadData"
			},
			"MaxSchemaRowCountCaption": {
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"dataValueType": Terrasoft.DataValueType.TEXT,
				"value": "MaxSchemaRowCount"
			},
			"SkipPackageDialog": {
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"caption": "Skip package dialog",
				"onChange": "saveAttributes"
			},
			"ResultText": {
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"dataValueType": Terrasoft.DataValueType.TEXT,
				"caption": ""
			},
			"DblClickActionList": {
				dataValueType: Terrasoft.DataValueType.COLLECTION
			},
			"DblClickAction": {
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"dataValueType": Terrasoft.DataValueType.ENUM,
				"caption": "DblClickAction",
				"value": "CopyEn",
				"onChange": "saveAttributes"
			}
		},
		methods: {
			callService: function (methodName, data) {
				return DevHelpersUtils.callService(
					"UsrEntitySchemasHelperService",
					methodName,
					this,
					data
				);
			},
			callCodeGeneratorService: function (methodName, data) {
				return DevHelpersUtils.callService(
					"UsrCodeGeneratorService",
					methodName,
					this,
					data
				);
			},

			/**
			 * @inheritdoc Terrasoft.BaseSchemaModule#init
			 * @overridden
			 */
			init: function () {
				this.callParent(arguments);
				this.initGridData();
				this.set("SelectedRows", Ext.create("Terrasoft.BaseViewModelCollection"));
				this.set("ExpandHierarchyLevels", []);
				this.set("ResponseCollection", Ext.create("Terrasoft.BaseViewModelCollection"));
				this.set("DblClickActionList", this.Ext.create("Terrasoft.Collection"));
				this.initCustomSysSettings();
				DevHelpersUtils.loadAttributes(this, SaveAttrList);
			},

			saveAttributes: function () {
				DevHelpersUtils.saveAttributes(this, SaveAttrList);
			},

			initCustomSysSettings: function (callback, scope) {
				Terrasoft.SysSettings.querySysSettings(
					["CurrentPackageId", "Maintainer"],
					function (values) {
						this.set("CurrentPackageId", values.CurrentPackageId);
						this.set("Maintainer", values.Maintainer);
						if (callback) {
							callback.call(scope || this);
						}
					},
					this
				);
			},

			/**
			 * Executes when view was rendered.
			 * @overridden
			 * @protected
			 */
			onRender: function () {
				this.callParent(arguments);
				this.loadData({});
			},

			/* #region Hierarchy */

			addItem: function (columnValues, dataCollection) {
				const columnId = this.getId(columnValues);
				if (dataCollection.findByAttr("Id", columnId)) {
					return;
				}
				const row = this.createRowViewModel(columnValues);
				dataCollection.add(row.get("Id"), row);
			},

			getColumns: function () {
				return {
					Id: {
						dataValueType: Terrasoft.DataValueType.TEXT
					},
					Parent: {
						dataValueType: Terrasoft.DataValueType.TEXT
					},
					Name: {
						dataValueType: Terrasoft.DataValueType.TEXT
					},
					Caption: {
						dataValueType: Terrasoft.DataValueType.TEXT
					},
					AddInfo: {
						dataValueType: Terrasoft.DataValueType.TEXT
					},
					ParentSchemaName: {
						dataValueType: Terrasoft.DataValueType.TEXT
					},
					ParentSchemaCaption: {
						dataValueType: Terrasoft.DataValueType.TEXT
					},
					Type: {
						dataValueType: Terrasoft.DataValueType.TEXT
					},
					Columns: {
						dataValueType: Terrasoft.DataValueType.COLLECTION
					},
					SysSchemas: {
						dataValueType: Terrasoft.DataValueType.COLLECTION
					}
				};
			},

			createRowViewModel: function (columnValues, id, parent) {
				const viewModel = Ext.create("Terrasoft.BaseViewModel", {
					columns: this.getColumns(),
					values: {
						Id: id || this.getId(columnValues),
						Name: columnValues.Name,
						Caption: columnValues.Caption,
						Parent: parent || columnValues.Parent || "",
						Type: columnValues.Type,
						Columns: columnValues.Columns || [],
						SysSchemas: columnValues.SysSchemas || []
					},
					methods: {
						getActiveRowActionVisible: this.getActiveRowActionVisible
					}
				});
				switch (viewModel.$Type) {
					case COLUMN_ROW_ELEMENT_TYPE_NAME:
						let addInfo = columnValues.DataTypeName;
						if (
							columnValues.RequirementType &&
							columnValues.RequirementType !== "None"
						) {
							addInfo += `, Required`;
						}
						if (columnValues.DefValue) {
							addInfo += `, Def:${columnValues.DefValue}`;
						}
						if (columnValues.ReferenceSchema) {
							viewModel.set("HasNesting", 1);
							viewModel.$ParentSchemaName = columnValues.ReferenceSchema.Name;
							viewModel.$ParentSchemaCaption = columnValues.ReferenceSchema.Caption;
							addInfo += `, L:${columnValues.ReferenceSchema.Name} (${columnValues.ReferenceSchema.Caption})`;
						}
						viewModel.$AddInfo = addInfo;
						break;
					case SCHEMA_ROW_ELEMENT_TYPE_NAME:
						viewModel.set("HasNesting", 1);
						viewModel.$ParentSchemaName = columnValues.ParentSchemaName;
						viewModel.$ParentSchemaCaption = columnValues.ParentSchemaCaption;
						viewModel.$AddInfo = `Parent: ${columnValues.ParentSchemaName} (${columnValues.ParentSchemaCaption})`;
						break;
					default:
						throw new Error("Unknown type " + viewModel.$Type);
				}
				viewModel.sandbox = this.sandbox;
				return viewModel;
			},

			getId: function (item, type) {
				type = type || item.Type;
				switch (type) {
					case COLUMN_ROW_ELEMENT_TYPE_NAME:
						return item.Parent + item.Name;
					case SCHEMA_ROW_ELEMENT_TYPE_NAME:
						return item.Name;
					default:
						throw new Error("Unknown type " + type);
				}
			},

			loadHeadItems: function () {
				const gridData = this.getGridData();
				gridData.clear();
				this.$SelectedRows.clear();
				const responseCollection = this.get("ResponseCollection");
				const collection = this.Ext.create("Terrasoft.BaseViewModelCollection");
				this.Terrasoft.each(
					responseCollection.getItems(),
					function (item) {
						if (!item.get("Parent")) {
							collection.add(item.get("Id"), item);
						}
					},
					this
				);
				this.addItemsToGridData(collection);
				if (this.$ShowOnlyFilteredColumnsValue) {
					this.Terrasoft.each(collection.getItems(), item => {
						this.expandHierarchy(item.get("Id"));
					});
				}
			},

			initGridData: function () {
				const gridData = Ext.create("Terrasoft.BaseViewModelCollection");
				this.set("GridData", gridData);
			},

			getCurrentGrid: function () {
				return Ext.getCmp(this.name + "DataGridGrid");
			},

			getGridData: function () {
				return this.get("GridData");
			},

			expandHierarchy: function (rowId) {
				if (this.$ExpandHierarchyLevels.includes(rowId)) {
					return;
				}
				const elementId = this.name + "DataGridGrid-toggle-" + rowId;
				document.getElementById(elementId).click();
			},

			deExpandHierarchy: function () {
				this.$ExpandHierarchyLevels
					.slice()
					.reverse()
					.forEach(rowId => {
						const elementId = this.name + "DataGridGrid-toggle-" + rowId;
						document.getElementById(elementId).click();
					});
			},

			loadLookupColumnChildItems: function (currentRow, collection) {
				const gridData = this.getGridData();
				if (currentRow.$ParentSchemaName) {
					const schema = schemasList.find(it => it.Name === currentRow.$ParentSchemaName);
					schema.Columns.forEach(column => {
						const itemId = currentRow.$Id + column.Name;
						if (!gridData.contains(itemId)) {
							const item = this.createRowViewModel(column, itemId, currentRow.$Id);
							collection.add(item.get("Id"), item);
						}
					});
				}
			},

			loadChildItems: function (itemKey, callback, isSilentMode) {
				const gridData = this.getGridData();
				const currentRow = gridData.get(itemKey);
				const type = currentRow.$Type;
				const responseCollection = this.get("ResponseCollection");
				const collection = this.Ext.create("Terrasoft.BaseViewModelCollection");
				switch (type) {
					case SCHEMA_ROW_ELEMENT_TYPE_NAME:
						this.Terrasoft.each(responseCollection.getItems(), item => {
							if (
								item.get("Parent") === itemKey &&
								!gridData.contains(item.get("Id"))
							) {
								collection.add(item.get("Id"), item);
							}
						});
						break;
					case COLUMN_ROW_ELEMENT_TYPE_NAME:
						this.loadLookupColumnChildItems(currentRow, collection);
						break;
				}
				this.addItemsToGridData(collection, {
					mode: "child",
					target: itemKey
				});
			},

			onExpandHierarchyLevels: function (itemKey, expanded, callback, isSilentMode) {
				this.loadChildItems(itemKey, callback, isSilentMode);
			},

			addItemsToGridData: function (collection, options) {
				if (collection.getCount() === 0) {
					return;
				}
				const gridData = this.getGridData();
				gridData.loadAll(collection, options);
			},

			reloadData: function () {
				this.deExpandHierarchy();
				this.loadData({});
			},

			forceReloadData: function () {
				this.deExpandHierarchy();
				schemasList = null;
				this.loadData({ force: true });
			},

			/* #endregion */

			/* #region Load data and filters */

			matchStrPart: function (targetFind, findPart, starts, ends) {
				if (!starts && !ends) {
					return targetFind === findPart;
				}
				if (!starts && ends) {
					return targetFind.startsWith(findPart);
				}
				if (starts && !ends) {
					return targetFind.endsWith(findPart);
				}
				return targetFind.includes(findPart);
			},

			matchStr: function (target, find) {
				if (!find) {
					return true;
				}
				let starts = find.startsWith("%");
				let ends = true;
				if (find.startsWith("=") || find.endsWith("=")) {
					starts = false;
					ends = false;
				}
				const preparedFindStr = find.replace("=", "").toLowerCase();
				const parts = preparedFindStr.split("%").filter(part => part.length > 0);
				let currentTarget = target.toLowerCase();
				if (parts.length === 1) {
					return this.matchStrPart(currentTarget, parts[0], starts, ends);
				}
				for (let i = 0; i < parts.length; i++) {
					const findStr = parts[i];
					if (i === 0 && !starts) {
						if (!currentTarget.startsWith(findStr)) {
							return false;
						}
					}
					const index = currentTarget.indexOf(findStr);
					if (index < 0) {
						return false;
					}
					currentTarget = currentTarget.slice(index + findStr.length);
				}
				return true;
			},

			matchBySchema: function (schemaConfig) {
				const schemaName = this.$FindSchemaValue;
				if (!schemaName) {
					return true;
				}
				return (
					this.matchStr(schemaConfig.Name, schemaName) ||
					this.matchStr(schemaConfig.Caption, schemaName)
				);
			},

			matchByColumn: function (column) {
				const columnName = this.$FindSchemaColumnValue;
				const lookupName = this.$FindSchemaColumnByLookupValue;
				if (!columnName && !lookupName) {
					return true;
				}
				if (columnName) {
					if (
						this.matchStr(column.Name, columnName) ||
						this.matchStr(column.Caption, columnName)
					) {
						return true;
					}
				}
				if (lookupName && column.ReferenceSchema) {
					if (
						this.matchStr(column.ReferenceSchema.Name, lookupName) ||
						this.matchStr(column.ReferenceSchema.Caption, lookupName)
					) {
						return true;
					}
				}
				return false;
			},

			matchByColumns: function (schemaConfig) {
				const columnName = this.$FindSchemaColumnValue;
				const lookupName = this.$FindSchemaColumnByLookupValue;
				if (!columnName && !lookupName) {
					return true;
				}
				return schemaConfig.Columns.some(it => this.matchByColumn(it));
			},

			matchByFilters: function (schemaConfig) {
				return this.matchBySchema(schemaConfig) && this.matchByColumns(schemaConfig);
			},

			/**
			 * Asynchronously loads the schemas list
			 * @return {Promise<Array<Schema>>} A Promise that resolves with the schemasList.
			 */
			loadSchemasList: async function ({ force = false }) {
				return await this.callService("GetSchemasList", {
					filterConfig: {
						SchemaName: "", //this.$FindSchemaValue,
						ColumnName: "" //this.$FindSchemaColumnValue
					},
					force: force
				});
			},

			loadData: async function ({ force = false }) {
				this.showBodyMask();
				this.$MaxSchemaRowCountCaption = "MaxSchemaRowCount";
				document.getElementById("UsrLoadMaxSchemaRowCount").style.backgroundColor = "";
				if (schemasList === null) {
					schemasList = await this.loadSchemasList({ force: force });
				}
				const responseCollection = this.get("ResponseCollection");
				responseCollection.clear();
				let addedCount = 0;
				for (const item of schemasList) {
					if (!this.matchByFilters(item)) {
						continue;
					}
					this.addItem(item, responseCollection);
					this.Terrasoft.each(item.Columns, column => {
						if (this.$ShowOnlyFilteredColumnsValue) {
							if (this.matchByColumn(column)) {
								this.addItem(column, responseCollection);
							}
						} else {
							this.addItem(column, responseCollection);
						}
					});
					addedCount++;
					if (addedCount >= this.$MaxSchemaRowCount) {
						this.$MaxSchemaRowCountCaption = "Max reached. MaxSchemaRowCount";
						document.getElementById("UsrLoadMaxSchemaRowCount").style.backgroundColor =
							"yellow";
						break;
					}
				}
				this.loadHeadItems();
				this.hideBodyMask();
			},

			/* #endregion */

			/* #region Utils */

			openLink: function (key) {
				window.open(Terrasoft.workspaceBaseUrl + key);
			},

			openSchema: function (sysSchema) {
				const link = `/ClientApp/#/EntitySchemaDesigner/${sysSchema.UId}`;
				this.openLink(link);
			},

			openSchemaPackagePopup: function (recordId) {
				const row = this.getGridData().get(recordId);
				if (row.$Type !== SCHEMA_ROW_ELEMENT_TYPE_NAME) {
					return;
				}
				if (row.$SysSchemas.length === 1) {
					this.openSchema(row.$SysSchemas[0]);
					return;
				}
				if (this.get("SkipPackageDialog")) {
					const setSysSchema = this.getDefaultSysSchema(row.$SysSchemas);
					if (setSysSchema) {
						this.openSchema(setSysSchema);
						return;
					}
				}
				this.openPackagePopup(row.$SysSchemas, this.openSchema, this);
			},

			getDefaultSysSchema: function (sysSchemas) {
				const currentPackageId = this.get("CurrentPackageId");
				const maintainer = this.get("Maintainer");
				let setSysSchema = sysSchemas.find(
					it => it.PackageName === currentPackageId.displayValue
				);
				if (!setSysSchema) {
					setSysSchema = sysSchemas.find(
						it => it.Maintainer === maintainer && it.InstallType === 0
					);
				}
				if (!setSysSchema) {
					setSysSchema = sysSchemas.find(
						it => it.Maintainer !== maintainer && it.InstallType === 0
					);
				}
				return setSysSchema;
			},

			openPackagePopup: function (sysSchemas, callback, scope) {
				this.set("PackagesPopupList", new Terrasoft.Collection());
				this.set("PackagesPopupCollection", sysSchemas);
				const buttons = [
					Terrasoft.MessageBoxButtons.OK,
					Terrasoft.MessageBoxButtons.CANCEL
				];
				Terrasoft.utils.inputBox(
					"SelectSchemaPackage",
					function (result, arg) {
						const selectedPackage = arg.PackagePopup.value;
						if (
							result === Terrasoft.MessageBoxButtons.OK.returnCode &&
							!Ext.isEmpty(selectedPackage)
						) {
							callback.call(scope, arg.PackagePopup.value);
						}
					},
					buttons,
					this,
					{
						PackagePopup: {
							"dataValueType": Terrasoft.DataValueType.ENUM,
							"value": { "bindTo": "PackagePopup" },
							"customConfig": {
								"list": { "bindTo": "PackagesPopupList" },
								"prepareList": { "bindTo": "prepareSchemaPackagesPopupList" }
							}
						}
					},
					{
						customWrapClass: "glb-databinding-package-msg"
					}
				);
				Terrasoft.each(
					Terrasoft.MessageBox.controlArray,
					function (item) {
						item.control.bind(this);
					},
					this
				);

				this.set("PackagePopup", null);
				const setSysSchema = this.getDefaultSysSchema(sysSchemas);
				if (setSysSchema) {
					setSysSchema.value = setSysSchema.PackageName;
					setSysSchema.displayValue = setSysSchema.PackageName;
					this.set("PackagePopup", setSysSchema);
				}
			},

			prepareSchemaPackagesPopupList: function (searchValue, list) {
				const packagesCollection = this.get("PackagesPopupCollection");
				if (list && packagesCollection.length > 0) {
					list.clear();
					const objects = {};
					packagesCollection.sort(function (a, b) {
						if (a.PackageName < b.PackageName) {
							return -1;
						} else if (a.PackageName > b.PackageName) {
							return 1;
						}
						return 0;
					});
					packagesCollection.forEach(item => {
						item.value = item.PackageName;
						item.displayValue = item.PackageName;
						objects[item.PackageName] = item;
					});
					list.loadAll(objects);
				}
			},

			generateConstants: async function (type, recordId) {
				const gridData = this.getGridData();
				const currentRow = gridData.get(recordId);
				let schemaName = currentRow.$Name;
				if (currentRow.$Type === COLUMN_ROW_ELEMENT_TYPE_NAME) {
					schemaName = currentRow.$ParentSchemaName;
				}
				let generatedCode = "";
				switch (type) {
					case "ConstantsJs":
						generatedCode = await DevHelpersUtils.generateConstantsClient(schemaName);
						break;
					case "ConstantsCs":
						generatedCode = await DevHelpersUtils.generateConstantsServer(schemaName);
						break;
					default:
						console.error(`generateConstants: type "${type}" not implemented`);
						return;
				}
				this.$ResultText = generatedCode;
				this.copyData(generatedCode);
			},

			generateQuery: function (type, recordId) {
				const gridData = this.getGridData();
				const currentRow = gridData.get(recordId);
				let schemaName = currentRow.$Name;
				if (currentRow.$Type === COLUMN_ROW_ELEMENT_TYPE_NAME) {
					schemaName = currentRow.$ParentSchemaName;
				}
				const schema = schemasList.find(it => it.Name === schemaName);
				const generatedCode = GenerateQuery.generate(type, schema);
				this.$ResultText = generatedCode;
				this.copyData(generatedCode);
			},

			generateSqlQuery: async function (type, recordId) {
				const gridData = this.getGridData();
				const currentRow = gridData.get(recordId);
				let schemaName = currentRow.$Name;
				if (currentRow.$Type === COLUMN_ROW_ELEMENT_TYPE_NAME) {
					schemaName = currentRow.$ParentSchemaName;
				}
				const generatedCode = await this.callCodeGeneratorService("GetSql", {
					type: type,
					schemaName: schemaName
				});
				this.$ResultText = generatedCode;
				this.copyData(generatedCode);
			},

			getCopyColumnPathByAttr: function (attrName, recordId, withSchema) {
				const withBracket = attrName === "Caption";
				const getName = currentRow => {
					return withBracket
						? `"${currentRow.get(attrName)}"`
						: `${currentRow.get(attrName)}`;
				};
				const gridData = this.getGridData();
				let currentRow = gridData.get(recordId);
				let parent = currentRow.$Parent;
				let result = "";
				while (parent) {
					result = `.${getName(currentRow)}${result}`;
					currentRow = gridData.get(parent);
					parent = currentRow.$Parent;
				}
				if (withSchema || !result) {
					result = `${getName(currentRow)}${result}`;
				} else {
					result = result.slice(1);
				}
				return result;
			},

			getCopyColumnPath: function (actionName, recordId) {
				const withSchema = actionName.includes("WithSchema");
				switch (actionName) {
					case "CopyEn":
					case "CopyEnWithSchema":
						return this.getCopyColumnPathByAttr("Name", recordId, withSchema);
					case "CopyRu":
					case "CopyRuWithSchema":
						return `${this.getCopyColumnPathByAttr("Caption", recordId, withSchema)}`;
					case "CopyRuEn":
					case "CopyRuEnWithSchema":
						return (
							this.getCopyColumnPathByAttr("Caption", recordId, withSchema) +
							` (${this.getCopyColumnPathByAttr("Name", recordId, withSchema)})`
						);
					default:
						return "";
				}
			},

			copyData: function (text) {
				let oText;
				try {
					oText = document.createElement("textarea");
					const insertAfterEl = document.getElementsByClassName("grid-row-actions");
					if (insertAfterEl.length) {
						$(oText)
							.addClass("clipboardCopier")
							.val(text)
							.insertAfter(insertAfterEl[0])
							.focus();
					} else {
						$(oText).addClass("clipboardCopier").val(text).insertAfter("head").focus();
					}
					oText.select();
					document.execCommand("Copy");
				} finally {
					$(oText).remove();
				}
				console.info(`copyData: ${text}`);
			},

			copyColumnPath: function (actionName, recordId) {
				const result = this.getCopyColumnPath(actionName, recordId);
				this.$ResultText = result;
				this.copyData(result);
			},

			/* #endregion */

			/* #region ActiveRowActions */

			getActiveRowActionVisible: function (activeRowElTag) {
				const type = this.$Type;
				if (type === SCHEMA_ROW_ELEMENT_TYPE_NAME) {
					switch (activeRowElTag) {
						case "Edit":
						case "GenerateCode":
							return true;
					}
				}
				if (type === COLUMN_ROW_ELEMENT_TYPE_NAME) {
					switch (activeRowElTag) {
						case "CopyPath":
							return true;
						case "GenerateCode":
							return !!this.$ParentSchemaName;
					}
				}
				return false;
			},

			/*rowSelected: function (primaryColumnValue) {
				const gridData = this.getGridData();
				const activeRow = gridData.get(primaryColumnValue);
				const type = activeRow.$Type;
			},*/

			onActiveRowAction: function (actionName, recordId) {
				switch (actionName) {
					case "Edit":
						this.openSchemaPackagePopup(recordId);
						break;
					case "CopyEn":
					case "CopyRu":
					case "CopyRuEn":
					case "CopyEnWithSchema":
					case "CopyRuWithSchema":
					case "CopyRuEnWithSchema":
						this.copyColumnPath(actionName, recordId);
						break;
					case "ConstantsJs":
					case "ConstantsCs":
						this.generateConstants(actionName, recordId);
						break;
					case "QueryEsqClient":
					case "QueryEsqServer":
					case "QueryEsqServerForDataUtilities":
					case "QuerySelectServer":
						this.generateQuery(actionName, recordId);
						break;
					case "QuerySelectSQL":
					case "QueryInsertSQL":
					case "QueryUpdateSQL":
					case "QueryDeleteSQL":
						this.generateSqlQuery(actionName, recordId);
						break;
				}
			},

			getDblClickActionList: function (callback, scope) {
				scope = scope || this;
				const list = this.Ext.create("Terrasoft.Collection");
				const actionArr = [
					"CopyEn",
					"CopyEnWithSchema",
					"CopyRu",
					"CopyRuWithSchema",
					"CopyRuEn",
					"CopyRuEnWithSchema",
					"ConstantsJs",
					"ConstantsCs",
					"Edit"
				];
				actionArr.forEach(actionName => {
					list.add(actionName, {
						value: actionName,
						displayValue: actionName
					});
				});
				callback.call(scope, list);
			},

			onPrepareDblClickActionList: function (filter, list) {
				if (Terrasoft.isEmptyObject(list)) {
					return;
				}
				list.clear();
				this.getDblClickActionList(function (resultList) {
					list.loadAll(resultList);
				});
			},

			onGridDoubleClick: function (recordId) {
				this.onActiveRowAction(this.$DblClickAction.value, recordId);
			}

			/* #endregion */
		}
	};
});
