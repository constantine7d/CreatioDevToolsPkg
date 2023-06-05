define("UsrDevelopingHelperPage", ["UsrDevHelpersUtilsJs"], function (DevHelpersUtils) {
	return {
		messages: {},
		diff: /**SCHEMA_DIFF*/ [
			{
				"operation": "insert",
				"name": "TestingContainer",
				"propertyName": "items",
				"values": {
					"itemType": this.Terrasoft.ViewItemType.CONTAINER,
					"items": [],
					"wrapClass": ["testing-container"]
				}
			},
			{
				"operation": "insert",
				"name": "testClass",
				"parentName": "TestingContainer",
				"propertyName": "items",
				"values": {
					"id": "testClass",
					"tag": "testClass",
					"caption": "Test Class",
					"itemType": Terrasoft.ViewItemType.CONTROL_GROUP,
					"items": [],
					"collapsed": true,
					"classes": { wrapContainerClass: "control-group-container" }
				}
			},
			{
				"operation": "insert",
				"name": "testClassMethodPath",
				"parentName": "testClass",
				"propertyName": "items",
				"values": {
					"bindTo": "TestClassMethodPath"
				}
			},
			{
				"operation": "insert",
				"name": "testClassArgs",
				"parentName": "testClass",
				"propertyName": "items",
				"values": {
					"bindTo": "TestClassConstructorArgs",
					"contentType": Terrasoft.ContentType.LONG_TEXT
				}
			},
			{
				"operation": "insert",
				"name": "testClassMethodArgs",
				"parentName": "testClass",
				"propertyName": "items",
				"values": {
					"bindTo": "TestClassMethodArgs",
					"contentType": Terrasoft.ContentType.LONG_TEXT
				}
			},
			{
				"operation": "insert",
				"name": "testClassButton",
				"parentName": "testClass",
				"propertyName": "items",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"click": { "bindTo": "testClass" },
					"caption": "Test class",
					"style": Terrasoft.controls.ButtonEnums.style.BLUE
				}
			},
			{
				"operation": "insert",
				"name": "resultMemo",
				"propertyName": "items",
				"values": {
					"bindTo": "ResultMemo",
					"contentType": Terrasoft.ContentType.LONG_TEXT
				}
			},
			{
				"operation": "insert",
				"name": "ReactRootContainer",
				"propertyName": "items",
				"values": {
					"id": "root",
					"itemType": this.Terrasoft.ViewItemType.CONTAINER,
					"items": []
				}
			},
			{
				"operation": "insert",
				"name": "TestContainer",
				"propertyName": "items",
				"values": {
					"id": "TestContainer",
					"itemType": this.Terrasoft.ViewItemType.CONTAINER,
					"items": []
				}
			}
		] /**SCHEMA_DIFF*/,
		attributes: {
			//Test class
			TestClassMethodPath: {
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				dataValueType: Terrasoft.DataValueType.TEXT,
				caption: "Method path",
				value: "Terrasoft.Configuration.FeatureUtilities.GetIsFeatureEnabled"
			},
			TestClassConstructorArgs: {
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				dataValueType: Terrasoft.DataValueType.TEXT,
				caption: "Class constructor arguments",
				value: '{"id":"b50b5926-26a0-4fd8-97a9-00f0d0b8b3a1"}'
			},
			TestClassMethodArgs: {
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				dataValueType: Terrasoft.DataValueType.TEXT,
				caption: "Class Method Arguments",
				value: '{"code":"UseDuplicatesHistory"}'
			},
			//Common
			ResultMemo: {
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				dataValueType: Terrasoft.DataValueType.TEXT,
				caption: "Result"
			}
		},
		methods: {
			init: function () {
				this.callParent(arguments);
				DevHelpersUtils.loadAttributes(this, undefined, "DevelopingHelperModule");
			},

			saveAttributes: function () {
				const attr = [];
				for (const prop in this.attributes) {
					if (prop === "ResultMemo") {
						continue;
					}
					attr.push(prop);
				}
				DevHelpersUtils.saveAttributes(this, attr, "DevelopingHelperModule");
			},

			testClass: async function () {
				this.set("ResultMemo", "");
				const config = {
					methodPath: this.get("TestClassMethodPath"),
					constructorParametersJson: this.get("TestClassConstructorArgs"),
					methodParametersJson: this.get("TestClassMethodArgs")
				};
				if (!config.methodPath) {
					return;
				}
				Terrasoft.AjaxProvider.request({
					url: Terrasoft.workspaceBaseUrl + "/rest/TestClass/TestByAdmin",
					headers: {
						"Accept": "application/json",
						"Content-Type": "application/json"
					},
					method: "POST",
					jsonData: Ext.encode(config),
					callback: (request, success, response) => {
						let responseObject = {};
						if (success) {
							this.saveAttributes();
							responseObject = Terrasoft.decode(response.responseText);
							this.set("ResultMemo", responseObject.TestByAdminResult);
							console.log(responseObject.TestByAdminResult);
						} else {
							this.set("ResultMemo", response.responseText);
							console.log(response.responseText);
						}
					}
				});
			}
		}
	};
});
