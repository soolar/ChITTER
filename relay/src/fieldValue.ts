import { Class, Familiar, Item, Skill, Stat } from 'kolmafia'

export type FieldValueBase =
	| string
	| number
	| boolean
	| null
	| undefined
	| Item
	| Skill
	| Class
	| Familiar
export type FieldValue = FieldValueBase | FieldValueBase[]
export type FieldData<T> = [string, (thing: T) => FieldValue]

export const fieldValueToJSString: (value: FieldValue) => string = (
	value: FieldValue
) => {
	if (Array.isArray(value)) {
		return `[${value
			.map((subValue) => fieldValueToJSString(subValue))
			.join(', ')}]`
	}
	if (value === undefined) {
		throw new TypeError(
			'Filter out undefined before calling fieldValueToJSString'
		)
	}
	if (value === null) {
		return 'null'
	}
	if (typeof value === 'boolean' || typeof value === 'number') {
		return value.toString()
	}
	if (typeof value === 'string') {
		return `"${value
			.replace(/\\/g, '\\\\')
			.replace(/"/g, '\\"')
			.replace(/\n/g, '\\n')}"`
	}
	if (value instanceof Item) {
		return `items.byName["${value.toString()}"]`
	}
	if (value instanceof Skill) {
		return `skills.byName["${value.toString()}"]`
	}
	if (value instanceof Class) {
		return `classes.byName["${value.toString()}"]`
	}
	if (value instanceof Familiar) {
		return `familiars.byName["${value.toString()}"]`
	}
	throw new TypeError('Unhandled type in fieldValueToJSString')
}
