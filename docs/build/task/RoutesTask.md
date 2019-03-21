
## Routes Task  
  
 Finds the `.html` files for all components in the classmap and builds a template cache so they can be retrieved when components are registered at runtime.
 
 Reads routes from the config and generates a routes file to be imported and registered with vue-router. 
 
 ### Example Usage
```javascript
const projectRoot = __dirname;

const task = new RoutesTask(
  {
    projectRootDirPath: projectRoot,
    classmapFilePath: projectRoot + '/cache/classmap.js',
    outputFilePath: projectRoot + '/cache/routes.js',
    configFilePath: projectRoot + '/cache/config.js',
    routesConfigKeyPath: "phusion:routes"
  }
);

task.run();
```

### Options

#### projectRootDirPath: string

Directory containing project source files. Used for generating import statements in the routes file.

This option will default to the directory the task is being run from (`process.cwd()`)

#### outputFilePath: string

File path to write routes file to e.g. `"/Users/MyUser/code/my-project/cache/routes.js"` 

Defaults to `process.cwd() + '/cache/routes.js`;

#### configFilePath: string

File path to generated config file from Phusion's [`ConfigTask`](https://github.com/ieatstickers/phusion). 

Defaults to `process.cwd() + '/cache/config.js`;

#### routesConfigKeyPath: string

Config key path under which routes are defined in the config. 

Defaults to `'phusion:routes'`
