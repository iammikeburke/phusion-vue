
import {ModuleContainer} from "../../../../src/build/module/ModuleContainer";
import {ClassmapTask} from "../../../../src/build/task/ClassmapTask";

/**
 * ClassmapTask
 */
describe('ClassmapTask', () =>
{
	let projectRoot = __dirname;
	let outputFilePath = __dirname + '/cache/classmap.js';
	let pathmapFilePath = __dirname + '/cache/pathmap.js';

	beforeAll(() =>
	{
		let moduleContainer = new ModuleContainer();
		let fileSystemModule = moduleContainer.getFileSystemModule();

		// Remove classmap.js
		if (fileSystemModule.fileExists(outputFilePath))
		{
			fileSystemModule.removeFile(outputFilePath);
		}

		// Remove pathmap.js
		if (fileSystemModule.fileExists(pathmapFilePath))
		{
			fileSystemModule.removeFile(pathmapFilePath);
		}

		// Create task
		let task = new ClassmapTask(
			{
				"projectRootDirPath": projectRoot,
				"outputFilePath": outputFilePath,
				"groups": {
					abstract: "^(Abstract|abstract.*$).*\.ts$"
				}
			}
		);

		// Run task
		task.run();
	});

	test('Outputs a classmap file with the correct name and file paths', () =>
	{
		let moduleContainer = new ModuleContainer();

		// Get contents of output file
		let outputFileContents = moduleContainer.getFileSystemModule().readAsTextString(outputFilePath);

		expect(typeof outputFileContents).toBe('string');
		expect(outputFileContents.length).toBeGreaterThan(1);
	});

	test('Outputs a pathmap file with the correct name and file paths', () =>
	{
		let moduleContainer = new ModuleContainer();

		// Get contents of output file
		let outputFileContents = moduleContainer.getFileSystemModule().readAsTextString(pathmapFilePath);

		expect(typeof outputFileContents).toBe('string');
		expect(outputFileContents.length).toBeGreaterThan(1);
	});

	test('Output classmap file can be imported and the result is of type "object"', () =>
	{
		let classmap = require(outputFilePath);
		expect(classmap).toBeInstanceOf(Object);
	});

	test('Output pathmap file can be imported and the result is of type "object"', () =>
	{
		let pathmap = require(pathmapFilePath);
		expect(pathmap).toBeInstanceOf(Object);
	});

	test('Output classmap contains a section for each group', () =>
	{
		let classmap = require(outputFilePath);

		// Should only be 2 keys (abstract and component)
		expect(Object.keys(classmap).length).toBe(2);

		// Make sure abstract key is an object
		expect(classmap['abstract']).toBeInstanceOf(Object);
		// Make sure component key is an object
		expect(classmap['component']).toBeInstanceOf(Object);
	});

	test('Output pathmap contains a section for each group', () =>
	{
		let pathmap = require(pathmapFilePath);

		// Should only be 2 keys (abstract and component)
		expect(Object.keys(pathmap).length).toBe(2);

		// Make sure abstract key is an object
		expect(pathmap['abstract']).toBeInstanceOf(Object);
		// Make sure component key is an object
		expect(pathmap['component']).toBeInstanceOf(Object);
	});

	test('Output classmap contains the correct keys and types', () =>
	{
		// Get contents of output file
		let classMapContentsAsObject = require(outputFilePath);

		let componentClasses = classMapContentsAsObject['component'];
		let abstractClasses = classMapContentsAsObject['abstract'];

		expect(Object.keys(componentClasses).length).toBe(3);
		expect(Object.keys(abstractClasses).length).toBe(1);

		// For each group
		for (let groupName in classMapContentsAsObject)
			if(classMapContentsAsObject.hasOwnProperty(groupName))
			{
				let classGroup = classMapContentsAsObject[groupName];

				// For each class in this group
				for (let className in classGroup)
					if (classGroup.hasOwnProperty(className))
					{
						let rawClass = classGroup[className];
						expect(rawClass).toBeInstanceOf(Function);
					}
			}
	});

	test('Output pathmap contains the correct keys and types', () =>
	{
		// Get filepath of path map

		let classPathMapContentsAsObject = require(pathmapFilePath);

		expect(classPathMapContentsAsObject).toBeInstanceOf(Object);

		let componentPaths = classPathMapContentsAsObject['component'];
		let abstractPaths = classPathMapContentsAsObject['abstract'];

		expect(Object.keys(componentPaths).length).toBe(3);
		expect(Object.keys(abstractPaths).length).toBe(1);

		for (let groupName in classPathMapContentsAsObject)
			if(classPathMapContentsAsObject.hasOwnProperty(groupName))
			{
				let classGroup = classPathMapContentsAsObject[groupName];

				for (let className in classGroup)
					if (classGroup.hasOwnProperty(className))
					{
						let filePath = classGroup[className];
						expect(typeof filePath).toBe(typeof "string");
					}
			}
	});
});