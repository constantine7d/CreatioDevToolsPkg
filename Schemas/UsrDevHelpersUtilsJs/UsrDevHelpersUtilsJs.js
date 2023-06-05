define("UsrDevHelpersUtilsJs", ["UsrDevHelpersUtilsJsResources", "terrasoft", "ServiceHelper"], function (
	resources,
	Terrasoft,
	ServiceHelper
) {
	const NewLine = "\r\n";

	const generateConstantsEsq = async function (schemaName, contains) {
		const lookupEsq = Ext.create("Terrasoft.EntitySchemaQuery", {
			rootSchemaName: schemaName
		});
		lookupEsq.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_COLUMN, "PrimaryColumn");
		lookupEsq.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_DISPLAY_COLUMN, "PrimaryDisplayColumn");
		if (contains) {
			lookupEsq.filters.addItem(Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.CONTAIN, "Name", contains));
		}
		return new Promise((resolve, reject) => {
			lookupEsq.getEntityCollection(result => {
				if (result.success) {
					const items = result.collection.getItems();
					let displayValues = "";
					Terrasoft.each(items, function (item) {
						displayValues += "\n" + item.get("PrimaryDisplayColumn");
					});
					resolve({ items, displayValues });
				} else {
					reject(result);
				}
			});
		});
	};

	/**
	 * Generate JS constants
	 * @param {*} schemaName
	 * @param {*} constantsContains contain filter schema primary display column
	 * @returns
	 */
	const generateConstantsClient = async function (schemaName, constantsContains) {
		const schemaNamePrefix = Terrasoft.SysSettings.cachedSettings.SchemaNamePrefix;
		const schemaNamePrefixWithPrefix = schemaName.startsWith(schemaNamePrefix) ? schemaName : schemaNamePrefix + schemaName;

		const result = await generateConstantsEsq(schemaName, constantsContains);
		const schemaNameVariable = schemaName.charAt(0).toLowerCase() + schemaName.slice(1);
		let generatedCode = `//Schema caption: "Константы схемы ${schemaName} (js)"` + NewLine;
		generatedCode += `//Schema name:    "${schemaNamePrefixWithPrefix}ConstantsJs"` + NewLine;
		generatedCode += `define(\"${schemaNamePrefixWithPrefix}ConstantsJs\", [], function() {` + NewLine;
		generatedCode += `	const ${schemaNameVariable} = {` + NewLine;
		Terrasoft.each(result.items, function (item) {
			const lookupValue = {
				value: item.get("PrimaryColumn"),
				displayValue: item.get("PrimaryDisplayColumn")
			};
			generatedCode += `		/** @constant ${lookupValue.displayValue} */` + NewLine;
			generatedCode += `		${lookupValue.displayValue}: \"${lookupValue.value}\",` + NewLine;
		});
		generatedCode += `	};` + NewLine;
		generatedCode += `	return ${schemaNameVariable};` + NewLine;

		generatedCode += `	//or by parent object - AccountConstantsJs = { AccountStatus: {}, AccountType: {}...}` + NewLine;
		generatedCode += `	const parentObject = {` + NewLine;
		generatedCode += `		${schemaName}: {` + NewLine;
		Terrasoft.each(result.items, function (item) {
			const lookupValue = {
				value: item.get("PrimaryColumn"),
				displayValue: item.get("PrimaryDisplayColumn")
			};
			generatedCode += `			/** @constant ${lookupValue.displayValue} */` + NewLine;
			generatedCode += `			${lookupValue.displayValue}: \"${lookupValue.value}\",` + NewLine;
		});
		generatedCode += `		},` + NewLine;
		generatedCode += `	};` + NewLine;
		generatedCode += `	return parentObject;` + NewLine;

		generatedCode += `});`;
		generatedCode += NewLine;

		generatedCode += NewLine + result.displayValues;
		generatedCode +=
			NewLine +
			"//--Vscode Google Translate: Alt + Shift + T перевод выделенного, включая несколько выделений через Alt " +
			"(Ctrl + Shift + P 'Set Preferred Language')";
		return generatedCode;
	};

	/**
	 * Generate C# constants
	 * @param {*} schemaName
	 * @param {*} constantsContains contain filter schema primary display column
	 * @returns
	 */
	const generateConstantsServer = async function (schemaName, constantsContains) {
		const schemaNamePrefix = Terrasoft.SysSettings.cachedSettings.SchemaNamePrefix;
		const schemaNamePrefixWithPrefix = schemaName.startsWith(schemaNamePrefix) ? schemaName : schemaNamePrefix + schemaName;
		const result = await generateConstantsEsq(schemaName, constantsContains);
		let generatedCode = "";
		let lookupValue;
		generatedCode += `//Schema caption: "Константы схемы ${schemaName} (cs)"` + NewLine;
		generatedCode += `//Schema name:    "${schemaNamePrefixWithPrefix}ConstantsCs"` + NewLine;
		generatedCode += "namespace Terrasoft.Configuration" + NewLine;
		generatedCode += "{" + NewLine;
		generatedCode += "	using System;" + NewLine;
		generatedCode += "	/// <summary>" + NewLine;
		generatedCode += `	/// Константы схемы <see cref="${schemaName}"/>` + NewLine;
		generatedCode += "	/// </summary>" + NewLine;
		generatedCode += `	public static class ${schemaNamePrefixWithPrefix}Constants` + NewLine;
		generatedCode += "	{" + NewLine;
		Terrasoft.each(result.items, function (item) {
			lookupValue = {
				value: item.get("PrimaryColumn"),
				displayValue: item.get("PrimaryDisplayColumn")
			};
			generatedCode += "		/// <summary>" + NewLine;
			generatedCode += `		/// ${lookupValue.displayValue}` + NewLine;
			generatedCode += "		/// </summary>" + NewLine;
			generatedCode += `		public static readonly Guid ${lookupValue.displayValue} = Guid.Parse(\"${lookupValue.value}\");` + NewLine;
		});
		generatedCode += NewLine + "	}" + NewLine;
		generatedCode += "}" + NewLine;

		generatedCode += NewLine + result.displayValues;
		generatedCode +=
			NewLine +
			"\n//--Vscode Google Translate: Alt + Shift + T перевод выделенного, включая несколько выделений через Alt " +
			"(Ctrl + Shift + P 'Set Preferred Language')";
		return generatedCode;
	};

	const callService = async function (name, methodName, scope, data = {}) {
		return new Promise((resolve, reject) => {
			ServiceHelper.callService(
				{
					serviceName: name,
					methodName: methodName,
					callback: function (response) {
						if (response && response[methodName + "Result"]) {
							resolve(response[methodName + "Result"]);
						} else {
							//console.error(response);
							reject(response);
							scope.showInformationDialog("Error");
							scope.hideBodyMask();
						}
					},
					scope: scope,
					data: data,
					timeout: 1900000
				},
				scope
			);
		});
	};

	const getConfig = key => JSON.parse(window.localStorage.getItem(key));

	const saveConfig = (key, object) => window.localStorage.setItem(key, JSON.stringify(object));

	const loadAttributes = function (scope, saveAttrArray, name) {
		const attr = getConfig(scope.name || name);
		for (const prop in attr) {
			if (!saveAttrArray || saveAttrArray.includes(prop)) {
				scope.set(prop, attr[prop]);
			}
		}
	};

	const saveAttributes = function (scope, saveAttrArray, name) {
		const attr = {};
		saveAttrArray.forEach(prop => (attr[prop] = scope.get(prop)));
		saveConfig(scope.name || name, attr);
	};

	return {
		generateConstantsClient: generateConstantsClient,
		generateConstantsServer: generateConstantsServer,
		callService: callService,
		loadAttributes: loadAttributes,
		saveAttributes: saveAttributes
	};
});
