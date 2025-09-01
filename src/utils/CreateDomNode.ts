import { isEventProp, isFunction, isObject, isString } from "./utils";

export function createDomNode(params : R01ElementParams): HTMLElement {
    const { tag, props } = params;
    if (tag === 'text') {
		return document.createTextNode(props.textContent as string) as unknown as HTMLElement;
    }

    const element = document.createElement(tag);
    
    for (const attr in props) {
        const propValue: any = props[attr];
        if (isEventProp(attr) && isFunction(propValue)) {
            element.addEventListener(attr.slice(2).toLowerCase(), propValue);
        } else if (attr === 'style' &&  isObject(propValue)) {
            for (const key in propValue) {
                element.style[key as any] = props.style[key];
            }
        } else {
            element.setAttribute(attr, propValue);
        }
    }

    return element;
}