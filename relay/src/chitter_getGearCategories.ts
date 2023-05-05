import {$class, $items, $skill, $slot, $slots, get, have} from "libram"
import {canEquip, classModifier, closetAmount, creatableAmount, fileToBuffer, hippyStoneBroken, inebrietyLimit, isUnrestricted, Item, itemAmount, myClass, myInebriety, myPath, myPrimestat, numericModifier, Path, print, Slot, Stat, storageAmount, toSlot, weaponHands} from "kolmafia"
import {foldableAmount} from "./guidelines"
import {fieldValueToJSString} from "./fieldValue"

type StatType = 'Muscle' | 'Mysticality' | 'Moxie'

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

export type GearCategorySlot =
	| 'hat'
	| 'back'
	| 'shirt'
	| 'weapon'
	| 'off-hand'
	| 'pants'
	| 'acc1'
	| 'familiar'

interface GearCategoryItems {
	hat: Item[]
	back: Item[]
	shirt: Item[]
	weapon: Item[]
	['off-hand']: Item[]
	pants: Item[]
	acc1: Item[]
	familiar: Item[]
}

export interface ResultGearCategory {
	name: string
	items: GearCategoryItems
}

export const buildGearCategories = () => {
	if (Math.random() < 2) {
		return '\t\t\tvar gearCategories = []\n'
	}

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
