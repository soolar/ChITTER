import {
	availableAmount,
	cliExecute,
	closetAmount,
	creatableAmount,
	Effect,
	Familiar,
	getRelated,
	haveEffect,
	hpCost,
	isRemovable,
	isShruggable,
	Item,
	itemAmount,
	lightningCost,
	mpCost,
	myHp,
	myLightning,
	myMp,
	myRain,
	mySoulsauce,
	myThunder,
	pullsRemaining,
	rainCost,
	Skill,
	soulsauceCost,
	storageAmount,
	stringModifier,
	thunderCost,
	toItem,
	weaponHands,
} from 'kolmafia'
import { BorderType } from '../browser/components/Icons/ChitterIcon'
import { $item, clamp, CrownOfThrones, get, have } from 'libram'
import { evaluatedModifiers, parseMods } from '.'
import itemList from './resources/itemList'
import { FamiliarVerb } from '../browser/components/Icons/FamIcon'
import { Text, Tooltip } from '@chakra-ui/react'
import famList from './resources/famList'
import skillList from './resources/skillList'
import effectList from './resources/effectList'
import ActionLink from '../browser/components/Link/ActionLink'

interface DropInfo {
	drop: Item | string
	dropped?: number
	limit?: number
	important?: boolean
}

function dropName(dropInfo: DropInfo) {
	if (typeof dropInfo.drop === 'string') {
		return dropInfo.drop
	}
	const info = getItemInfo(dropInfo.drop)
	return info.displayName
}

interface GeneralInfo<T> {
	thing: T
	displayName: string | React.ReactNode
	image: string
	desc: React.ReactNode[]
	extraOptions: React.ReactNode[]
	borderType: BorderType
	dropsInfo: DropInfo[]
	invalid?: boolean
}

const borderOrder: BorderType[] = [
	'danger',
	'warning',
	'good',
	'none',
	'all-drops',
	'has-drops',
	'normal',
]

function higherPriBorder(lhs: BorderType, rhs: BorderType): BorderType {
	return (
		borderOrder.find(
			(borderType) => lhs === borderType || rhs === borderType,
		) ?? 'normal'
	)
}

function addDropsToDesc<T>(info: GeneralInfo<T>) {
	const importantDrops = info.dropsInfo.filter(
		(dropInfo) =>
			dropInfo.important &&
			(dropInfo.limit === undefined ||
				dropInfo.limit < 0 ||
				(dropInfo.dropped !== undefined && dropInfo.limit > dropInfo.dropped)),
	)
	importantDrops
		.map((dropInfo) => {
			const res: BorderType =
				dropInfo.dropped !== undefined && dropInfo.dropped === 0
					? 'all-drops'
					: 'has-drops'
			return res
		})
		.forEach(
			(borderType) =>
				(info.borderType = higherPriBorder(info.borderType, borderType)),
		)

	const finiteDropPred = (dropInfo: DropInfo) =>
		dropInfo.dropped !== undefined &&
		dropInfo.limit !== undefined &&
		dropInfo.limit > 0
	const finiteDrops = info.dropsInfo.filter(finiteDropPred)
	const infiniteDrops = info.dropsInfo.filter(
		(dropInfo) =>
			dropInfo.dropped === undefined && dropInfo.limit === undefined,
	)
	const mysteriouslyFiniteDrops = info.dropsInfo.filter(
		(dropInfo) => dropInfo.limit !== undefined && dropInfo.limit < 0,
	)
	const finiteDropsJoined = finiteDrops
		.map(
			(dropInfo) =>
				`${(dropInfo.limit as number) - (dropInfo.dropped as number)}/${dropInfo.limit} ${dropName(dropInfo)}`,
		)
		.join(', ')
	const infiniteDropsJoined = infiniteDrops.map(dropName).join(', ')
	const mysteriouslyFiniteDropsJoined = mysteriouslyFiniteDrops
		.map(dropName)
		.join(', ')
	const dropsTextToJoin = [
		...(finiteDropsJoined !== '' ? [`${finiteDropsJoined} left`] : []),
		...(infiniteDropsJoined !== '' ? [`drops ${infiniteDropsJoined}`] : []),
		...(mysteriouslyFiniteDropsJoined !== ''
			? [`drops ${mysteriouslyFiniteDropsJoined} for now`]
			: []),
	]
	if (dropsTextToJoin.length > 0) {
		info.desc.unshift(<Text>{dropsTextToJoin.join(', ')}</Text>)
	}
}

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

export interface ItemInfo extends GeneralInfo<Item> {
	mods: string
	extraClass?: string
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
	item: Item,
	optionals: GetItemInfoOptionalArgs = {},
): ItemInfo {
	const isSomething = item !== $item.none
	// TODO: Figure out why identifierString is right, but name just gives undefined
	const name = isSomething ? item.identifierString : 'empty'
	const mods = isSomething ? evaluatedModifiers(item) : ''
	const res: ItemInfo = {
		thing: item,
		displayName: optionals.namePrefix ? `${optionals.namePrefix}${name}` : name,
		desc: [],
		mods,
		extraOptions: [],
		image: optionals.iconOverride || (isSomething ? item.image : 'blank.gif'),
		borderType: 'normal',
		equipVerb: 'equip',
		dropsInfo: [],
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

	addDropsToDesc(res)

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

interface FamInfo extends GeneralInfo<Familiar> {
	extraClass?: string
	weirdoDiv?: React.ReactNode
}

export type FamInfoModifier = (famInfo: FamInfo, isTooltip: boolean) => void

export function getFamInfo(
	fam: Familiar,
	isTooltip: boolean,
	type: FamiliarVerb,
): FamInfo {
	const res: FamInfo = {
		thing: fam,
		displayName: fam.identifierString,
		borderType: 'normal',
		desc: [],
		extraOptions: [],
		image: fam.image,
		dropsInfo: [],
	}

	if (type === 'familiar') {
		const dropsLeft = fam.dropsLimit - fam.dropsToday
		const hasDrops = dropsLeft > 0
		const allDrops = hasDrops && fam.dropsToday === 0
		const drop =
			fam.dropItem.identifierString !== 'none' ? fam.dropItem : fam.dropName

		if (allDrops) {
			res.borderType = 'all-drops'
		} else if (hasDrops) {
			res.borderType = 'has-drops'
		}

		if (drop !== '' && drop !== $item.none) {
			if (fam.dropsLimit > 0) {
				res.dropsInfo.push({
					drop,
					dropped: fam.dropsToday,
					limit: fam.dropsLimit,
				})
			} else {
				res.dropsInfo.push({ drop })
			}
		}

		const famInfoModifierEntry = famList.find(
			(value) => value[0] === fam.identifierString,
		)

		if (famInfoModifierEntry) {
			famInfoModifierEntry[1](res, isTooltip)
		}
	} else {
		// carried
		const modifiers = stringModifier(
			`Throne:${fam.identifierString}`,
			'Evaluated Modifiers',
		)

		// uncarriable
		if (modifiers === 'none') {
			res.invalid = true
			return res
		}

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
			if (dropText) {
				res.dropsInfo.push({
					drop: dropText,
					limit: riderInfo.dropPredicate ? -1 : undefined,
				})
			}
		}
	}

	addDropsToDesc(res)

	return res
}

// SKILLS

export interface SkillInfo extends GeneralInfo<Skill> {
	append?: string
	usable: boolean
}

export type SkillInfoModifier = (skillInfo: SkillInfo) => void

function unusableReason(
	skillInfo: SkillInfo,
	unusable: boolean,
	reason: string,
) {
	if (unusable) {
		skillInfo.usable = false
		skillInfo.desc.push(<Text>{reason}</Text>)
		return true
	}
	return false
}

export function unusableResource(
	skillInfo: SkillInfo,
	current: number,
	cost: number,
	name: string,
) {
	if (
		!unusableReason(
			skillInfo,
			current < cost,
			`Costs ${cost.toLocaleString()} / ${current.toLocaleString()} ${name} (not enough!)`,
		) &&
		cost > 0
	) {
		skillInfo.desc.push(
			<Text>
				Costs {cost.toLocaleString()} / {current.toLocaleString()} {name}
			</Text>,
		)
	}
}

export function getSkillInfo(skill: Skill): SkillInfo {
	const res: SkillInfo = {
		thing: skill,
		displayName: skill.name,
		image: skill.image,
		borderType: 'normal',
		desc: [],
		extraOptions: [],
		usable: true,
		dropsInfo: [],
	}

	unusableReason(res, skill.combat, 'Combat only')
	unusableResource(res, myMp(), mpCost(skill), 'MP')
	unusableResource(res, myHp(), hpCost(skill), 'HP')
	unusableResource(res, mySoulsauce(), soulsauceCost(skill), 'soulsauce')
	unusableResource(res, myLightning(), lightningCost(skill), 'lightning')
	unusableResource(res, myThunder(), thunderCost(skill), 'thunder')
	unusableResource(res, myRain(), rainCost(skill), 'rain')

	const skillInfoModifierEntry = skillList.find(
		(value) => value[0] === skill.identifierString,
	)

	if (skillInfoModifierEntry) {
		skillInfoModifierEntry[1](res)
	}

	addDropsToDesc(res)

	return res
}

/// EFFECTS

export interface EffectInfo extends GeneralInfo<Effect> {
	mods: string
	launches?: React.ComponentType<Record<string, never>>
	displayTurns: number | string | React.ReactNode
}

interface EffectInfoModifierOptionalReturn {
	cleanser?: string
	skipParse?: boolean
	skipCleanse?: boolean
}

export type EffectInfoModifier = (
	effectInfo: EffectInfo,
) => EffectInfoModifierOptionalReturn | void

export function getEffectInfo(eff: Effect): EffectInfo {
	const turnsLeft = haveEffect(eff)
	const res: EffectInfo = {
		thing: eff,
		image: eff.image,
		desc: [],
		extraOptions: [],
		borderType: 'normal',
		mods: stringModifier(eff, 'Evaluated Modifiers'),
		displayName: eff.name,
		displayTurns: turnsLeft === 2147483647 ? <>&infin;</> : turnsLeft,
		dropsInfo: [],
	}

	const effectInfoModifierEntry = effectList.find(
		(value) => value[0] === eff.identifierString,
	)

	const effModRet = effectInfoModifierEntry
		? effectInfoModifierEntry[1](res)
		: undefined

	addDropsToDesc(res)

	const doParse = effModRet ? !effModRet.skipParse : true
	const doCleanse = effModRet ? !effModRet.skipCleanse : true
	const cleanser = effModRet ? (effModRet.cleanser ?? '') : ''

	if (doParse) {
		res.mods = parseMods(res.mods)
	}

	if (doCleanse) {
		const shruggable = isShruggable(eff)
		const sgeeas = itemAmount($item`soft green echo eyedrop antidote`)
		const hotTubs = have($item`Clan VIP Lounge key`)
			? 5 - clamp(get('_hotTubSoaks'), 0, 5)
			: 0
		const removable =
			isRemovable(eff) && (sgeeas > 0 || (eff.quality === 'bad' && hotTubs > 0))
		if (shruggable || removable || cleanser !== '') {
			res.displayTurns = (
				<ActionLink callback={() => cliExecute(`uneffect ${eff.name}`)} dirty>
					<Tooltip
						label={
							shruggable ? (
								<Text>Shrug {eff.name}</Text>
							) : (
								<Text>
									Use{' '}
									{cleanser !== ''
										? cleanser
										: eff.quality === 'bad' && hotTubs > 0
											? `1 of your ${hotTubs} hot tub soaks`
											: `1 of your ${sgeeas} SGEEAs`}{' '}
									to remove {eff.name}
								</Text>
							)
						}
					>
						<Text>{res.displayTurns}</Text>
					</Tooltip>
				</ActionLink>
			)
		}
	}

	return res
}
