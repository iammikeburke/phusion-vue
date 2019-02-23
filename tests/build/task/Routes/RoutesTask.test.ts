
import {ConfigMergeTask} from 'phusion/src/build/task/ConfigMerge/ConfigMergeTask';
import {ClassmapTask} from '../../../../src/build/task/ClassmapTask';
import {RoutesTask} from '../../../../src/build/task/RoutesTask';
import {ModuleContainer} from "../../../../src/build/module/ModuleContainer";

/**
 * RoutesTask
 */
describe('RoutesTask', () =>
{
	// Config
	let config_configDirPath = __dirname + '/config/';
	let config_outputFilePath = __dirname + "/cache/config.js";
	let config_outputFormat = "node";

	// Classmap
	let classmap_projectRootDirPath = __dirname;
	let classmap_outputFilePath = __dirname + '/cache/classmap.js';
	let classmap_groups = {
		abstract: "^(Abstract|abstract.*$).*\.ts$"
	};

	// Routes
	let routes_projectRootDirPath = __dirname;
	let routes_classmapFilePath = __dirname + '/cache/classmap.js';
	let routes_outputFilePath = __dirname + '/cache/routes.js';
	let routes_configFilePath = __dirname + '/cache/config.js';
	let routes_routesConfigKeyPath = "phusion:routes";

	beforeAll(() =>
	{
		/**
		 * Build Config
		 */

		let configTask = new ConfigMergeTask(
			{
				configDirPath: config_configDirPath,
				outputFilePath: config_outputFilePath,
				outputFormat: config_outputFormat
			}
		);

		configTask.run();

		/**
		 * Build Classmap
		 */

		let buildClassmapTask = new ClassmapTask(
			{
				projectRootDirPath: classmap_projectRootDirPath,
				outputFilePath: classmap_outputFilePath,
				groups: classmap_groups
			}
		);

		buildClassmapTask.run();

		/**
		 * Build Routes
		 */

		let routesTask = new RoutesTask(
			{
				projectRootDirPath: routes_projectRootDirPath,
				classmapFilePath: routes_classmapFilePath,
				outputFilePath: routes_outputFilePath,
				configFilePath: routes_configFilePath,
				routesConfigKeyPath: routes_routesConfigKeyPath
			}
		);

		routesTask.run();
	});

	test('Outputs a routes file with the correct name and file path', () =>
	{
		let moduleContainer = new ModuleContainer();

		// Get contents of output file
		let outputFileContents = moduleContainer.getFileSystemModule().readAsTextString(routes_outputFilePath);

		expect(typeof outputFileContents).toBe('string');
		expect(outputFileContents.length).toBeGreaterThan(1);
	});

	test('Output routes file can be imported and the result is of type Array', () =>
	{
		// Get contents of output file
		let routes = require(routes_outputFilePath);

		expect(routes).toBeInstanceOf(Array);
	});

	test('Output routes contain the correct keys and types', () =>
	{
		// Get contents of output file
		let routes = require(routes_outputFilePath);

		let baseRoute = routes[0];

		expect(typeof baseRoute['path']).toBe('string');
		expect(baseRoute['path']).toBe('/');
		expect(typeof baseRoute['component']).not.toBe('string');

		let routeChildren = baseRoute['children'];
		expect(routeChildren).toBeInstanceOf(Array);

		for (let key in routeChildren)
			if (routeChildren.hasOwnProperty(key))
			{
				let route = routeChildren[key];

				expect(typeof route['path']).toBe('string');
				expect(typeof route['component']).not.toBe('string');
			}
	})

});