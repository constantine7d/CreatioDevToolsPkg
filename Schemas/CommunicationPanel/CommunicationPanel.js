define("CommunicationPanel", ["CommunicationPanelHelper", "css!UsrDevToolsCss"], function () {
	return {
		attributes: {},
		messages: {},
		methods: {
			init: function () {
				this.callParent(arguments);
				this.initIntervalMenuItems();
			},

			onUsrUnionAllModuleButtonsClick: function () {
				this.openLink("/Nui/ViewModule.aspx#UsrUnionAllModule");
			},

			getUsrDevHelpersPanelImageConfig: function () {
				return this.get("Resources.Images.UsrDevHelpersIcon");
			},

			addUsrDevHelpersMenuItemLink: function (caption, link) {
				const menuItems = this.get("UsrDevHelpersMenuItems");
				menuItems.addItem(
					this.getButtonMenuItem({
						"Caption": caption,
						"Click": { bindTo: "usrDevHelpersMenuItemClick" },
						"Tag": {
							key: link,
							type: "link"
						}
					})
				);
			},

			initIntervalMenuItems: function () {
				this.set(
					"UsrDevHelpersMenuItems",
					this.Ext.create("Terrasoft.BaseViewModelCollection")
				);
				const menuItems = this.get("UsrDevHelpersMenuItems");
				this.addUsrDevHelpersMenuItemLink("All", "/Nui/ViewModule.aspx#UsrUnionAllModule");
				this.addUsrDevHelpersMenuItemLink(
					"Tests",
					"/Nui/ViewModule.aspx#UsrIntegrationTestsModule"
				);
				this.addUsrDevHelpersMenuItemLink(
					"EntitiesHelper",
					"/Nui/ViewModule.aspx#UsrEntitySchemasHelperModule"
				);
				this.addUsrDevHelpersMenuItemLink(
					"DevHelper",
					"/Nui/ViewModule.aspx#UsrDevelopingHelperModule"
				);
				menuItems.addItem(this.getButtonMenuSeparator());

				this.addUsrDevHelpersMenuItemLink(
					"SysSettings",
					"/Nui/ViewModule.aspx#SectionModuleV2/SysSettingsSection"
				);
				this.addUsrDevHelpersMenuItemLink(
					"Lookups",
					"/Nui/ViewModule.aspx#SectionModuleV2/LookupSection"
				);
				this.addUsrDevHelpersMenuItemLink("Dev", "/Dev");
				this.addUsrDevHelpersMenuItemLink(
					"Roles",
					"/Nui/ViewModule.aspx#SectionModuleV2/SysAdminUnitSectionV2/SysAdminUnitPageV2/edit/a29a3ba5-4b0d-de11-9a51-005056c00008"
				);
				this.addUsrDevHelpersMenuItemLink(
					"InstalledApps",
					"/Nui/ViewModule.aspx#SectionModuleV2/InstalledAppSection"
				);
				this.addUsrDevHelpersMenuItemLink(
					"ProcessLib",
					"/Nui/ViewModule.aspx#SectionModuleV2/VwProcessLibSection"
				);
				this.addUsrDevHelpersMenuItemLink(
					"ProcessLog",
					"/Nui/ViewModule.aspx#SectionModuleV2/SysProcessLogSectionV2"
				);
			},

			usrDevHelpersMenuItemClick: function (config) {
				if (config.type === "link") {
					this.openLink(config.key);
				}
			},

			openLink: function (key) {
				window.open(Terrasoft.workspaceBaseUrl + key);
			}
		},
		diff: [
			{
				"operation": "insert",
				"name": "UsrUnionAllModuleButton",
				"parentName": "communicationPanelContent",
				"propertyName": "items",
				"values": {
					"id": "UsrUnionAllModuleButton",
					"classes": {
						"wrapperClass": ["usr-dev-helper-communication-button"],
						"imageClass": ["usr-dev-helper-communication-button-image"]
					},
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"imageConfig": { bindTo: "Resources.Images.UsrEntitySchemaIcon" },
					"click": { bindTo: "onUsrUnionAllModuleButtonsClick" }
				},
				"index": 2
			},
			{
				"operation": "insert",
				"name": "UsrDevHelpersMenuButton",
				"parentName": "communicationPanelContent",
				"propertyName": "items",
				"values": {
					"id": "UsrDevHelpersMenuButton",
					"classes": {
						"wrapperClass": ["usr-dev-helper-communication-button"],
						"imageClass": ["usr-dev-helper-communication-button-image"]
					},
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"imageConfig": {
						"bindTo": "getUsrDevHelpersPanelImageConfig"
					},
					"controlConfig": { "menu": { "items": { "bindTo": "UsrDevHelpersMenuItems" } } }
				},
				"index": 3
			}
		]
	};
});
