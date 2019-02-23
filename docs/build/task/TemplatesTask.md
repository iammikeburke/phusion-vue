
## Templates Task  
  
 Finds the `.html` files for all components in the classmap and builds a template cache so they can be retrieved when components are registered at runtime.
 
 ### Example Usage
```javascript
var TemplatesTask = require('phusion-vue/dist/build/TemplatesTask');

var task = new TemplatesTask(
  {
    projectRootDirPath: __dirname,
    classmapFilePath: __dirname + '/cache/classmap.js',
    outputFilePath: __dirname + '/cache/templates.js'
  }
);

task.run();
```

### Options

#### projectRootDirPath: string

Directory containing project source files. This should be the same as the directory that is scanned for component classes in the `ClassmapTask`.

Defaults to `process.cwd()`

#### classmapFilePath: string

File path to the generated classmap.

Defaults to `process.cwd() + '/cache/classmap.js'`

#### outputFilePath: string

File path to write template cache to e.g. `'/Users/MyUser/code/my-project/cache/templates.js'` 

Defaults to `process.cwd() + '/cache/templates.js'`.

#### classmapGroup: string

The group in your classmap that contains all component classes.

Defaults to `component`.
