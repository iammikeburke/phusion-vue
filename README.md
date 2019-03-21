# phusion-vue

A lightweight VueJS wrapper written in TypeScript. Powered by the [Phusion](https://github.com/ieatstickers/phusion) library.

### Getting Started

To see the recommended way to set up a `phusion-vue` project, see the [`phusion-vue-skeleton`](https://github.com/ieatstickers/phusion-vue-skeleton) repo, which includes a everything you need to start building an SPA including a gulpfile with tasks pre-written for scss compilation, JavaScript concatenation and uglification, webpack builds as well as the custom tasks used from `phusion-vue` and [`phusion`](https://github.com/ieatstickers/phusion). 

### Components

`phusion-vue` takes care of component registration under the hood, so all you need to do to define a component is create a new TypeScript class. All component class names must end in `Component` e.g. `HeaderComponent` as this is how they are found and registered.

To understand the difference between Vue components and Phusion components, consider the following example:

In Vue, we would register our component using `Vue.component` and our component object would be organised into data, methods, computed and any lifecycle hooks defined directly on the component object.
```typescript
Vue.component('my-example', {
  props: ['text'],
  template: '<button @click="incrementCounter()">{{ computeButtonText() }}</button>',
  data: function() {
    return {
      counter: 0
    }
  },
  methods: {
    incrementCounter: function() {
      this.counter++;
    },
    computed: {
      computeButtonText: function() {
        if (this.text && this.counter > 0)
        {
          return this.text.slice(0, this.counter);
        }
        return 'Click me to reveal text!';
        }
    }
  }
})
```
To achieve the same with a Phusion component, we create a TypeScript class that extends the `AbstractPhusionComponent` class. There is no need to nest your properties and methods under `data` or `methods` etc. These can all be defined directly on the component class.

As mentioned above, all component class names must end in `Component` e.g. `MyExampleComponent` as this is how they are found and registered. The file name must also be the same as the class name, followed by `.ts` e.g. `MyExampleComponent.ts`.

To see how to add your component template, see the **Views** section below.


```typescript
// MyExampleComponent.ts 

import {AbstractPhusionComponent} from 'phusion-vue/src/core/AbstractPhusionComponent'

export class MyExampleComponent extends AbstractPhusionComponent
{
  // Required for all Phusion components
  public selector: string = 'my-example';
  
  // Props
  public text: string;
  
  // Data properties
  public counter: number = 0;
  
  // Methods 
  public incrementCount()
  {
    this.counter++;
  }
  
  // Computed functions
  // Any methods that start with "compute" will be registered under the computed key
  public computeButtonText()
  {
    if (this.text && this.counter > 0)
    {
      return this.text.slice(0, this.counter);
    }
    
    return 'Click me to reveal text!';  	
  }
}
```

### Views

When using `phusion-vue`, component templates are stored in `.html` files in a folder next to the component class called `View`. The view file name needs to be the same as the component name, without the `Component` suffix.

Example file tree:
```
- View/
  - MyExample.html
- MyExampleComponent.ts
```

Views are cached at build time and loaded when components are registered.

### Routing

Routes defined in the config will be registered with [`vue-router`](https://github.com/vuejs/vue-router). All you need to do is add your routes array to a `.yaml` config file under the config path `phusion:routes`. This will then get picked up by the `ConfigTask` and included at build time.
 
 To make things easy, this array follows the same format you would when using [`vue-router`](https://github.com/vuejs/vue-router) directly.

```yaml
# default-routes.yaml
phusion:
  routes:
    - path: "/"
      component: ExampleAppComponent
      children:
        - path: "page-one"
          component: PageOneComponent
        - path: "page-two"
          component: PageTwoComponent
```

### Tasks

To do most of the heavy lifting, a handful of custom build tasks have been written that plug nicely into gulp.

- [ClassmapTask](docs/build/task/ClassmapTask.md)
- [TemplatesTask](docs/build/task/TemplatesTask.md)
- [RoutesTask](docs/build/task/RoutesTask.md)

For examples of how these are added to Gulp, see the [`phusion-vue-skeleton`](https://github.com/ieatstickers/phusion-vue-skeleton) repository.