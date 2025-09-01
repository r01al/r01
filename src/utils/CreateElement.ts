import { uuid } from "./utils";

export default function createElement (params: R01ElementParams, parent: (R01NodeElement | null)): R01NodeElement{
	const { tag, props, children } = params;
	const domNode = document.createElement(tag) as HTMLElement;
	
	if (parent) {
		parent.domNode.appendChild(domNode);
	}

	const el: R01NodeElement = {
		tag,
		props,
		children: children.map((child: R01ElementParamsChildren) => {
			if (typeof child === 'string') {
				domNode.innerText = child;
				return null;
			}

			return createElement(child, el);
		}),
		uuid: uuid(),
		parent: parent || null,
		domNode
	}

	return el;
}