
import {PhusionAware} from "phusion/src/core/module/Phusion/PhusionAware";
import {PhusionInterface} from "phusion/src/core/PhusionInterface";
import {VueJsApp} from "../VueJsApp";
import VueRouter from 'vue-router';
// @ts-ignore
var routes = require("./../../../../../cache/routes");

declare const Vue: any;

export class RouterHandler extends PhusionAware
{
	private routesConfig: Array<any>;
	private router: any;

	public constructor(phusion: PhusionInterface)
	{
		super();
		this.setPhusion(phusion);
	}

	public getRouter(): any
	{
		if (!this.router)
		{
			Vue.use(VueRouter);

			// Read in routes config
			let routesConfig = this.getRoutesConfig();

			let routerOptions = {
				routes: routesConfig
			};

			routerOptions['mode'] = 'history';

			this.router = new VueRouter(routerOptions);
		}

		return this.router;
	}

	private getRoutesFromRoutesConfig(routesConfig: Array<any>, outputRoutesVariable: Array<any> = [])
	{
		let app = this.getPhusion().getApp() as VueJsApp;
		let viewHandler = app.getViewHandler();

		// For each routesConfig
		for (let routeConfig of routesConfig)
		{
			// Change component value to actual vue component
			let component = routeConfig['component'];

			if (!component)
			{
				throw Error('No component found for route: ' + routeConfig['path']);
			}

			let componentName = component.prototype.constructor['name'];

			if (!this.isComponentNameValid(componentName))
			{
				throw Error('Cannot configure routes to a component not found in the classmap: ' + component);
			}

			let vueComponent = viewHandler.getVueComponentByComponentClassName(componentName);

			let outputConfig = {
				"path": routeConfig["path"],
				"component": vueComponent
			};

			// If "children" key is present, change children value to result of this function, passing in children Array
			if (routeConfig["children"] !== undefined)
			{
				outputConfig["children"] = this.getRoutesFromRoutesConfig(routeConfig["children"], []);
			}

			outputRoutesVariable.push(outputConfig);
		}

		return outputRoutesVariable;
	}

	private isComponentNameValid(componentName: string): boolean
	{
		let app = this.getPhusion().getApp() as VueJsApp;
		let classmap = app.getClassmap();

		let componentClassmap = this.getPhusion().getConfigModule().getObjectValueByKeyPath('component', classmap);

		if (!classmap || !componentClassmap)
		{
			throw Error('Cannot configure routes without classmap.');
		}

		if (componentClassmap[componentName])
		{
			return true;
		}

		return false;
	}

	private getRoutesConfig(): Array<any>
	{
		if (!this.routesConfig)
		{
			this.routesConfig = this.getRoutesFromRoutesConfig(routes);
		}

		return this.routesConfig;
	}

}
