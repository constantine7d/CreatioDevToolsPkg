using CsvHelper;
using CsvHelper.Configuration.Attributes;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;

namespace UsrDevTools
{
	public class EntitySchemasExport
	{
		public EntitySchemasExport()
		{
		}

		public void GetCsv(EntitySchemaConfig config, StreamWriter writer)
		{
			if (config is null)
			{
				throw new ArgumentNullException(nameof(config));
			}

			if (writer is null)
			{
				throw new ArgumentNullException(nameof(writer));
			}

			var csvDtoList = new List<CsvDto>();
			foreach (var item in config.Columns)
			{
				csvDtoList.Add(new CsvDto
				{
					SchemaName = config.Name,
					SchemaCaption = config.Caption,
					ColumnCaption = item.Caption,
					ColumnName = item.Name,
					Type = item.DataTypeName,
					LookupName = item.ReferenceSchema?.Name ?? String.Empty,
					LookupCaption = item.ReferenceSchema?.Caption ?? String.Empty,
					Required = item.RequirementType,
					DefValue = item.DefValue
				});
			}
			
			var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
			csv.WriteRecords(csvDtoList);
			csv.Flush();
		}

		#region CsvDto

		public class CsvDto
		{
			[Name("Schema")]
			public string SchemaName { get; set; }
			[Name("Schema caption")]
			public string SchemaCaption { get; set; }
			[Name("Column caption")]
			public string ColumnCaption { get; set; }
			[Name("Column name")]
			public string ColumnName { get; set; }
			[Name("Type")]
			public string Type { get; set; }
			[Name("Lookup name")]
			public string LookupName { get; set; }
			[Name("Lookup caption")]
			public string LookupCaption { get; set; }
			[Name("Required")]
			public string Required { get; set; }
			[Name("Default value")]
			public string DefValue { get; set; }
			
		}

		#endregion

	}


}