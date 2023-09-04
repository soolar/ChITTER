import * as React from 'react'
import { Text } from '@chakra-ui/react'
import SweatpantsPicker from './components/Picker/SweatpantsPicker'
import { BorderType } from './components/Icons/ChitterIcon'
import PickerOption from './components/Option/PickerOption'
import ItemIcon from './components/Icons/ItemIcon'
import { parseMods } from './utils'
import EffectListPseudoPicker from './components/Picker/EffectListPseudoPicker'
import LinkOption from './components/Option/LinkOption'
import FamiliarPicker from './components/Picker/FamiliarPicker'
import { useExtraFamInfo } from './familiarHelpers'
import GAPPicker from './components/Picker/GAPPicker'
import {
	availableAmount,
	canEquip,
	classModifier,
	closetAmount,
	creatableAmount,
	Effect,
	equippedItem,
	fileToBuffer,
	getRelated,
	haveEffect,
	hippyStoneBroken,
	inebrietyLimit,
	isUnrestricted,
	Item,
	itemAmount,
	myBjornedFamiliar,
	myClass,
	myEnthronedFamiliar,
	myInebriety,
	myPath,
	myPrimestat,
	numericModifier,
	Path,
	pullsRemaining,
	Slot,
	Stat,
	storageAmount,
	stringModifier,
	toEffect,
	toInt,
	toItem,
	toSlot,
	toString,
	weaponHands,
} from 'kolmafia'
import {
	$class,
	$effects,
	$familiar,
	$item,
	$items,
	$skill,
	$slot,
	$slots,
	get,
	have,
} from 'libram'
import {
	DescTextNonTooltip,
	DescTextTooltip,
} from './components/Layout/DescText'

function isGoodForSlot(item: Item, slot: Slot) {
	const itemSlot = toSlot(item)
	return (
		itemSlot === slot ||
		(slot === $slot`off-hand` &&
			itemSlot === $slot`weapon` &&
			have($skill`Double-Fisted Skull Smashing`) &&
			weaponHands(item) === 1)
	)
}

function getFoldableAmount(item: Item) {
	const name = toString(item as unknown as string)
	const foldableAltNames = Object.keys(getRelated(item, 'fold'))
	const foldableAlts = foldableAltNames
		? foldableAltNames
				.filter((foldableName) => foldableName !== name)
				.map((foldableName) => toItem(foldableName))
		: []
	const foldableAltAmounts = foldableAlts.map((foldable) =>
		availableAmount(foldable),
	)
	return foldableAltAmounts.reduce((acc, amt) => acc + amt, 0)
}

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
	mods: GearMod[]
	manual?: ManualGearEntry[]
	conditions?: GearConditions
}

function evaluateGearCondition(cond: GearCondition) {
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

function evaluateGearConditions(
	conds: GearConditions | undefined,
	catName: string,
) {
	if (!conds) {
		return true
	}
	if (!conds.list) {
		console.log(`Malformed gear conditions in category ${catName}`)
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

export function getGearRecommendations(slot: Slot) {
	const bufferRead = fileToBuffer('chitter_gear_categories.json')
	const gearCategories = (
		bufferRead === '' ? [] : JSON.parse(bufferRead)
	) as GearCategory[]

	const filteredItems = $items``.filter(
		(it) =>
			canEquip(it) &&
			isUnrestricted(it) &&
			isGoodForSlot(it, slot) &&
			itemAmount(it) +
				closetAmount(it) +
				storageAmount(it) +
				getFoldableAmount(it) +
				creatableAmount(it) >
				0 &&
			[$class`none`, myClass()].some((cl) => cl === classModifier(it, 'Class')),
	)

	const categories = new Map<string, Item[]>()
	const categoryOrder: string[] = []

	gearCategories.forEach((category) => {
		if (!evaluateGearConditions(category.conditions, category.name)) {
			return
		}
		// item id # -> score
		const scores = new Map<number, number>()
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
					scores.set(toInt(it), (scores.get(toInt(it)) ?? 0) + score)
				})
			})
		}
		if (category.manual) {
			const handleManualItem = (it: ManualGearItem) => {
				if (typeof it === 'string') {
					scores.set(
						toInt(Item.get(it)),
						(scores.get(toInt(Item.get(it))) ?? 0) + 1,
					)
				} else {
					scores.set(
						toInt(Item.get(it.name)),
						(scores.get(toInt(Item.get(it.name))) ?? 0) + it.weight,
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
		const best = filteredItems
			.filter((it) => (scores.get(toInt(it)) ?? 0) > 0)
			.sort(
				(it1, it2) =>
					(scores.get(toInt(it2)) ?? 0) - (scores.get(toInt(it1)) ?? 0),
			)
		const sliced = best.slice(0, Math.min(8, best.length))
		categories.set(category.name, sliced)
		categoryOrder.push(category.name)
	})

	return { categories, categoryOrder }
}

type EquipVerb =
	| 'equip'
	| 'uncloset'
	| 'fold'
	| 'create'
	| 'pull'
	| 'somehow equip'

interface ExtraItemInfo {
	item?: Item
	displayName: string
	desc: React.ReactNode[]
	mods: string
	rawMods: string
	extraOptions: React.ReactNode[]
	image: string
	extraClass?: string
	borderType: BorderType
	equipVerb: EquipVerb
}

interface UseExtraItemInfoOptionalArgs {
	namePrefix?: string
	iconOverride?: string
	forEquipping?: boolean
}

export function useExtraItemInfo(
	item: Item,
	isTooltip: boolean,
	optionals: UseExtraItemInfoOptionalArgs = {},
): ExtraItemInfo {
	const TextType = isTooltip ? DescTextTooltip : DescTextNonTooltip
	const mods = stringModifier(item, 'Evaluated Modifiers')
	const name = toString(item as unknown as string)
	const hands = weaponHands(item)
	const foldableAmount = getFoldableAmount(item)
	const res: ExtraItemInfo = {
		item,
		displayName: optionals.namePrefix
			? `${optionals.namePrefix}${name}`
			: name.toString(),
		desc: [],
		mods: mods ?? '',
		rawMods: mods ?? '',
		extraOptions: [],
		image:
			optionals.iconOverride ||
			(item !== $item`none` ? item.image : 'blank.gif'),
		borderType: 'normal',
		equipVerb: 'equip',
	}

	if (item === undefined) {
		return res
	}

	if (hands && hands > 1) {
		res.displayName = `${res.displayName} (${hands}h)`
	}

	switch (item) {
		case $item`June cleaver`: {
			const fightsLeft = get('_juneCleaverFightsLeft')
			if (fightsLeft === 0) {
				res.desc.push(<TextType key="cleavernoncom">noncom now!</TextType>)
				res.borderType = 'good'
			} else {
				res.desc.push(
					<TextType key="cleavernoncom">{fightsLeft} to noncom</TextType>,
				)
			}
			break
		}
		case $item`designer sweatpants`: {
			const rawSweat = get('sweat')
			const sweat = Math.max(Math.min(100, rawSweat), 0)
			const sweatBoozeUsed = get('_sweatOutSomeBoozeUsed')
			const sweatBoozeLeft = 3 - sweatBoozeUsed
			res.desc.push(<TextType key="sweatpantssweat">{sweat}% sweaty</TextType>)
			if (sweatBoozeLeft > 0) {
				res.desc.push(
					<TextType key="sweatbooze">{sweatBoozeLeft} booze sweats</TextType>,
				)
			}
			res.extraOptions.push(
				<PickerOption
					key="sweatskillpickeroption"
					icon={<ItemIcon item={item} />}
					WrappedPicker={SweatpantsPicker}
					pickerProps={{}}
					verb="use"
					subject="some sweat"
				/>,
			)
			break
		}
		case $item`Pantsgiving`: {
			const crumbsFound = get('_pantsgivingCrumbs')
			const crumbs = 10 - crumbsFound
			const banishesUsed = get('_pantsgivingBanish')
			const banishes = 5 - banishesUsed
			if (crumbs > 0) {
				res.desc.push(
					<TextType key="pocketcrumbs">{crumbs} crumbs left</TextType>,
				)
			}
			if (banishes > 0) {
				res.desc.push(
					<TextType key="politictalks">{banishes} banishes</TextType>,
				)
			}
			break
		}
		case $item`V for Vivala mask`: {
			const advsGained = get('_vmaskAdv')
			const advsGainable = 10 - advsGained
			if (advsGainable > 0) {
				res.desc.push(
					<TextType key="vadvs">{advsGainable} adv gainable</TextType>,
				)
				res.borderType = 'has-drops'
			}
			break
		}
		case $item`mayfly bait necklace`: {
			const fliesUsed = get('_mayflySummons')
			const fliesLeft = 30 - fliesUsed
			if (fliesLeft > 0) {
				res.desc.push(
					<TextType key="mayflies">{fliesLeft} summons left</TextType>,
				)
				res.borderType = 'has-drops'
			}
			break
		}
		// @ts-expect-error intentional fallthrough
		case $item`stinky cheese eye`: {
			const usedBanish = get('_stinkyCheeseBanisherUsed')
			if (!usedBanish) {
				res.desc.push(<TextType key="stinkybanish">banish available</TextType>)
			}
			// intentional fallthrough to automatically get stinkiness
		}
		// eslint-disable-next-line no-fallthrough
		case $item`stinky cheese sword`:
		case $item`stinky cheese diaper`:
		case $item`stinky cheese wheel`:
		case $item`Staff of Queso Escusado`: {
			const stinkiness = get('_stinkyCheeseCount')
			if (stinkiness < 100) {
				res.desc.push(
					<TextType key="stinkiness">{stinkiness}/100 stinkiness</TextType>,
				)
				res.borderType = 'has-drops'
			} else {
				res.desc.push(<TextType key="stinkiness">fully stinky</TextType>)
			}
			break
		}
		case $item`Buddy Bjorn`: {
			const bjornFam = myBjornedFamiliar()
			const bjornMods = stringModifier(
				`Throne:${bjornFam?.name}`,
				'Evaluated Modifiers',
			)
			const bjornInfo = useExtraFamInfo(bjornFam, true, true)
			if (bjornFam !== $familiar`none`) {
				res.image = bjornFam.image
				res.mods += `, ${parseMods(bjornMods ?? '')}`
				res.desc.push(...bjornInfo.desc)
			}
			res.extraOptions.push(
				<PickerOption
					key="bjornpickeroption"
					icon={<ItemIcon item={item} />}
					WrappedPicker={FamiliarPicker}
					pickerProps={{ type: 'bjorn' }}
					verb="pick"
					subject="a rider"
				/>,
			)
			break
		}
		case $item`Crown of Thrones`: {
			const crownFam = myEnthronedFamiliar()
			const crownMods = stringModifier(
				`Throne:${crownFam?.name}`,
				'Evaluated Modifiers',
			)
			const crownInfo = useExtraFamInfo(crownFam, true, true)
			if (crownFam !== $familiar`none`) {
				res.image = crownFam.image
				res.mods += `, ${parseMods(crownMods ?? '')}`
				res.desc.push(...crownInfo.desc)
			}
			res.extraOptions.push(
				<PickerOption
					key="crownpickeroption"
					icon={<ItemIcon item={item} />}
					WrappedPicker={FamiliarPicker}
					pickerProps={{ type: 'crown' }}
					verb="pick"
					subject="a rider"
				/>,
			)
			break
		}
		case $item`scratch 'n' sniff sword`:
		case $item`scratch 'n' sniff crossbow`: {
			const stickers = $slots`sticker1, sticker2, sticker3`.map((slot) =>
				equippedItem(slot),
			)
			const stickerAmount = (checkSticker: Item) =>
				stickers.reduce(
					(acc, eqSticker) => acc + (checkSticker === eqSticker ? 1 : 0),
					0,
				)
			const stickerInfo: {
				amount: number
				value: number
				pre?: string
				post?: string
			}[] = [
				{
					amount: stickerAmount($item`scratch 'n' sniff unicorn sticker`),
					value: 25,
					pre: 'Item +',
				},
				{
					amount: stickerAmount($item`scratch 'n' sniff apple sticker`),
					value: 2,
					pre: '+',
					post: ' exp',
				},
				{
					amount: stickerAmount($item`scratch 'n' sniff UPC sticker`),
					value: 25,
					pre: 'Meat +',
				},
				{
					amount: stickerAmount($item`scratch 'n' sniff wrestler sticker`),
					value: 10,
					pre: 'Stats +',
					post: '%',
				},
				{
					amount: stickerAmount($item`scratch 'n' sniff dragon sticker`),
					value: 3,
					pre: 'Prismatic Dmg +',
				},
				{
					amount: stickerAmount($item`scratch 'n' sniff rock band sticker`),
					value: 20,
					pre: 'All Dmg +',
				},
			]
			const stickerMods = stickerInfo
				.filter((sticker) => sticker.amount > 0)
				.map(
					(sticker) =>
						`${sticker.pre ?? ''}${sticker.amount * sticker.value}${
							sticker.post ?? ''
						}`,
				)
				.join(', ')
			if (stickerMods !== '') {
				res.mods = `${stickerMods}, Breakable`
			}
			break
		}
		case $item`The Crown of Ed the Undying`: {
			const currDecor = get('edPiece')
			const decorMods = stringModifier(
				`Edpiece:${currDecor}`,
				'Evaluated Modifiers',
			)
			if (decorMods !== '') {
				res.mods += `, ${decorMods}`
			}
			break
		}
		case $item`card sleeve`: {
			const currCard = equippedItem($slot`card-sleeve`)
			const cardMods = stringModifier(
				currCard ?? $item`none`,
				'Evaluated Modifiers',
			)
			res.mods += `, ${cardMods}`
			break
		}
		case $item`over-the-shoulder Folder Holder`: {
			const folderSlots = $slots`folder1, folder2, folder3, folder4, folder5`
			const equippedFolders = folderSlots.map((folderSlot) =>
				equippedItem(folderSlot),
			)
			const folderMods = equippedFolders.map((folder) =>
				stringModifier(folder ?? $item`none`, 'Evaluated Modifiers'),
			)
			const nonEmptyMods = folderMods.filter((mod) => mod !== '')
			res.mods = [res.mods, ...nonEmptyMods].join(', ')
			break
		}
		case $item`your cowboy boots`: {
			const bootSlots = $slots`bootskin, bootspur`
			const equippedBootery = bootSlots.map((bootSlot) =>
				equippedItem(bootSlot),
			)
			const booteryMods = equippedBootery.map((bootery) =>
				stringModifier(bootery, 'Evaluated Modifiers'),
			)
			const nonEmptyMods = booteryMods.filter((mod) => mod !== '')
			res.mods = [res.mods, ...nonEmptyMods].join(', ')
			break
		}
		case $item`mafia thumb ring`: {
			res.desc.push(
				<TextType key="thumbringadvs">
					{get('_mafiaThumbRingAdvs')} adv gained
				</TextType>,
			)
			break
		}
		case $item`Daylight Shavings Helmet`: {
			const lastBeardId = get('lastBeardBuff')
			const lastBeard = toEffect(lastBeardId)
			const beards = $effects`Spectacle Moustache, Toiletbrush Moustache, Barbell Moustache, Grizzly Beard, Surrealist's Moustache, Musician's Musician's Moustache, Gull-Wing Moustache, Space Warlord's Beard, Pointy Wizard Beard, Cowboy Stache, Friendly Chops`
			const currBeard = beards.find((beard) => have(beard))
			const beardOrder: Effect[] = []
			const classId = toInt(myClass())
			const classIdMod = (classId <= 6 ? classId : classId + 1) % 6
			const turnsOfCurrBeard = haveEffect(currBeard ?? toEffect(`none`))
			const beardOffset = currBeard
				? beards.indexOf(currBeard)
				: lastBeard
				? beards.indexOf(lastBeard) + 1
				: 1
			if (classId !== 0) {
				for (let i = 0; i < 11; ++i) {
					beardOrder[i] = beards[(classIdMod * i + beardOffset) % 11]
				}
			}
			const nextBeard = beardOrder[currBeard ? 1 : 0]
			const nextBeardRawMods = stringModifier(nextBeard, 'Evaluated Modifiers')
			res.extraOptions.push(
				<PickerOption
					key="beardlistoption"
					icon={<ItemIcon item={item} />}
					WrappedPicker={EffectListPseudoPicker}
					pickerProps={{
						effects: beardOrder,
						header: 'Beard schedule',
						enabled: (eff: Effect) => eff !== currBeard,
					}}
					verb="check"
					subject="upcoming beards"
				/>,
			)
			res.extraOptions.push(
				<LinkOption
					key="beardchangefacialhairoption"
					icon={<ItemIcon item={item} />}
					verb="adjust"
					subject="your facial hair"
					link="/account_facialhair.php"
				/>,
			)
			res.desc.push(
				<Text
					key="nextbeard"
					className={isTooltip ? 'popup-desc-line' : 'desc-line'}
					dangerouslySetInnerHTML={{
						__html: `${toString(nextBeard as unknown as string)} [${parseMods(
							nextBeardRawMods,
						)}] due ${currBeard ? `in ${turnsOfCurrBeard ?? 0} turns` : 'now'}`,
					}}
				/>,
			)
			if (!currBeard) {
				res.borderType = 'good'
			}
			break
		}
		case $item`bone abacus`: {
			const victories = get('boneAbacusVictories')
			if (victories < 1000) {
				res.desc.push(
					<TextType key="abacuswins">{victories}/1000 wins</TextType>,
				)
				res.borderType = 'has-drops'
			} else {
				res.desc.push(<TextType key="abacuswins">You did it!</TextType>)
			}
			break
		}
		// @ts-expect-error intentional fallthrough
		case $item`navel ring of navel gazing`: {
			res.displayName = 'navel ring'
			// intentional fallthrough to automatically get stinkiness
		}
		// eslint-disable-next-line no-fallthrough
		case $item`Greatest American Pants`: {
			const runsUsed = get('_navelRunaways')
			const freeChance =
				runsUsed < 3 ? 100 : runsUsed < 6 ? 80 : runsUsed < 9 ? 50 : 20
			res.desc.push(
				<TextType key="gaprunchance">{freeChance}% free run</TextType>,
			)
			if (runsUsed < 3) {
				res.borderType = 'has-drops'
			}
			if (item === $item`Greatest American Pants`) {
				const buffsUsed = get('_gapBuffs')
				if (buffsUsed < 5) {
					res.desc.push(
						<TextType key="gapsuperpowers">
							{5 - buffsUsed} super powers
						</TextType>,
					)
					res.borderType = 'has-drops'
					res.extraOptions.push(
						<PickerOption
							key="gapsuperpowerspickeroption"
							icon={<ItemIcon item={item} />}
							verb="activate"
							subject="super power"
							WrappedPicker={GAPPicker}
							pickerProps={{ usesRemaining: 5 - buffsUsed }}
						/>,
					)
				}
			}
			break
		}
	}

	if (itemAmount(item) === 0 && optionals.forEquipping) {
		if (closetAmount(item) > 0) {
			res.equipVerb = 'uncloset'
		} else if (foldableAmount > 0) {
			res.equipVerb = 'fold'
		} else if (storageAmount(item) > 0 && pullsRemaining() === -1) {
			res.equipVerb = 'pull'
		} else if (creatableAmount(item) > 0) {
			res.equipVerb = 'create'
			res.borderType = 'warning'
		} else if (storageAmount(item) > 0 && pullsRemaining() > 0) {
			res.equipVerb = 'pull'
			res.borderType = 'danger'
		} else {
			res.equipVerb = 'somehow equip'
		}
	}

	res.mods = parseMods(res.mods)

	return res
}
