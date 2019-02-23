
import {PhusionComponentInterface} from "../PhusionComponentInterface";
import {PhusionInterface} from "phusion/src/core/PhusionInterface";
import {PhusionAware} from "phusion/src/core/module/Phusion/PhusionAware";
import {VueJsApp} from "../VueJsApp";
// @ts-ignore
var classmap = './../../../../../cache/classmap';

declare let Vue: any;

export class ViewHandler extends PhusionAware
{
	private classmap: Object;
	private templateCache: Object;
	private registeredSelectorArray: Array<string> = [];
	private vueComponentConfig: Object = {};

	public constructor(phusion: PhusionInterface)
	{
		super();
		this.setPhusion(phusion);
	}

	private addVueComponentToViewComponentConfig(componentClassName: string, vueComponent: any): this
	{
		// Throw error if Vue component has already been added
		if (!(this.vueComponentConfig[componentClassName] == undefined))
		{
			throw Error('Vue Component has already been added to Vue component config for component class: ' + componentClassName);
		}

		this.vueComponentConfig[componentClassName] = vueComponent;

		return this;
	}

	private getClassmap(): Object
	{
		if (!this.classmap)
		{
			this.classmap = classmap;
		}

		return this.classmap;
	}

	private getViewByComponentName(componentClassName: string): string
	{
		let viewCache = this.getTemplateCache();

		let view = viewCache[componentClassName];

		if (view !== undefined)
		{
			return view;
		}

		return null;
	}

	private getTemplateCache(): Object
	{
		if (!this.templateCache)
		{
			this.templateCache = require('./../../../../../cache/templates');
		}

		return this.templateCache;
	}

	public getVueComponentByComponentClassName(componentClassName: string): any
	{
		let vueComponent = this.vueComponentConfig[componentClassName];

		if (vueComponent == undefined)
		{
			return null;
		}

		return vueComponent;
	}

	public initialiseRootVueInstance(rootElementSelector: string, router: any): any
	{
		// Create root Vue instance
		return new Vue({
			router: router,
			el: rootElementSelector
		});
	}

	private isSelectorAlreadyRegistered(selector: string): boolean
	{
		for (let registeredSelector of this.registeredSelectorArray)
		{
			if (registeredSelector == selector)
			{
				return true;
			}
		}

		return false;
	}

	private getComponentObjectFromComponentClass(phusionComponent: PhusionComponentInterface)
	{
		let componentObject = {};
		let dataObject = {};
		let methodsObject = {};
		let computedObject = {};

		let nonDataPropertyNames = [
			'props',
			'components'
		];

		let lifeCycleMethodNames = [
			'beforeCreated',
			'created',
			'beforeMount',
			'mounted',
			'beforeUpdate',
			'updated',
			'beforeDestroy',
			'destroy',
			'beforeRouteLeave',
			'beforeRouteEnter',
			'beforeRouteUpdate'
		];

		// For each key in phusion component
		for (let key in phusionComponent)
		{
			/**
			 * COMPUTED FUNCTION
			 */
			if (
				// If it's a function
				typeof phusionComponent[key] === 'function'
				// And it starts with $ (map to computed function)
				&& /^\compute.+/.test(key)
			)
			{
				// Map to computed function
				computedObject[key] = phusionComponent[key];
			}

			/**
			 * METHODS FUNCTION
			 */
			else if (
				// If key is a function
				typeof phusionComponent[key] === 'function'
				&&
				// Method name IS NOT a lifecycle hook
				lifeCycleMethodNames.indexOf(key) === -1
			)
			{
				methodsObject[key] = phusionComponent[key];
			}

			/**
			 * LIFECYCLE HOOK FUNCTION
			 */
			else if (
				// If key is a function
				typeof phusionComponent[key] === 'function'
				&&
				// Method name IS a lifecycle hook
				lifeCycleMethodNames.indexOf(key) !== -1
			)
			{
				componentObject[key] = phusionComponent[key];
			}

			/**
			 * DATA OBJECT
			 */
			// data() function
			else
			{
				// If property should be excluded
				if (nonDataPropertyNames.indexOf(key) !== -1)
				{
					componentObject[key] = phusionComponent[key];
				}
				else
				{
					dataObject[key] = phusionComponent[key];
				}
			}

		}

		componentObject['data'] = function()
		{
			return dataObject;
		};

		componentObject['methods'] = methodsObject;
		componentObject['computed'] = computedObject;

		return componentObject;
	}

	public registerComponents(): this
	{
		let phusion = this.getPhusion();
		let app = phusion.getApp() as VueJsApp;
		let configModule = phusion.getConfigModule();

		// Get classmap
		let classmap = app.getClassmap();
		// Get all components from classmap
		let componentClassMap = configModule.getObjectValueByKeyPath('component', classmap);

		if (!componentClassMap)
		{
			componentClassMap = {};
		}

		// For each one in classmap
		for (let componentClassName in componentClassMap)
		{
			if (componentClassMap.hasOwnProperty(componentClassName))
			{
				// Instantiate the component
				// Get component class from cache
				let componentClass = componentClassMap[componentClassName];

				if (componentClass == undefined)
				{
					throw Error('No component class found in cache for ' + componentClassName);
				}

				// instantiate component
				let component = new componentClass(phusion);


				// Get the selector from the component
				let selector = component.selector;

				if (!selector)
				{
					throw Error('No selector defined for ' + componentClassName + '. Implement \'selector\' property on the component class.');
				}

				if (this.isSelectorAlreadyRegistered(selector))
				{
					throw Error('Cannot register component as selector has already been registered in another component. Selector: ' + selector);
				}

				// Get the template string from the viewCache
				let template = this.getViewByComponentName(componentClassName);

				if (!template)
				{
					throw Error('No template found in view cache for ' + componentClassName);
				}

				Vue.prototype.uniqueId = null;

				let componentObject = this.getComponentObjectFromComponentClass(component);

				componentObject['template'] = template;

				// Register the component globally
				let vueComponent = Vue.component(selector, componentObject);

				// Add Vue component to this.registeredVueComponents so it can be used in routes
				this.addVueComponentToViewComponentConfig(componentClassName, vueComponent);
			}
		}

		// Reset registered selector array
		this.registeredSelectorArray = [];

		return this;
	}
}
