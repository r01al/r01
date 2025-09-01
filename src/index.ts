import _createElement from './utils/CreateElement';

class R01 {
	private apps: { [key: string]: R01NodeElement } = {};
	addApp (params: R01ElementParams, node: HTMLElement, opts: MountAppOptions) {
		const appId = `app-${Object.keys(this.apps).length + 1}`;
		const app = _createElement(params, null);
		node.appendChild(app.domNode);
		this.apps[appId] = app;
	}
}

const r01Instance = new R01();


export const MountApp = (element: R01ElementParams, node: HTMLElement, opts: MountAppOptions) => {
	r01Instance.addApp(element, node, opts);
}

export const createElement = _createElement