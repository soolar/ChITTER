import { BrowserItem } from './guidelines';

export type FieldValueBase = string | number | boolean | null | Item | Skill;
export type FieldValue = FieldValueBase | FieldValueBase[];
export type FieldData<T> = [string, (thing: T) => FieldValue] | string;

export const fieldValueToJSString: (value: FieldValue) => string = (
	value: FieldValue
) => {
	if (Array.isArray(value)) {
		return `[${value
			.map((subValue) => fieldValueToJSString(subValue))
			.join(', ')}]`;
	}
	if (value === null) {
		return 'null';
	}
	if (typeof value === 'boolean' || typeof value === 'number') {
		return value.toString();
	}
	if (typeof value === 'string') {
		return `"${value.replace(/"/g, '\\"')}"`;
	}
	if (value instanceof Item) {
		return `items.byName["${value.toString()}"]`;
	}
	if (value instanceof Skill) {
		return `skills.byName["${value.toString()}"]`;
	}
	return 'undefined';
};

export const pluralize = (thing: string | BrowserItem, amount: number) => {
	if (typeof thing === 'string') {
		if (thing.slice(-1) === 's') {
			return amount === 1 ? thing.slice(0, -1) : thing;
		}
		if (amount === 1) {
			return thing;
		}
		if (thing.slice(-1) === 'y') {
			return `${thing.slice(0, -1)}ies`;
		}
		return `${thing}s`;
	}
	return amount === 1 ? thing.name : thing.plural;
};
