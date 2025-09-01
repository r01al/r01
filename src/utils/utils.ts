const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const uuid = (length: number = 15): string => {
	let result = '';
	for (let i = 0; i < length; i++) {
		result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
	}

	return result;
}

export const isObject = (obj: any): boolean => {
	return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

export const isFunction = (func: any): boolean => {	
	return typeof func === 'function';
}
export const isString = (str: any): boolean => {
	return typeof str === 'string';
}

export const isEventProp = (prop: string): boolean => {
	return /^on/.test(prop);
}