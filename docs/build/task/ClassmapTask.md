
## Classmap Task  
  
 Scans your project for all component files (`*Component.ts`) and creates a cache of component classes by name. This is used at runtime to register components.
 
 After running this task, you might also notice `pathmap.js` is created next to your classmap file. This does not get used at runtime and is simply there to help build import statements for other generated files.
 
 ### Example Usage
```javascript
var ClassmapTask = require('phusion-vue/dist/build/ClassmapTask');

var task = new ClassmapTask(
  {
    projectRootDirPath: __dirname,
    outputFilePath: __dirname + '/cache/classmap.js'
  }
);

task.run();
```

### Options

#### projectRootDirPath: string

Directory containing project source files. This is the directory that will be scanned for component classes.

This option will default to the directory the task is being run from (`process.cwd()`)

#### outputFilePath: string

File path to write classmap to e.g. `"/Users/MyUser/code/my-project/cache/classmap.json"`

This option defaults to `process.cwd() + '/cache/classmap.js'`. 

**Note:** `phusion-vue` requires this value to be the default as this is the file path it looks for at runtime, however, if you wanted to use the task in another project, it's configurable.

#### groups: Object

If you open up the classmap that is generated, you'll see that the components are grouped under a `component` key. This is a ***group*** called `component` that has an associated regex pattern. When the directory is scanned, all file names that match that pattern will be loaded under that key in the classmap.

The only group needed by `phusion-vue` is `component` however if other parts of your application would benefit from being able to get certain classes by key, you can add your own groups. 

The default groups object looks like this:

```json
{
  "component": "^(?!Abstract|abstract.*$)[^\\s]*[Cc]omponent\\.ts$" 
}
```

The `component` group's regex matches all TypeScript files that end in the word **"Component"** and do not start with the word **"Abstract"**. This is because you may want to define some classes that can be extended by multiple components to share common logic without giving them a template and registering them as components in VueJS. Therefore, component names starting with "Abstract" are reserved for this purpose e.g. `AbstractPageComponent`