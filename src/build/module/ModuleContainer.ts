
import {ModuleContainer as PhusionModuleContainer} from "phusion/src/build/module/ModuleContainer";
import {AutoloadModule} from "./Autoload/AutoloadModule";
import {AutoloadModuleInterface} from "./Autoload/AutoloadModuleInterface";

export class ModuleContainer extends PhusionModuleContainer
{
	protected autoloadModule: AutoloadModuleInterface;

	public getAutoloadModule(): AutoloadModuleInterface
	{
		if (!this.autoloadModule)
		{
			this.autoloadModule = new AutoloadModule(this);
		}

		return this.autoloadModule;
	}
}