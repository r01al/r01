type R01App = {
	root: R01NodeElement;
	domNode: HTMLElement;
}

type R01ElementParamsChildren = R01ElementParams[] | string [];

type R01ElementParams = {
	tag: string;
	props: R01ElementProps;
	children: R01ElementParamsChildren;
}

type R01NodeElement = {
	uuid: string;
	tag: string;
	props: R01ElementProps;
	children: R01NodeElement[];
	parent: R01NodeElement | null;
	domNode: HTMLElement;
}

type MountAppOptions = {

}

type R01ElementProps = {
	[key: string]: string | number | boolean;
}