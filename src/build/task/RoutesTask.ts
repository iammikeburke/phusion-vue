
import {AbstractTask} from 'phusion/src/build/task/AbstractTask';
import {ModuleContainer} from "../module/ModuleContainer";
import {Config} from 'phusion/src/build/module/Config/Entity/Config';

export class RoutesTask extends AbstractTask
{
	protected moduleContainer: ModuleContainer;

	public run()
	{
		this.logInfo('RoutesTask: started');
		let taskConfig = this.getTaskConfig();

		let projectRootDirPath = taskConfig.getByPath('projectRootDirPath');
		let classmapFilePath = taskConfig.getByPath('classmapFilePath');
		let outputFilePath = taskConfig.getByPath('outputFilePath');
		let configFilePath = taskConfig.getByPath('configFilePath');
		let routesConfigKeyPath = taskConfig.getByPath('routesConfigKeyPath');

		// Read in config file
		let fileSystemModule = this.getModuleContainer().getFileSystemModule();

		let applicationConfigObject = null;
		let pathmap = null;
		let pathmapFilePath = classmapFilePath.replace(/[^/]*\.*$/, '/pathmap.js');

		/**
		 * Read config file, classmap and path map
		 */
		// Get Config from object
		try
		{
			applicationConfigObject = eval('require')(configFilePath);
		}
		catch (e) {}

		if (!applicationConfigObject)
		{
			this.logError('RoutesTask: Config file not found: ' + configFilePath);
			process.exit();
		}

		let applicationConfig = this
			.getModuleContainer()
			.getConfigModule()
			.toConfig(applicationConfigObject);

		/**
		 * Read pathmap
		 */
		try
		{
			pathmap = eval('require')(pathmapFilePath);
		}
		catch (e) {}

		if (!pathmap)
		{
			this.logError('RoutesTask: Path map not found: ' + pathmapFilePath);
			process.exit();
		}

		/**
		 * Parse config object for routes config
		 */

		// Parse for Routes
		let routesConfig = applicationConfig.getByPath(routesConfigKeyPath);

		// If an instance of Config is returned, convert it to a native object
		if (routesConfig instanceof Config)
		{
			routesConfig = routesConfig.toObject();
		}

		/**
		 * Write file contents
		 */

		// Stringify routes config
		let routesJsonString = JSON.stringify(routesConfig, null, 2);

		// Get the routes file output directory
		let outputDir = outputFilePath.replace(/[^/]*\.*$/, '');

		let autoloadModule = this.getModuleContainer().getAutoloadModule();

		// Add import statement block
		let importStatementBlock = autoloadModule
			.getImportStatementBlock(pathmap, projectRootDirPath, outputDir);

		// Remove quotes from classnames
		routesJsonString = autoloadModule.removeQuotesFromClassNames(pathmap, routesJsonString);

		let fileContents = importStatementBlock + '\nmodule.exports = ' + routesJsonString + ';\n';

		// Write file
		fileSystemModule.writeFile(outputFilePath, fileContents);
		this.logSuccess('RoutesTask: complete');
	}

	public getRequiredTaskConfigPaths(): Object
	{
		return {
			projectRootDirPath: "string",
			classmapFilePath: "string",
			outputFilePath: "string",
			configFilePath: "string",
			routesConfigKeyPath: "string"
		};
	}

	protected getDefaultTaskConfig(): Object
	{
		let cwd = process.cwd();

		return {
			projectRootDirPath: cwd,
			classmapFilePath: cwd + '/cache/classmap.js',
			outputFilePath: cwd + '/cache/routes.js',
			configFilePath: cwd + '/cache/config.js',
			routesConfigKeyPath: "phusion:routes"
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