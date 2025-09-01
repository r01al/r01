import { createDomNode } from "../utils/CreateDomNode";
import { isString, uuid } from "../utils/utils";

export class R01NodeElementClass implements R01NodeElement {
	uuid: string;
	tag: string;
	props: R01ElementProps;
	children: R01NodeElementClass[];
	parent: R01NodeElement | null;
	domNode: HTMLElement | null = null;

	state: any = {};

	constructor(params: R01ElementParams | string, parent: (R01NodeElement | null)) {
		const isStringNode = isString(params);
		this.uuid = uuid();
		this.tag = isStringNode ? 'text' : (params as R01ElementParams).tag;
		this.props = isStringNode ? { textContent: params } : (params as R01ElementParams).props;
		this.parent = parent || null;
		this.children = isStringNode ? [] : (params as R01ElementParams).children.map((child: R01ElementParams) => {
			return new R01NodeElementClass(child, this as unknown as R01NodeElement);
		});

		return this;
	}

	render () {
		// console.log(`Rendering node: <${this.tag}> with UUID: ${this.uuid}`);
		this.domNode = createDomNode(
			{ tag: this.tag, props: this.props, children: this.children }
		);

		this.children.forEach((child) => {
			child.render();
			child.domNode && this.domNode?.appendChild(child.domNode);
		});
	}
}

