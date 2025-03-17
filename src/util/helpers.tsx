import {
	availableAmount,
	closetAmount,
	creatableAmount,
	Familiar,
	getRelated,
	Item,
	itemAmount,
	pullsRemaining,
	storageAmount,
	stringModifier,
	toItem,
	weaponHands,
} from 'kolmafia'
import { BorderType } from '../browser/components/Icons/ChitterIcon'
import { $item, CrownOfThrones } from 'libram'
import { evaluatedModifiers, parseMods, pluralize } from '.'
import itemList from './resources/itemList'
import { FamiliarVerb } from '../browser/components/Icons/FamIcon'
import { Text } from '@chakra-ui/react'
import famList from './resources/famList'

// ITEMS

type EquipVerb =
	| 'equip'
	| 'uncloset'
	| 'fold'
	| 'create'
	| 'pull'
	| 'somehow equip'

export function foldableAmount(item: Item) {
	return Object.keys(getRelated(item, 'fold'))
		.filter((foldableName) => foldableName !== item.identifierString)
		.map((foldableName) => toItem(foldableName))
		.reduce((partial, foldable) => partial + availableAmount(foldable), 0)
}

export interface ItemInfo {
	item?: Item
	displayName: string
	desc: React.ReactNode[]
	mods: string
	extraOptions: React.ReactNode[]
	image: string
	extraClass?: string
	borderType: BorderType
	equipVerb: EquipVerb
	currencyLink?: { href: string; desc: string }
}

interface GetItemInfoOptionalArgs {
	namePrefix?: string
	iconOverride?: string
	forEquipping?: boolean
}

export type ItemInfoModifier = (itemInfo: ItemInfo) => void

export function getItemInfo(
	item?: Item,
	optionals: GetItemInfoOptionalArgs = {},
): ItemInfo {
	const isSomething = item && item !== $item.none
	const name = isSomething ? item.name : 'empty'
	const mods = isSomething ? evaluatedModifiers(item) : ''
	const res: ItemInfo = {
		item,
		displayName: optionals.namePrefix ? `${optionals.namePrefix}${name}` : name,
		desc: [],
		mods,
		extraOptions: [],
		image: optionals.iconOverride || (isSomething ? item.image : 'blank.gif'),
		borderType: 'normal',
		equipVerb: 'equip',
	}

	if (!isSomething) {
		return res
	}

	const hands = weaponHands(item)
	if (hands > 1) {
		res.displayName = `${res.displayName} (${hands}h)`
	}

	const itemInfoModifierEntry = itemList.find(
		(value) => value[0] === item.identifierString,
	)

	if (itemInfoModifierEntry) {
		itemInfoModifierEntry[1](res)
	}

	const inv = itemAmount(item)
	if (inv === 0 && optionals.forEquipping) {
		const clos = closetAmount(item)
		const fold = foldableAmount(item)
		const stor = storageAmount(item)
		const pulls = pullsRemaining()
		const make = creatableAmount(item)
		if (clos > 0) {
			res.equipVerb = 'uncloset'
		} else if (fold > 0) {
			res.equipVerb = 'fold'
		} else if (stor > 0 && pulls === -1) {
			res.equipVerb = 'pull'
		} else if (make > 0) {
			res.equipVerb = 'create'
			res.borderType = 'warning'
		} else if (stor > 0 && pulls > 0) {
			res.equipVerb = 'pull'
			res.borderType = 'danger'
		} else {
			res.equipVerb = 'somehow equip'
		}
	}

	res.mods = parseMods(res.mods)

	return res
}

// FAMILIARS

export function nextLevelInfo(fam: Familiar) {
	for (let i = 2; i <= 20; ++i) {
		const nextGoal = i * i
		if (nextGoal > fam.experience) {
			const prevGoal = i === 2 ? 0 : (i - 1) * (i - 1)
			return { progress: fam.experience - prevGoal, goal: nextGoal - prevGoal }
		}
	}
	return { progress: 1, goal: 1 }
}

interface DropInfo {
	drop: Item | string
	dropped?: number
	limit?: number
}

interface FamInfo {
	fam: Familiar
	desc: React.ReactNode[]
	extraClass?: string
	borderType: BorderType
	dropInfo?: DropInfo
	weirdoDiv?: React.ReactNode
}

export type FamInfoModifier = (famInfo: FamInfo, isTooltip: boolean) => void

export function getFamInfo(
	fam: Familiar,
	isTooltip: boolean,
	type: FamiliarVerb,
): FamInfo {
	const res: FamInfo = { fam, borderType: 'normal', desc: [] }

	if (type === 'familiar') {
		const famInfoModifierEntry = famList.find(
			(value) => value[0] === fam.identifierString,
		)

		if (famInfoModifierEntry) {
			famInfoModifierEntry[1](res, isTooltip)
		}
	}

	const dropsLeft = fam.dropsLimit - fam.dropsToday
	let hasDrops = type === 'familiar' && dropsLeft > 0
	const allDrops = hasDrops && fam.dropsToday === 0
	const drop =
		fam.dropItem.identifierString !== 'none' ? fam.dropItem : fam.dropName
	const dropName = pluralize(drop, 1)

	if (dropName) {
		if (hasDrops) {
			res.dropInfo = { drop, dropped: fam.dropsToday, limit: fam.dropsLimit }
			res.desc.unshift(
				<Text>
					{fam.dropsToday} / {fam.dropsLimit} {dropName}
				</Text>,
			)
		} else if (type === 'familiar') {
			res.dropInfo = { drop }
			res.desc.unshift(<Text>drops {dropName}</Text>)
		}
	}

	if (type !== 'familiar') {
		const modifiers = stringModifier(
			`Throne:${fam.identifierString}`,
			'Evaluated Modifiers',
		)
		const parsedModifiers = parseMods(modifiers)
		res.desc.push(
			<Text dangerouslySetInnerHTML={{ __html: parsedModifiers }} />,
		)
		const riderInfo = CrownOfThrones.ridingFamiliars.find(
			(value) => value.familiar === fam,
		)
		if (riderInfo && (!riderInfo.dropPredicate || riderInfo.dropPredicate())) {
			let dropText
			if (typeof riderInfo.drops === 'number') {
				if (riderInfo.drops !== 0) {
					dropText = `${riderInfo.drops} meat`
				}
			} else if (Array.isArray(riderInfo.drops)) {
				dropText = riderInfo.drops.map((it) => it.identifierString).join(', ')
			} else {
				const dropList: string[] = []
				riderInfo.drops.forEach((chance, it) =>
					dropList.push(`${it.identifierString} (${chance * 100}%)`),
				)
				dropText = dropList.join(', ')
			}
			const forNow = riderInfo.dropPredicate ? ' for now' : ''
			if (forNow !== '') {
				hasDrops = true
			}
			res.desc.push(
				<Text>
					drops {dropText}
					{forNow}
				</Text>,
			)
			if (dropText) {
				res.dropInfo = { drop: dropText }
			}
		}
	}

	if (allDrops) {
		res.borderType = 'all-drops'
	} else if (hasDrops) {
		res.borderType = 'has-drops'
	}

	return res
}
