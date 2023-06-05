define("UsrUnionAllPage", ["ServiceHelper", "UsrDevHelpersUtilsJs"], function (ServiceHelper, DevHelpersUtils) {
	const modulesTabs = {
		"EntitiesHelperTab": { moduleName: "UsrEntitySchemasHelperModule", initialized: false },
		"DevHelperTab": { moduleName: "UsrDevelopingHelperModule", initialized: false },
		"TestsTab": { moduleName: "UsrIntegrationTestsModule", initialized: false },
		"SqlConsoleTab": { moduleName: "SqlConsoleModule", initialized: false }
	};
	const SaveAttrList = ["DefaultTab"];
	return {
		messages: {},
		diff: /**SCHEMA_DIFF*/ [
			{
				"operation": "insert",
				"name": "ModulePageContainer",
				"propertyName": "items",
				"values": {
					"id": "UnionAllPageContainer",
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
				"name": "MainContainer",
				"parentName": "ModulePageContainer",
				"propertyName": "items",
				"values": {
					"itemType": this.Terrasoft.ViewItemType.CONTAINER,
					"items": [],
					"wrapClass": ["main-container"]
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
				"name": "DefaultTab",
				"parentName": "HeaderContainer",
				"propertyName": "items",
				"values": {
					"contentType": Terrasoft.ContentType.ENUM,
					"bindTo": "DefaultTab",
					"controlConfig": {
						"list": { "bindTo": "DefaultTabList" },
						"prepareList": {
							"bindTo": "onPrepareDefaultTabList"
						}
					},
					"wrapClass": ["header-element"]
				}
			},
			{
				"operation": "insert",
				"name": "Tabs",
				"parentName": "MainContainer",
				"propertyName": "items",
				"values": {
					"itemType": Terrasoft.ViewItemType.TAB_PANEL,
					"activeTabChange": { "bindTo": "onActiveTabChange" },
					"activeTabName": { "bindTo": "ActiveTabName" },
					"collection": { "bindTo": "TabsCollection" },
					"activeTabClass": "ts-tabpanel-active-item-arrow",
					"isScrollVisible": false,
					"tabs": []
				}
			},
			{
				"operation": "insert",
				"name": "DevHelperTab",
				"parentName": "Tabs",
				"propertyName": "tabs",
				"values": {
					"caption": "Dev Helper",
					"items": []
				}
			},
			{
				"operation": "insert",
				"name": "TestsTab",
				"parentName": "Tabs",
				"propertyName": "tabs",
				"values": {
					"caption": "Tests",
					"items": []
				}
			},
			{
				"operation": "insert",
				"name": "EntitiesHelperTab",
				"parentName": "Tabs",
				"propertyName": "tabs",
				"values": {
					"caption": "Entities Helper",
					"items": []
				}
			},
			{
				"operation": "insert",
				"name": "SqlConsoleTab",
				"parentName": "Tabs",
				"propertyName": "tabs",
				"values": {
					"caption": "Sql Console",
					"items": []
				}
			}
		] /**SCHEMA_DIFF*/,
		attributes: {
			/**
			 * The collection of the tabs.
			 */
			"TabsCollection": {
				columnPath: "TabsCollection",
				dataValueType: Terrasoft.DataValueType.COLLECTION,
				isCollection: true,
				type: Terrasoft.ViewModelColumnType.ENTITY_COLUMN
			},
			/**
			 * Name of the active tab.
			 */
			"ActiveTabName": {
				dataValueType: this.Terrasoft.DataValueType.TEXT,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},
			/**
			 * Name of the active tab by default.
			 */
			"DefaultTab": {
				dataValueType: this.Terrasoft.DataValueType.ENUM,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				caption: "Default Tab",
				onChange: "saveAttributes"
			},
			"DefaultTabList": {
				dataValueType: Terrasoft.DataValueType.COLLECTION
			}
		},
		methods: {
			saveAttributes: function () {
				DevHelpersUtils.saveAttributes(this, SaveAttrList);
			},

			/**
			 * Initialize model.
			 * @inheritdoc Terrasoft.BaseSchemaModule#init
			 * @overridden
			 * @param {Function} callback Callback function.
			 * @param {Object} scope Execution context.
			 */
			init: function (callback, scope) {
				this.set("DefaultTabList", this.Ext.create("Terrasoft.Collection"));
				DevHelpersUtils.loadAttributes(this, SaveAttrList);
				this.initTabs();
				this.callParent(arguments);
			},

			onPrepareDefaultTabList: function (filter, list) {
				if (Terrasoft.isEmptyObject(list)) {
					return;
				}
				list.clear();
				const resultList = this.Ext.create("Terrasoft.Collection");
				for (const [key, value] of Object.entries(modulesTabs)) {
					resultList.add(key, {
						value: key,
						displayValue: key
					});
				}
				list.loadAll(resultList);
			},

			loadModuleInTab: function (activeTabName) {
				const moduleConfig = modulesTabs[activeTabName];
				if (moduleConfig.initialized) {
					return;
				}
				try {
					this.sandbox.loadModule(moduleConfig.moduleName, {
						renderTo: activeTabName,
						id: this.sandbox.id + "_" + moduleConfig.moduleName,
						keepAlive: true
					});
				} catch (ex) {
					console.error(ex);
					this.Terrasoft.showInformation(ex.name + ": " + ex.message);
				}
				moduleConfig.initialized = true;
			},

			onRender: function () {
				this.callParent(arguments);
				this.loadModuleInTab(this.$ActiveTabName || this.getDefaultTabName());
			},

			/**
			 * Sets visibility of each tab to false.
			 */
			hideTabs: function () {
				this.$TabsCollection.eachKey(function (tabName) {
					this.setTabVisible(tabName, false);
				}, this);
			},

			/**
			 * Initialize config by default for tabs.
			 * @protected
			 * @virtual
			 */
			initTabsConfig: function () {
				this.set("TabsConfig", {});
			},

			/* #region Methods: Private */

			/**
			 * Initializes default tab: sets active and visible states.
			 * @private
			 */
			initDefaultTab: function () {
				const defaultTabName = this.getDefaultTabName();
				if (defaultTabName) {
					this.setActiveTab(defaultTabName);
					this.setTabVisible(defaultTabName, true);
				}
			},

			/**
			 * Initialize collection of the tabs.
			 * @private
			 */
			initTabs: function () {
				this.initTabsConfig();
				const tabsCollection = this.get("TabsCollection");
				tabsCollection.each(this.initTab, this);
				this.initDefaultTab();
			},

			/**
			 * Initialize tab.
			 * @private
			 * @param {Terrasoft.BaseViewModel} tab ViewModel of tab.
			 */
			initTab: function (tab) {
				const config = this.getTabConfig(tab);
				if (config) {
					Terrasoft.each(
						config,
						function (value, key) {
							tab.set(key, value);
						},
						this
					);
				}
			},

			/**
			 * Returns config for tab.
			 * @private
			 * @param {Terrasoft.BaseViewModel} tab ViewModel of tab.
			 * @return {Object} Config for tab.
			 */
			getTabConfig: function (tab) {
				const tabName = tab.get("Name");
				const config = this.getTabsConfig();
				return config[tabName];
			},

			/**
			 * Returns config by default for tabs.
			 * @private
			 * @return {Object} Config.
			 */
			getTabsConfig: function () {
				return this.get("TabsConfig");
			},

			/**
			 * Returns ViewModel of the tab by name.
			 * @private
			 * @param {String} tabName Name of the tab.
			 * @return {Terrasoft.BaseViewModel} ViewModel of the tab.
			 */
			getTabByName: function (tabName) {
				const tabs = this.get("TabsCollection");
				return tabs.find(tabName);
			},

			/**
			 * Sets active tab by name.
			 * @private
			 * @param {String} tabName Name of the tab.
			 */
			setActiveTab: function (tabName) {
				this.set("ActiveTabName", tabName || this.getDefaultTabName());
			},

			/**
			 * Sets visibility of tab by name.
			 * @private
			 * @param {String} tabName Name of the tab.
			 * @param {Boolean} visible Value of visibility.
			 */
			setTabVisible: function (tabName, visible) {
				const moduleConfig = modulesTabs[tabName];
				if (moduleConfig.initialized) {
					const tabContainer = document.getElementById(tabName);
					tabContainer.style.display = visible ? "unset" : "none";
					return;
				}
				this.set(tabName, visible);
			},

			/**
			 * Handles event of changing the active tab.
			 * @private
			 * @param {Terrasoft.BaseViewModel} activeTab ViewModel of the active tab.
			 */
			onActiveTabChange: function (activeTab) {
				const activeTabName = activeTab.get("Name");
				this.set("ActiveTabName", activeTabName);
				this.hideTabs();
				this.setTabVisible(activeTabName, true);
				this.loadModuleInTab(activeTabName);
			},

			/**
			 * Returns the name of the active tab by default.
			 * @private
			 * @return {String} The name of tab.
			 */
			getDefaultTabName: function () {
				const tab = this.get("DefaultTab");
				return (tab && tab.value) || "DevHelperTab";
			}

			/* #endregion */
		}
	};
});
