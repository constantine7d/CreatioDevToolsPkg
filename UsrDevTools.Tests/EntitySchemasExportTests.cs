using Terrasoft.Core;
using UsrDevTools;

namespace UsrDevTools.Tests
{
	public class EntitySchemasExportTests
	{
		[Fact]
		public void GetExcelTest_ShouldNotThrowException()
		{
			var config = new EntitySchemaConfig();
			config.Name = "SchemaName";
			config.Caption = "SchemaCaption";
			config.Columns = new List<ColumnConfig>();
			config.Columns.Add(new ColumnConfig
			{
				Name= "Name1",
				Caption= "Caption1",
				DataTypeName = "DataTypeName1",
				DefValue = "DefValue1",
				LookupCaption= "LookupCaption1",
				Parent = "Parent1",
				ReferenceSchema = new EntitySchemaConfig()
				{
					Caption= "ReferenceSchemaCaption",
					Name= "ReferenceSchemaName",
				},
				RequirementType = "RequirementType1",
				Type = "Type1"
			});
			config.Columns.Add(new ColumnConfig
			{
				Name= "Name2",
				Caption= "Caption2",
				DataTypeName = "DataTypeName2",
				DefValue = "DefValue2",
				LookupCaption= "LookupCaption2",
				Parent = "Parent2",
				ReferenceSchema = new EntitySchemaConfig()
				{
					Caption= "ReferenceSchemaCaption",
					Name= "ReferenceSchemaName",
				},
				RequirementType = "RequirementType2",
				Type = "Type2"				
			});


			var generator = new EntitySchemasExport();
			Exception exception;
			using (var writer = new StreamWriter("GetExcelTest_ShouldNotThrowException1.csv"))
			{
				exception = Record.Exception(() => generator.GetCsv(config, writer));
			}
			
			//Assert
			Assert.Null(exception);
		}
	}
}