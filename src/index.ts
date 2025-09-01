import { R01NodeElementClass } from './Classes/NodeElementClass';

class R01 {
	private apps: { [key: string]: R01NodeElement } = {};
	addApp (params: R01ElementParams, node: HTMLElement, opts: MountAppOptions) {
		const appId = `app-${Object.keys(this.apps).length + 1}`;
		const app = new R01NodeElementClass(params, null);
		app.render();
		if (!app.domNode) return;
		app.domNode.setAttribute('data-r01-app-id', appId);
		node.replaceWith(app.domNode);
		this.apps[appId] = app;
	}
}

const r01Instance = new R01();


export const MountApp = (element: R01ElementParams, node: HTMLElement, opts: MountAppOptions) => {
	r01Instance.addApp(element, node, opts);
}