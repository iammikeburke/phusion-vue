import {AbstractTask} from 'phusion/src/build/task/AbstractTask';
import {ModuleContainer} from "../module/ModuleContainer";

export class TemplatesTask extends AbstractTask
{
	protected moduleContainer: ModuleContainer;

	public run()
	{
		this.logInfo('TemplatesTask: started');
		let taskConfig = this.getTaskConfig();

		// Task config values
		let projectRootDirPath = taskConfig.getByPath('projectRootDirPath');
		let classmapFilePath = taskConfig.getByPath('classmapFilePath');
		let outputFilePath = taskConfig.getByPath('outputFilePath');
		let classmapGroup = taskConfig.getByPath('classmapGroup');

		// Init view cache
		let viewCache = {};

		// Get path map file path from class map path
		let pathMapFilePath = classmapFilePath.replace(/\/[^/]+\.[^\.]+$/, '/pathmap.js');

		// Import pathmap
		let pathMap = null;

		try
		{
			pathMap = eval('require')(pathMapFilePath);
		}
		catch (e) {}

		if (!pathMap)
		{
			this.logError('TemplatesTask: Path map not found: ' + pathMapFilePath);
			return false;
		}

		// Access path map for this group
		let groupPathMap = pathMap[classmapGroup];

		if (typeof groupPathMap !== 'object')
		{
			this.logInfo('TemplatesTask: No views classes found in path map.');
			return false;
		}

		let fileSystemModule = this.getModuleContainer().getFileSystemModule();

		// For each class in group
		for (let className in groupPathMap)
		{
			let classFilePath = groupPathMap[className];

			// Build file path to the view
			let componentBaseName = className.replace(/Component$/, '');
			let viewFilePath = classFilePath.replace(/\/[^\/]+$/, '/View/' + componentBaseName + '.html');
			viewFilePath = viewFilePath.replace('{src}', projectRootDirPath);

			// Read in as string
			// Add to view cache object using class name as the key
			viewCache[className] = fileSystemModule.readAsTextString(viewFilePath);
		}

		let jsonString = JSON.stringify(viewCache, null, 2);

		let fileContents = '\nmodule.exports = ' + jsonString + ';\n';

		fileSystemModule.writeFile(outputFilePath, fileContents);

		this.logSuccess('TemplatesTask: complete');
	}

	public getRequiredTaskConfigPaths(): Object
	{
		return {
			projectRootDirPath: "string",
			classmapFilePath: "string",
			outputFilePath: "string",
			classmapGroup: "string"
		};
	}

	protected getDefaultTaskConfig(): Object
	{
		let cwd = process.cwd();

		return {
			projectRootDirPath: cwd,
			classmapFilePath: cwd + '/cache/classmap.js',
			outputFilePath: cwd + '/cache/templates.js',
			classmapGroup: "component"
		};
	}

	protected getModuleContainer(): ModuleContainer
	{
		if (!this.moduleContainer)
		{
			this.moduleContainer = new ModuleContainer();
		}

		return this.moduleContainer;
	}
}