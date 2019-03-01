
export interface AutoloadModuleInterface
{
	generateClassmap(projectRootDirPath: string, outputFilePath: string, groups: Object, ignorePatterns?: Array<RegExp>): boolean;

	getImportStatementBlock(classPathMap: Object, projectRootAbsolutePath: string, importFromDirPath: string): string;

	removeQuotesFromClassNames(classmap: Object, jsonString: string): string;
}