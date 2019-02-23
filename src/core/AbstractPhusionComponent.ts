
import {PhusionInterface} from "phusion/src/core/PhusionInterface";
import {PhusionAware} from "phusion/src/core/module/Phusion/PhusionAware";
import {PhusionComponentInterface} from "./PhusionComponentInterface";

export abstract class AbstractPhusionComponent extends PhusionAware implements PhusionComponentInterface
{
	public constructor(phusion: PhusionInterface)
	{
		super();
		this.setPhusion(phusion);
	}

	public getComponentElement(): any
	{
		return this['$el'];
	}
}