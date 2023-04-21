import {
	Class,
	Effect,
	Familiar,
	formFields,
	getProperty,
	Item,
	Location,
	MafiaClass,
	print,
	Skill,
	Slot,
	Thrall,
	writeln,
} from 'kolmafia'
import { FieldData, fieldValueToJSString } from '../fieldValue'
import {
	buildSingleFromFields,
	classGuidelines,
	effectGuidelines,
	familiarGuidelines,
	itemGuidelines,
	locationGuidelines,
	skillGuidelines,
	slotGuidelines,
	thrallGuidelines,
} from '../guidelines'

function json(response: { [index: string]: unknown }): void {
	writeln(JSON.stringify(response))
}

interface DataLayout {
	effects: Record<string, string>
	items: Record<string, string>
	familiars: Record<string, string>
	skills: Record<string, string>
	slots: Record<string, string>
	thralls: Record<string, string>
	classes: Record<string, string>
	locations: Record<string, string>
	properties: Record<string, string>
}

export function main(): void {
	const bodyStr = formFields().body
	if (!bodyStr) {
		json({
			error:
				'Request must have a "body" POST field and be x-www-form-urlencoded.',
		})
		return
	}
	const body = JSON.parse(bodyStr)
	if (!body) {
		json({ error: 'Invalid JSON in body field.' })
		return
	}

	const res: DataLayout = {
		effects: {},
		items: {},
		familiars: {},
		skills: {},
		slots: {},
		thralls: {},
		classes: {},
		locations: {},
		properties: {},
	}

	const handleSection = <T extends MafiaClass>(
		name: keyof DataLayout,
		getter: (names: string[]) => T[],
		fields: FieldData<T>[]
	) => {
		if (!body[name]) {
			return true
		}
		if (!Array.isArray(body[name])) {
			json({ error: `If provided, ${name} should be a valid array.` })
			return false
		}
		const list = getter(body[name] as string[]) as T[]
		list.forEach(
			(thing) =>
				(res[name][thing.toString()] = buildSingleFromFields(thing, fields))
		)
		return true
	}

	if (!handleSection('effects', Effect.get, effectGuidelines.fields)) {
		return
	}
	if (!handleSection('items', Item.get, itemGuidelines.fields)) {
		return
	}
	if (!handleSection('familiars', Familiar.get, familiarGuidelines.fields)) {
		return
	}
	if (!handleSection('skills', Skill.get, skillGuidelines.fields)) {
		return
	}
	if (
		!handleSection(
			'slots',
			Slot.get as (names: string[]) => Slot[],
			slotGuidelines.fields
		)
	) {
		return
	}
	if (
		!handleSection(
			'thralls',
			Thrall.get as (names: string[]) => Thrall[],
			thrallGuidelines.fields
		)
	) {
		return
	}
	if (
		!handleSection(
			'classes',
			Class.get as (names: string[]) => Class[],
			classGuidelines.fields
		)
	) {
		return
	}
	if (!handleSection('locations', Location.get, locationGuidelines.fields)) {
		return
	}

	if (body.properties) {
		if (!Array.isArray(body.properties)) {
			json({ error: 'If provided, properties should be a valid array.' })
			return
		}
		;(body.properties as string[])
			.map((propName) => [propName, getProperty(propName)])
			.forEach((nameAndVal) => {
				res.properties[nameAndVal[0]] = nameAndVal[1]
			})
	}

	json(res as unknown as { [index: string]: unknown })
}
