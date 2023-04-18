import {
	canEquip,
	classModifier,
	closetAmount,
	creatableAmount,
	fileToBuffer,
	getProperty,
	hippyStoneBroken,
	inebrietyLimit,
	isUnrestricted,
	Item,
	itemAmount,
	myClass,
	myInebriety,
	myPath,
	myPrimestat,
	numericModifier,
	Path,
	print,
	propertyExists,
	Slot,
	Stat,
	StatType,
	storageAmount,
	toSlot,
	weaponHands,
} from 'kolmafia'
import { $class, $items, $skill, $slot, $slots, get, have } from 'libram'
import {
	booleanProperties,
	familiarProperties,
	numericOrStringProperties,
	numericProperties,
	stringProperties,
} from 'libram/dist/propertyTypes'
import { FieldValue, fieldValueToJSString } from './fieldValue'
import { BrowserItem, foldableAmount } from './guidelines'

type ChitPropertyInfo = [string, FieldValue]

const chitProperties: ChitPropertyInfo[] = [
	['autoscroll', true],
	[
		'currencies',
		$items`disassembled clover, rad, hobo nickel, Freddy Kruegerand, Chroner, Beach Buck, Coinspiracy, FunFunds™, Volcoino, Wal-Mart gift certificate, BACON, buffalo dime, Source essence, cop dollar, sprinkles, Spacegate Research, Rubee™`,
	],
	['currencies.special', ['asdonmartinfuel']],
	['currencies.show', ['meat']],
	['character.avatar', true],
	['character.title', true],
	['clan.display', 'away'], // Valid values are on,off,away. Away will only display clan if chit.clan.home is not blank.
	['clan.home', ''],
	['disable', false],
	['familiar.anti-gollywog', true],
	['familiar.hiddengear', $items`none`],
	['familiar.protect', false],
	['familiar.showlock', false],
	[
		'familiar.hats',
		$items`spangly sombrero, sugar chapeau, chef's hat, party hat`,
	],
	[
		'familiar.pants',
		$items`spangly mariachi pants, double-ice britches, BRICKO pants, pin-stripe slacks, studded leather boxer shorts, monster pants, sugar shorts`,
	],
	[
		'familiar.weapons',
		$items`time sword, Hodgman's whackin' stick, astral mace, goatskin umbrella, dreadful glove, Stick-Knife of Loathing, Work is a Four Letter Sword`,
	],
	[
		'familiar.off-hands',
		$items`Kramco Sausage-o-Matic™, latte lovers member's mug, A Light that Never Goes Out, Half a Purse`,
	],
	['familiar.iconize-weirdos', false],
	['effects.classicons', 'none'],
	['effects.describe', true],
	['effects.modicons', true],
	['effects.showicons', true],
	['effects.usermap', false],
	[
		'gear.display.in-run',
		[
			'favorites:pull=true:create=true',
			'astral',
			'item',
			'-combat',
			'+combat',
			'quest:pull=true:create=true',
			'today',
			'ML:amount=2',
			'path',
			'prismatic res',
			'resistance:amount=2',
			'charter',
			'rollover',
			'DRUNK',
			'Wow',
			'exp',
		],
	],
	[
		'gear.display.in-run.defaults',
		['create=false', 'pull=false', 'amount=all'],
	],
	[
		'gear.display.aftercore',
		[
			'favorites:amount=all',
			'quest:amount=all',
			'charter:amount=all',
			'today:amount=all:create=false',
			'rollover',
			'DRUNK:amount=all',
		],
	],
	['gear.display.aftercore.defaults', ['create=true', 'pull=true', 'amount=1']],
	['gear.layout', 'default'],
	// 'gear.favorites' is handled by items.favorites in guidelines.ts
	//['gear.favorites', $items`none`],
	['gear.ignoreG-Lover', false],
	['gear.lattereminder', true],
	['helpers.dancecard', true],
	['helpers.semirare', true],
	['helpers.spookyraven', true],
	['helpers.wormwood', ['stats', 'spleen']],
	['helpers.xiblaxian', true],
	['kol.coolimages', true],
	['effects.layout', 'songs,buffs,intrinsics'],
	['floor.layout', 'update,familiar'],
	['roof.layout', 'character,stats,gear'],
	['stats.layout', 'muscle,myst,moxie|hp,mp,axel|mcd|drip|trail,florist'],
	['toolbar.layout', 'trail,quests,modifiers,elements,organs'],
	['walls.layout', 'helpers,thrall,robo,vykea,effects,horsery,boombox'],
	['quests.hide', false],
	['stats.showbars', true],
	['thrall.showname', false],
	['toolbar.moods', 'true'], // do not change to boolean, 'bonus' is also valid
]

const interpretPropVal = (propStr: string, defaultValue: FieldValue) => {
	if (propStr.startsWith('DEFAULT')) {
		if (Array.isArray(defaultValue) && defaultValue[0]?.toString() === 'none') {
			return []
		}
		return defaultValue
	}
	if (Array.isArray(defaultValue)) {
		if (defaultValue[0] instanceof Item) {
			return propStr.split('|').map((itemName) => Item.get(itemName))
		}
		if (typeof defaultValue[0] === 'string') {
			return propStr.split(/, ?/)
		}
		// probably shouldn't ever get here?
		return []
	}
	switch (typeof defaultValue) {
		case 'string':
			return propStr
		case 'boolean':
			return propStr === 'true'
		case 'number':
			return Number(propStr)
		// this shouldn't happen
		default:
			return null
	}
}

export const getPropVal = (propName: string) => {
	const propInfo = chitProperties.find((prop) => prop[0] === propName)
	if (propInfo) {
		const strVal = getProperty(`chit.${propName}`)
		const propDefault = propInfo[1]
		return interpretPropVal(strVal, propDefault)
	}
	return undefined
}

type BrowserChitProperty = string | string[] | boolean | BrowserItem[]

export interface BrowserChitProperties {
	[key: string]: BrowserChitProperty
}

export interface BrowserMafiaProperties {
	[key: string]: FieldValue
}

export const buildProperties = () => {
	const res = ['\t\t\tvar chitProperties = {\n']
	res.push(
		...chitProperties.map((propInfo) => {
			const propName = `chit.${propInfo[0]}`
			if (propertyExists(propName)) {
				const propStr = getProperty(propName)
				const propVal = interpretPropVal(propStr, propInfo[1])
				return `\t\t\t\t"${propInfo[0]}": ${fieldValueToJSString(propVal)},\n`
			}
			return ''
		})
	)
	res.push('\t\t\t}\n\n\t\t\tvar mafiaProperties = {\n')
	function addProps<T>(propList: T) {
		res.push(
			...(propList as string[]).map(
				(propName) =>
					`\t\t\t\t"${propName}": ${fieldValueToJSString(get(propName))},\n`
			)
		)
	}
	// Missing, will require implementation of underlying type:
	// monsterProperties, locationProperties, phylumProperties,
	// statProperties
	addProps(booleanProperties)
	addProps(numericProperties)
	addProps(stringProperties)
	addProps(numericOrStringProperties)
	addProps(familiarProperties)
	res.push('\t\t\t}\n')
	return res.join('')
}

interface GearMainstatCondition {
	type: 'mainstat'
	value: StatType
	inverted?: boolean
}

interface GearOverdrunkCondition {
	type: 'overdrunk'
	value: boolean
}

type ComparisonStr = '>' | '>=' | '<' | '<=' | '!'

interface GearQuestCondition {
	type: 'quest'
	pref: string
	value: string
	comparison?: ComparisonStr
	inverted?: boolean
}

interface GearPvPCondition {
	type: 'pvp'
	value: boolean
}

interface GearPathCondition {
	type: 'path'
	value: string
}

interface GearBountyCondition {
	type: 'bounty'
	value: string
}

type GearCondition =
	| GearMainstatCondition
	| GearOverdrunkCondition
	| GearQuestCondition
	| GearPvPCondition
	| GearPathCondition
	| GearBountyCondition

interface GearConditions {
	list: GearCondition[]
	any?: boolean
}

interface GearMod {
	mod: string
	multiplier?: number
	conditions?: GearConditions
}

interface ManualGearItemObject {
	name: string
	weight: number
}

type ManualGearItem = ManualGearItemObject | string

interface ManualGearEntrySingular {
	item: ManualGearItem
	conditions?: GearConditions
}

interface ManualGearEntryPlural {
	items: ManualGearItem[]
	conditions?: GearConditions
}

type ManualGearEntry = ManualGearEntrySingular | ManualGearEntryPlural

interface GearCategory {
	name: string
	mods?: GearMod[]
	manual?: ManualGearEntry[]
	conditions?: GearConditions
}

const evaluateGearCondition = (cond: GearCondition) => {
	switch (cond.type) {
		case 'quest': {
			const prefVal = get(cond.pref)
			if (cond.comparison) {
				const questStepNum = (stepStr: string) =>
					stepStr === 'finished'
						? 999
						: stepStr === 'started'
						? 0
						: stepStr.startsWith('step')
						? Number(stepStr.substring(5))
						: -1
				const compStepNum = questStepNum(cond.value)
				const realStepNum = questStepNum(prefVal)
				return cond.comparison === '>'
					? realStepNum > compStepNum
					: cond.comparison === '>='
					? realStepNum >= compStepNum
					: cond.comparison === '<'
					? realStepNum < compStepNum
					: cond.comparison === '<='
					? realStepNum <= compStepNum
					: cond.comparison === '!'
					? realStepNum !== compStepNum
					: false
			}
			return prefVal === cond.value
		}
		case 'mainstat':
			return (myPrimestat() === Stat.get(cond.value)) === !cond.inverted
		case 'overdrunk':
			return myInebriety() > inebrietyLimit() === cond.value
		case 'pvp':
			return hippyStoneBroken() === cond.value
		case 'path':
			return myPath() === Path.get(cond.value)
		case 'bounty':
			return [
				get('currentEasyBountyItem'),
				get('currentHardBountyItem'),
				get('currentSpecialBountyItem'),
			].some((bountyItemName) => cond.value === bountyItemName)
	}
}

const evaluateGearConditions = (
	conds: GearConditions | undefined,
	catName: string
) => {
	if (!conds) {
		return true
	}
	if (!conds.list) {
		print(`Malformed gear conditions in category ${catName}`)
	}
	if (conds.any) {
		return conds.list.some((cond) => evaluateGearCondition(cond))
	}
	return conds.list.every((cond) => evaluateGearCondition(cond))
}

export type BrowserGearCategorySlot =
	| 'hat'
	| 'back'
	| 'shirt'
	| 'weapon'
	| 'off-hand'
	| 'pants'
	| 'acc1'
	| 'familiar'

interface BrowserGearCategoryItems {
	hat: BrowserItem[]
	back: BrowserItem[]
	shirt: BrowserItem[]
	weapon: BrowserItem[]
	['off-hand']: BrowserItem[]
	pants: BrowserItem[]
	acc1: BrowserItem[]
	familiar: BrowserItem[]
}

export interface BrowserGearCategory {
	name: string
	items: BrowserGearCategoryItems
}

export const buildGearCategories = () => {
	const gearCategories = JSON.parse(
		fileToBuffer('chitter_gear_categories.json')
	) as GearCategory[]

	const filteredItems = $items``.filter(
		(it) =>
			canEquip(it) &&
			isUnrestricted(it) &&
			itemAmount(it) +
				closetAmount(it) +
				storageAmount(it) +
				foldableAmount(it) +
				creatableAmount(it) >
				0 &&
			[$class`none`, myClass()].some((cl) => cl === classModifier(it, 'Class'))
	)

	const categories = new Map<string, Map<Slot, Item[]>>()
	const categoryOrder: string[] = []

	gearCategories.forEach((category) => {
		if (!evaluateGearConditions(category.conditions, category.name)) {
			return
		}
		// item id # -> score
		const scores = new Map<Item, number>()
		if (category.mods) {
			category.mods.forEach((mod) => {
				if (!evaluateGearConditions(mod.conditions, category.name)) {
					return
				}
				const multi = mod.multiplier ?? 1
				filteredItems.forEach((it) => {
					const score =
						(multi * numericModifier(it, mod.mod)) /
						(weaponHands(it) > 1 ? 2 : 1)
					scores.set(it, (scores.get(it) ?? 0) + score)
				})
			})
		}
		if (category.manual) {
			const handleManualItem = (it: ManualGearItem) => {
				if (typeof it === 'string') {
					scores.set(Item.get(it), (scores.get(Item.get(it)) ?? 0) + 1)
				} else {
					scores.set(
						Item.get(it.name),
						(scores.get(Item.get(it.name)) ?? 0) + it.weight
					)
				}
			}
			category.manual.forEach((man) => {
				if (!evaluateGearConditions(man.conditions, category.name)) {
					return
				}
				if ('item' in man) {
					handleManualItem(man.item)
				} else if ('items' in man) {
					man.items.forEach(handleManualItem)
				}
			})
		}
		$slots`hat, back, shirt, weapon, off-hand, pants, acc1, familiar`.forEach(
			(slot) => {
				const best = filteredItems
					.filter(
						(it) =>
							(toSlot(it) === slot ||
								(slot === $slot`off-hand` &&
									toSlot(it) === $slot`weapon` &&
									have($skill`Double-Fisted Skull Smashing`) &&
									weaponHands(it) === 1)) &&
							(scores.get(it) ?? 0) > 0
					)
					.sort((it1, it2) => (scores.get(it2) ?? 0) - (scores.get(it1) ?? 0))
				const sliced = best.slice(0, Math.min(8, best.length))
				if (slot === $slot`hat`) {
					const newMap = new Map<Slot, Item[]>()
					newMap.set(slot, sliced)
					categories.set(category.name, newMap)
				} else {
					;(categories.get(category.name) as Map<Slot, Item[]>).set(
						slot,
						sliced
					)
				}
			}
		)
		categoryOrder.push(category.name)
	})

	const res = ['\t\t\tvar gearCategories = [\n']
	res.push(
		...categoryOrder.map((catName) => {
			const res = [
				`\t\t\t\t{\n\t\t\t\t\tname: "${catName}",\n\t\t\t\t\titems: {\n`,
			]
			$slots`hat, back, shirt, weapon, off-hand, pants, acc1, familiar`.forEach(
				(slot) => {
					res.push(`\t\t\t\t\t\t["${slot.toString()}"]: [`)
					res.push(
						((categories.get(catName) as Map<Slot, Item[]>).get(slot) as Item[])
							.map((it) => fieldValueToJSString(it))
							.join(', ')
					)
					res.push('],\n')
				}
			)
			res.push('\t\t\t\t\t}\n\t\t\t\t},\n')
			return res.join('')
		})
	)
	res.push('\t\t\t]\n')
	return res.join('')
}
