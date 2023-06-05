INSERT INTO "SysSettingsInFolder" ("FolderId", "SysSettingsId")
SELECT '{EA0197FC-D00D-43B5-8FA6-BF35AB280DAD}', "Id"
FROM "SysSettings" WHERE "Code" = 'Maintainer' 
AND NOT EXISTS (SELECT "Id" FROM "SysSettingsInFolder" WHERE "FolderId" = '{EA0197FC-D00D-43B5-8FA6-BF35AB280DAD}' AND "SysSettingsId" = "SysSettings"."Id")