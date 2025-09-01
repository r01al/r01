type R01App = {
	root: R01NodeElement;
	domNode: HTMLElement;
}

type R01ElementParams = {
	tag: string;
	props: R01ElementProps;
	children: R01ElementParams[];
}

type R01NodeElement = {
	uuid: string;
	tag: string;
	props: R01ElementProps;
	children: R01NodeElement[];
	parent: R01NodeElement | null;
}

type MountAppOptions = {

}

type R01ElementProps = {
	[key: string]: any;
}