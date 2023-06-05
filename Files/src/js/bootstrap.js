(function () {
	const pkgName = "UsrDevTools";
	const config = {
		paths: {
			"UsrGenerateQueryJs": Terrasoft.getFileContentUrl(pkgName, "src/js/GenerateQuery.js"),
			"UsrDevToolsCss": Terrasoft.getFileContentUrl(pkgName, "src/css/DevTools.css")
		}
	};
	require.config(config);
})();
