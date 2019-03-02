
import {PhusionAware} from "phusion/src/core/module/Phusion/PhusionAware";
import {RouterHandler} from "./Handler/RouterHandler";
import {ViewHandler} from "./Handler/ViewHandler";

export class VueJsApp extends PhusionAware
{
	private routerHandler: RouterHandler;
	private viewHandler: ViewHandler;
	private classmap: Object;

	public constructor(phusion)
	{
		super();
		phusion.setApp(this);
		this.setPhusion(phusion);
	}

	public getClassmap(): Object
	{
		if (!this.classmap)
		{
			this.classmap = require('./../../../../cache/classmap');
		}

		return this.classmap;
	}

	public getViewHandler(): ViewHandler
	{
		if (!this.viewHandler)
		{
			this.viewHandler = new ViewHandler(this.getPhusion());
		}

		return this.viewHandler;
	}
	public getRouterHandler(): RouterHandler
	{
		if (!this.routerHandler)
		{
			this.routerHandler = new RouterHandler(this.getPhusion());
		}

		return this.routerHandler;
	}

	public init(rootElementSelector: string)
	{
		let phusion = this.getPhusion();
		let app = phusion.getApp() as VueJsApp;
		let viewHandler = app.getViewHandler();
		let routerHandler = app.getRouterHandler();

		// Register components
		viewHandler.registerComponents();

		// Get Router
		let router = routerHandler.getRouter();

		// Create root Vue instance
		viewHandler.initialiseRootVueInstance(rootElementSelector, router);

		return this;
	}
}