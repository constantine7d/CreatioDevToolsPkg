define("UsrDevelopingHelperModule", ["UsrDevelopingHelpersImages"], function (
	DevelopingHelpersImages
) {
	Ext.define("Terrasoft.configuration.UsrDevelopingHelperModule", {
		extend: "Terrasoft.BaseSchemaModule",
		alternateClassName: "Terrasoft.UsrDevelopingHelperModule",

		/**
		 * @inheritdoc Terrasoft.BaseSchemaModule#generateViewContainerId
		 * @overridden
		 */
		generateViewContainerId: false,

		/**
		 * @inheritdoc Terrasoft.BaseSchemaModule#initSchemaName
		 * @overridden
		 */
		initSchemaName: function () {
			this.schemaName = "UsrDevelopingHelperPage";
		},

		/**
		 * @inheritdoc Terrasoft.BaseSchemaModule#initHistoryState
		 * @overridden
		 */
		initHistoryState: Terrasoft.emptyFn,

		/**
		 * @inheritdoc
		 * @overridden
		 */
		init: function () {
			this.callParent(arguments);
			this.changeDocumentTitle();
		},

		changeDocumentTitle: function () {
			document.title = "Dev Helpers";
			let link = document.querySelector("link[rel~='icon']");
			if (!link) {
				link = document.createElement("link");
				link.rel = "icon";
				document.getElementsByTagName("head")[0].appendChild(link);
			}
			link.href = DevelopingHelpersImages.FavIcon;
		}
	});
	return this.Terrasoft.UsrDevelopingHelperModule;
});
