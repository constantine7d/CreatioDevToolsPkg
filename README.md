# CreatioDevToolsPkg

## Install

Use [clio](https://github.com/Advance-Technologies-Foundation/clio) tool for installation. 
- Build UsrDevTools project `dotnet build --configuration Release`
- Compress pkg `clio generate-pkg-zip . -d .\UsrDevTools.gz` or use UsrDevTools.gz from repository (don't need build project).
- Use clio for install or install it manualy.

## Other tools

- [CreatioDevToolsTestsPkg](https://github.com/constantine7d/CreatioDevToolsTestsPkg)

## Modules

### Union All

Open module page from navigation panel or go to http://siteaddress/0/Nui/ViewModule.aspx#UsrUnionAllModule

### Entity schemas browser

Open module page from navigation panel or go to http://siteaddress/0/Nui/ViewModule.aspx#UsrEntitySchemasHelperModule

#### Features

- Export schema column
- Open base edit page
- Generate constants for lookup to clipboard
- Generate ESQ, Sql select code

### Developing helper

Open module page from navigation panel or go to http://siteaddress/0/Nui/ViewModule.aspx#UsrDevelopingHelperModule

#### Test Class sample

Method path: Terrasoft.Configuration.FeatureUtilities.GetIsFeatureEnabled
Class Method Arguments: {"code":"UseDuplicatesHistory"}

Current UserConnection will be used by methodor or constructor.
