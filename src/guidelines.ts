import {
	advCost,
	availableAmount,
	booleanModifier,
	canAdventure,
	canEquip,
	Class,
	closetAmount,
	creatableAmount,
	Effect,
	equippedAmount,
	equippedItem,
	Familiar,
	familiarEquipment,
	familiarWeight,
	favoriteFamiliars,
	fuelCost,
	getRelated,
	haveEffect,
	haveFamiliar,
	haveSkill,
	hpCost,
	isUnrestricted,
	Item,
	itemAmount,
	lightningCost,
	Location,
	MafiaClass,
	mpCost,
	myClass,
	myFamiliar,
	myLocation,
	myThrall,
	rainCost,
	Skill,
	Slot,
	soulsauceCost,
	storageAmount,
	stringModifier,
	Thrall,
	thunderCost,
	toFamiliar,
	toInt,
	toItem,
	toSlot,
	weaponHands,
	weightAdjustment,
} from 'kolmafia'
import {
	$classes,
	$effects,
	$familiars,
	$items,
	$locations,
	$skills,
	$slots,
	$thralls,
	get,
} from 'libram'
import { FieldData, FieldValue, fieldValueToJSString } from './fieldValue'
import { getPropVal } from './properties'

interface Guidelines<T extends MafiaClass> {
	name: string
	all: T[]
	fields: FieldData<T>[]
	favorites: T[]
	active: T[]
}

export const buildSingleFromFields = <T extends MafiaClass>(
	thing: T,
	fields: FieldData<T>[]
) => {
	return `{${fields
		.map((fieldData) => {
			const fieldName = typeof fieldData === 'string' ? fieldData : fieldData[0]
			const fieldValue = fieldData[1](thing)
			if (fieldValue === undefined) {
				return undefined
			}
			return `${fieldName}: ${fieldValueToJSString(fieldValue)}`
		})
		.filter((fieldStr) => fieldStr !== undefined)
		.join(', ')}}`
}

// maybe some day I'll figure out a way to do this without any, maybe not...
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildStringFromGuidelines = <T extends { [key: string]: any }>(
	guidelines: Guidelines<T>
) => {
	const res = [`\t\t\tvar ${guidelines.name} = {\n\t\t\t\tbyName: {\n`]
	res.push(
		...guidelines.all.map((thing) => {
			const res = [`\t\t\t\t\t${fieldValueToJSString(thing.toString())}: `]
			res.push(buildSingleFromFields(thing, guidelines.fields))
			res.push(',\n')
			return res.join('')
		})
	)
	res.push('\t\t\t\t}\n\t\t\t};\n')
	const addList = (list: T[], listName: string) => {
		res.push(
			`\t\t\t${guidelines.name}.${listName} = [\n${list
				.map(
					(thing) =>
						`\t\t\t\t${guidelines.name}.byName[${
							thing ? fieldValueToJSString(thing.toString()) : '"none"'
						}]`
				)
				.join(',\n')}\n\t\t\t];\n`
		)
	}
	addList(guidelines.all, 'all')
	if (guidelines.favorites) {
		addList(guidelines.favorites, 'favorites')
	}
	if (guidelines.active) {
		addList(guidelines.active, 'active')
	}
	return res.join('')
}

export interface BrowserList<T> {
	all: T[]
	favorites: T[]
	active: T[]
	byName: { [key: string]: T }
}

// BEGIN ACTUAL GUIDELINES

// Begin Effects
export interface BrowserEffect {
	name: string
	default: string
	image: string
	id: number
	descid: string
	quality: string
	song: boolean
	turnsActive: number
	mods: string
}

export declare const effects: BrowserList<BrowserEffect>

export const effectGuidelines: Guidelines<Effect> = {
	name: 'effects',
	all: $effects``,
	fields: [
		['name', (eff) => eff.name],
		['default', (eff) => encodeURI(eff.default)],
		['image', (eff) => eff.image],
		['id', (eff) => toInt(eff)],
		['descid', (eff) => eff.descid],
		['quality', (eff) => eff.quality],
		['song', (eff) => eff.song],
		['turnsActive', (eff) => haveEffect(eff)],
		['mods', (eff) => stringModifier(eff, 'Evaluated Modifiers')],
	],
	active: $effects``.filter((eff) => haveEffect(eff) !== 0),
	favorites: [],
}
// End Effects

// Begin Items
export interface BrowserItem {
	name: string
	image: string
	id: number
	descId: number
	plural: string
	inInventory: number
	inCloset: number
	inStorage: number
	foldable: number
	creatable: number
	onBody: number
	available: number
	unrestricted: boolean
	canEquip: boolean
	slotStr: string
	hands: number
	singleEquip: boolean
	mods: string
	foldableNames?: string[]
}

export declare const items: BrowserList<BrowserItem>

export const foldableAmount = (it: Item) =>
	Object.keys(getRelated(it, 'fold'))
		.filter((foldableName) => toItem(foldableName) !== it)
		.reduce(
			(partial, foldableName) =>
				partial + availableAmount(toItem(foldableName)),
			0
		)

export const itemGuidelines: Guidelines<Item> = {
	name: 'items',
	all: $items``,
	fields: [
		['name', (it) => it.toString()],
		['image', (it) => it.image],
		['id', (it) => toInt(it)],
		['descId', (it) => it.descid],
		['plural', (it) => it.plural],
		['inInventory', (it) => itemAmount(it)],
		['inCloset', (it) => closetAmount(it)],
		['inStorage', (it) => storageAmount(it)],
		['foldable', foldableAmount],
		['creatable', (it) => creatableAmount(it)],
		['onBody', (it) => equippedAmount(it)],
		['available', (it) => availableAmount(it)],
		['unrestricted', (it) => isUnrestricted(it)],
		['canEquip', (it) => canEquip(it)],
		['slotStr', (it) => toSlot(it).toString()],
		['hands', (it) => weaponHands(it)],
		['singleEquip', (it) => booleanModifier(it, 'Single Equip')],
		['mods', (it) => stringModifier(it, 'Evaluated Modifiers')],
		[
			'foldableNames',
			(it) => {
				const foldables = getRelated(it, 'fold')
				if (foldables) {
					const itemNames = Object.keys(foldables)
					if (itemNames.length > 0) {
						return itemNames
					}
				}
				return undefined
			},
		],
	],
	favorites: ((getPropVal('gear.favorites') ?? []) as Item[]).sort(
		(a: Item, b: Item) => toInt(a) - toInt(b)
	),
	active: [],
}
// End Items

// Begin Familiars
const mummeryCharacters = [
	'The Captain',
	'Beelzebub',
	'Saint Patrick',
	'Prince George',
	'Oliver Cromwell',
	'The Doctor',
	'Miss Funny',
]
export type MummeryCharacter = (typeof mummeryCharacters)[number]

export interface BrowserFamiliar {
	type: string
	image: string
	id: number
	name: string
	experience: number
	weight: number
	buffedWeight: number
	drop?: BrowserItem
	dropsLimit: number
	dropsToday: number
	dropName: string
	owned: boolean
	unrestricted: boolean
	canEquip: boolean
	uniqueEquipment?: BrowserItem
	mummeryCharacter?: MummeryCharacter
}

export declare const familiars: BrowserList<BrowserFamiliar>

const mummeryMap: { [mod: string]: MummeryCharacter } = {
	['MP Regen Min']: 'Beelzebub',
	['Item Drop']: 'Prince George',
	['HP Regen Min']: 'The Doctor',
	['Experience (Muscle)']: 'Saint Patrick',
	['Experience (Mysticality)']: 'Oliver Cromwell',
	['Experience (Moxie)']: 'Miss Funny',
	['Meat Drop']: 'The Captain',
}

function getMummeryCharacter(fam: Familiar) {
	const entries = get('_mummeryMods').split(',')
	const regExp = /([^:]+): \[\d+\*fam\(([^)]+)\)\]/
	for (const entry of entries) {
		const matcher = entry.match(regExp)
		if (matcher && toFamiliar(matcher[2]) === fam && mummeryMap[matcher[1]]) {
			return mummeryMap[matcher[1]]
		}
	}
	return undefined
}

export const familiarGuidelines: Guidelines<Familiar> = {
	name: 'familiars',
	all: $familiars``,
	fields: [
		['type', (fam) => fam.toString()],
		['image', (fam) => fam.image],
		['id', (fam) => toInt(fam)],
		['name', (fam) => fam.name],
		['experience', (fam) => fam.experience],
		['weight', (fam) => familiarWeight(fam)],
		['buffedWeight', (fam) => familiarWeight(fam) + weightAdjustment()],
		['drop', (fam) => fam.dropItem],
		['dropsLimit', (fam) => fam.dropsLimit],
		['dropsToday', (fam) => fam.dropsToday],
		['dropName', (fam) => fam.dropName],
		['owned', (fam) => haveFamiliar(fam)],
		['unrestricted', (fam) => isUnrestricted(fam)],
		['canEquip', (fam) => canEquip(fam)],
		[
			'uniqueEquipment',
			(fam) => {
				const equipment = familiarEquipment(fam)
				if (equipment !== Item.none) {
					return equipment
				}
				return undefined
			},
		],
		['mummeryCharacter', (fam) => getMummeryCharacter(fam)],
	],
	favorites: Object.keys(favoriteFamiliars())
		.map((famName) => Familiar.get(famName))
		.sort((a, b) => toInt(a) - toInt(b)),
	active: [myFamiliar()],
}
// End Familiars

// Begin Skills
export interface BrowserSkill {
	name: string
	image: string
	id: number
	have: boolean
	dailylimit: number
	timescast: number
	advCost: number
	fuelCost: number
	mpCost: number
	hpCost: number
	lightningCost: number
	rainCost: number
	thunderCost: number
	soulsauceCost: number
	unrestricted: boolean
	combat: boolean
}

export declare const skills: BrowserList<BrowserSkill>

export const skillGuidelines: Guidelines<Skill> = {
	name: 'skills',
	all: $skills``,
	fields: [
		['name', (skill) => skill.name],
		['image', (skill) => skill.image],
		['id', (skill) => toInt(skill)],
		['have', (skill) => haveSkill(skill)],
		['dailylimit', (skill) => skill.dailylimit],
		['timescast', (skill) => skill.timescast],
		['advCost', (skill) => advCost(skill)],
		['fuelCost', (skill) => fuelCost(skill)],
		['mpCost', (skill) => mpCost(skill)],
		['hpCost', (skill) => hpCost(skill)],
		['lightningCost', (skill) => lightningCost(skill)],
		['rainCost', (skill) => rainCost(skill)],
		['thunderCost', (skill) => thunderCost(skill)],
		['soulsauceCost', (skill) => soulsauceCost(skill)],
		['unrestricted', (skill) => isUnrestricted(skill)],
		['combat', (skill) => skill.combat],
	],
	active: [],
	favorites: [],
}
// End Skills

// Begin Slots
export interface BrowserSlot {
	name: string
	equipped: BrowserItem
}

export declare const slots: BrowserList<BrowserSlot>

export const slotGuidelines: Guidelines<Slot> = {
	name: 'slots',
	all: $slots``,
	fields: [
		['name', (slot) => slot.toString()],
		['equipped', (slot) => equippedItem(slot)],
	],
	active: [], // TODO: Put relevant slots here
	favorites: $slots`hat, back, shirt, weapon, off-hand, pants, acc1, acc2, acc3`,
}
// End Slots

// Begin Thralls
export interface BrowserThrall {
	type: string
	name: string
	id: number
	level: number
	image: string
	tinyimage: string
	skill: BrowserSkill
}

export declare const thralls: BrowserList<BrowserThrall>

export const thrallGuidelines: Guidelines<Thrall> = {
	name: 'thralls',
	all: $thralls``,
	fields: [
		['type', (thrall) => thrall.toString()],
		['name', (thrall) => thrall.name],
		['id', (thrall) => thrall.id],
		['level', (thrall) => thrall.level],
		['image', (thrall) => thrall.image],
		['tinyimage', (thrall) => thrall.tinyimage],
		['skill', (thrall) => thrall.skill],
	],
	favorites: [],
	active: [myThrall()],
}
// End Thralls

// Begin Classes
export interface BrowserClass {
	name: string
	id: number
	mainstat: string
}

export declare const classes: BrowserList<BrowserClass>

export const classGuidelines: Guidelines<Class> = {
	name: 'classes',
	all: $classes``,
	fields: [
		['name', (cl) => cl.toString()],
		['id', (cl) => toInt(cl)],
		['mainstat', (cl) => cl.primestat.toString()],
	],
	favorites: [],
	active: [myClass()],
}
// End Classes

// Begin Locations
export interface BrowserLocation {
	name: string
	id: number
	zone: string
	canAdv: boolean
}

export declare const locations: BrowserList<BrowserLocation>

export const locationGuidelines: Guidelines<Location> = {
	name: 'locations',
	all: $locations``,
	fields: [
		['name', (loc) => loc.toString()],
		['id', (loc) => loc.id],
		['zone', (loc) => loc.zone],
		['canAdv', (loc) => canAdventure(loc)],
	],
	favorites: [],
	active: [myLocation()],
}
// End Locations
