
import {AbstractModule} from "phusion/src/build/module/AbstractModule"
import {AutoloadModuleInterface} from "./AutoloadModuleInterface";
import {Config} from "phusion/src/build/module/Config/Entity/Config";

export class AutoloadModule extends AbstractModule implements AutoloadModuleInterface
{
	protected nodeJsPath;

	public generateClassmap(projectRootDirPath: string, outputFilePath: string, groups: Object, ignorePatterns: Array<RegExp> = []): number
	{
		let fileSystemModule = this.getModuleContainer().getFileSystemModule();
		let combinedClassmap = {};
		let classmap = {};
		let classPathMap = {};

		// For each file recursively
		let filesScanned = fileSystemModule.forEachFileRecursively(
			projectRootDirPath,
			function(fileName: string, absoluteFilePath: string)
			{
				// If node_modules, continue
				if (absoluteFilePath.indexOf('node_modules') !== -1)
				{
					// console.log('*** NODE_MODULES: ' + absoluteFilePath + ' ***');
					return;
				}
				else
				{
					// console.log('Processing:' + absoluteFilePath);
				}

				if (groups instanceof Config)
				{
					groups = groups.toObject();
				}

				// For each group
				// e.g. "component": "([A-z]+Component.ts)"
				for (let groupName in groups)
				{
					let groupRegex = groups[groupName];

					let regExp = new RegExp(groupRegex);

					// If the file name matches the regex
					if (regExp.test(fileName))
					{
						// Build relative file path
						let rootPathPlaceholder = '{src}';

						// Replace everything up to the project root with a placeholder
						let pathFromProjectRoot = absoluteFilePath.replace(projectRootDirPath, rootPathPlaceholder);

						if (absoluteFilePath.charAt(0) !== '/')
						{
							rootPathPlaceholder+= '/';
						}

						// Add it to the combined classmap object under the correct key and set the file path
						if (!combinedClassmap[groupName])
						{
							combinedClassmap[groupName] = {};
						}

						// classmap
						if (!classmap[groupName])
						{
							classmap[groupName] = {};
						}

						// Class path map
						if (!classPathMap[groupName])
						{
							classPathMap[groupName] = {};
						}

						let fileNameParts = fileName.split('.');
						let className = fileNameParts[0];

						classmap[groupName][className] = className;
						classPathMap[groupName][className] = pathFromProjectRoot;

						combinedClassmap[groupName][className] = {
							'class': className,
							'filePath': pathFromProjectRoot
						};
					}
				}
			},
			ignorePatterns
		);

		/**
		 * Write classmap file
		 */

		// If file already exists, empty it
		fileSystemModule.writeFile(outputFilePath, '');

		// Stringify classmap
		let classmapString = JSON.stringify(classmap, null, 2);

		// Remove quotes from class names
		classmapString = this.removeQuotesFromClassNames(classmap, classmapString);

		// Remove filename to get outputDirPath
		let outputDirPath = outputFilePath.replace(/\/[^\/]+\..[^\.]$/, '');

		// Add import statement block
		let importStatementBlockAsString = this.getImportStatementBlock(classPathMap, projectRootDirPath, outputDirPath);

		let fileContents = importStatementBlockAsString + '\n' + 'module.exports = ' + classmapString + ';\n';

		// Write classmap to output file
		fileSystemModule.writeFile(outputFilePath, fileContents);

		/**
		 * Write class path map file
		 */

		let classPathMapOutputFilePath = outputFilePath.replace(/\/[^/]+\.[^\.]+$/, '/pathmap.js');

		// Stringify classmap
		let pathMapString = JSON.stringify(classPathMap, null, 2);

		pathMapString = this.removeQuotesFromClassNames(classmap, pathMapString);

		let pathMapFileContents = '\n' + 'module.exports = ' + pathMapString + ';\n';

		// Write classmap to output file
		fileSystemModule.writeFile(classPathMapOutputFilePath, pathMapFileContents);

		return filesScanned;
	}

	public getImportStatementBlock(classPathMap: Object, projectRootAbsolutePath: string, importFromDirPath: string): string
	{
		const importStatementTemplate = "const {{className}} = require(\"{relativePath}\");\n";
		let importStatementBlock = "";

		let fileSystemModule = this.getModuleContainer().getFileSystemModule();

		// How to get from project root from importDirPath
		let srcReplacement = fileSystemModule.getRelativePathBetweenDirs(importFromDirPath, projectRootAbsolutePath);

		let classesAddedToImportBlock = [];

		for (let groupName in classPathMap)
		{
			// Comment for the group
			importStatementBlock+= "\n// " + groupName + "\n";

			// Get all classes in this group
			let groupClassmap = classPathMap[groupName];

			// For each class in the group
			for (let className in groupClassmap)
				if (groupClassmap.hasOwnProperty(className))
				{
					// If import statement already added for this class
					if (classesAddedToImportBlock.indexOf(className) !== -1)
					{
						continue;
					}

					let relativePathFromRoot = groupClassmap[className];

					let importPath = relativePathFromRoot
					// Replace {src} placeholder
						.replace('{src}', srcReplacement)
						// Remove file extension
						.replace(/\.[^.]+$/, '');

					let importStatement = importStatementTemplate;

					importStatement = importStatement
						.replace('{className}', className)
						.replace('{relativePath}', importPath);

					importStatementBlock+= importStatement;

					classesAddedToImportBlock.push(className);
				}
		}

		return importStatementBlock;
	}

	public removeQuotesFromClassNames(classmap: Object, jsonString: string): string
	{
		// Remove quotes around class names
		let classNamesToBeReplaced = [];

		// For each key in the classmap
		for (let groupName in classmap)
		{
			if (classmap.hasOwnProperty(groupName))
			{
				// Get an array of file path maps for all classes under this key
				let group = classmap[groupName];

				// Get array of class names
				let classes = Object.keys(group);

				// Add them to array of class names to be replaced
				classNamesToBeReplaced = classNamesToBeReplaced.concat(classes);
			}
		}

		// For each class name in that array
		for (let classNameToReplace of classNamesToBeReplaced)
		{
			// Run a string replace on the jsonString to remove any instances surrounded by quotes
			let regexPatternToReplace = new RegExp('\"' + classNameToReplace + '\"', 'g');
			jsonString = jsonString.replace(regexPatternToReplace, classNameToReplace);
		}

		return jsonString;
	}
}