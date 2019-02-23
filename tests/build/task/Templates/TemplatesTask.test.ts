
import {ModuleContainer} from "../../../../src/build/module/ModuleContainer";
import {ClassmapTask} from "../../../../src/build/task/ClassmapTask";
import {TemplatesTask} from "../../../../src/build/task/TemplatesTask";

/**
 * ClassmapTask
 */
describe('TemplateCacheTask', () =>
{
	let classmapOutputFilePath = __dirname + "/cache/classmap.js";
	let viewCacheOutputFilePath = __dirname + "/cache/templates.js";

	beforeAll(() =>
	{
		/**
		 * Build Classmap
		 */

		let buildClassmapTask = new ClassmapTask(
			{
				projectRootDirPath: __dirname,
				outputFilePath: classmapOutputFilePath,
				groups: {
					abstract: "^(Abstract|abstract.*$).*\.ts$"
				}
			}
		);

		buildClassmapTask.run();


		/**
		 * Build View Cache
		 */

		let viewCacheTask = new TemplatesTask(
			{
				projectRootDirPath: __dirname,
				classmapFilePath: __dirname + "/cache/classmap.js",
				outputFilePath: viewCacheOutputFilePath
			}
		);

		viewCacheTask.run();
	});

	afterAll(() =>
	{
		let moduleContainer = new ModuleContainer();
		let fileSystemModule = moduleContainer.getFileSystemModule();

		// Remove classmap
		fileSystemModule.removeFile(classmapOutputFilePath);

		// Remove pathmap
		let pathmapFilePath = classmapOutputFilePath.replace(/[^/]+\..+/, 'pathmap.js');
		fileSystemModule.removeFile(pathmapFilePath);

		// Remove view cache
		fileSystemModule.removeFile(viewCacheOutputFilePath);
	});

	test('View cache file is created with the correct name and file path', () =>
	{
		let moduleContainer = new ModuleContainer();
		let fileSystemModule = moduleContainer.getFileSystemModule();

		let fileContents = fileSystemModule.readAsTextString(viewCacheOutputFilePath);

		expect(typeof fileContents).toBe('string');
		expect(fileContents.length).toBeGreaterThan(1);
	});

	test('View cache cam be imported and is of type "object"', () =>
	{
		let viewCache = require(viewCacheOutputFilePath);
		expect(viewCache).toBeInstanceOf(Object);
	});

	test('View cache holds the correct number of views', () =>
	{
		let viewCache = require(viewCacheOutputFilePath);
		expect(Object.keys(viewCache).length).toBe(3);
	});

	test('View cache holds the correct types', () =>
	{
		let viewCache = require(viewCacheOutputFilePath);

		for (let componentName in viewCache)
			if (viewCache.hasOwnProperty(componentName))
		{
			let viewTemplateString = viewCache[componentName];

			expect(typeof componentName).toBe('string');
			expect(typeof viewTemplateString).toBe('string');
		}
	});

});