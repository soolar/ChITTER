import {
	booleanModifier,
	canEquip,
	closetAmount,
	creatableAmount,
	equip,
	equippedAmount,
	equippedItem,
	Familiar,
	familiarEquipment,
	fileToBuffer,
	getInventory,
	getRelated,
	hippyStoneBroken,
	inebrietyLimit,
	isUnrestricted,
	Item,
	itemAmount,
	myInebriety,
	myPath,
	myPrimestat,
	numericModifier,
	pullsRemaining,
	Slot,
	storageAmount,
	stringModifier,
	toItem,
	toModifier,
	toSlot,
	toStat,
	weaponHands,
	weaponType,
} from 'kolmafia'
import {
	$familiar,
	$item,
	$modifier,
	$skill,
	$slot,
	$stat,
	get,
	have,
	set,
	StringProperty,
} from 'libram'
import Picker from './Picker'
import {
	ButtonGroup,
	Heading,
	HStack,
	Text,
	VStack,
	Wrap,
	WrapItem,
} from '@chakra-ui/react'
import ChitterOption from '../Option/ChitterOption'
import ItemIcon from '../Icons/ItemIcon'
import ActionLink from '../Link/ActionLink'
import { foldableAmount, getItemInfo } from '../../../util/helpers'
import OptionText from '../Option/OptionText'
import ChitterIcon from '../Icons/ChitterIcon'
import { evaluatedModifiers, strCompare } from '../../../util'

interface GearCategoryEntry {
	item: Item
	score: number
}

interface GearCategory {
	name: string
	items: GearCategoryEntry[]
}

interface GearPickerArgs {
	slot: Slot
	fam?: Familiar
}

interface MainstatCondition {
	type: 'mainstat'
	value: 'Muscle' | 'Mysticality' | 'Moxie'
}

interface PvpCondition {
	type: 'pvp'
	value: boolean
}

interface OverdrunkCondition {
	type: 'overdrunk'
	value: boolean
}

type Comparison = '!' | '<' | '<=' | '>' | '>='

interface QuestCondition {
	type: 'quest'
	pref: string
	value: string
	comparison?: Comparison
}

interface PathCondition {
	type: 'path'
	value: string
}

interface BountyCondition {
	type: 'bounty'
	value: string
}

type GearCondition =
	| MainstatCondition
	| PvpCondition
	| OverdrunkCondition
	| QuestCondition
	| PathCondition
	| BountyCondition

interface GearConditionList {
	list: GearCondition[]
	any?: boolean
}

function questStepToNumber(questStep: string | number, name: string) {
	if (questStep === 'unstarted') {
		return -1
	}
	if (questStep === 'started') {
		return 0
	}
	if (questStep === 'finished') {
		return 999999
	}
	if (typeof questStep === 'string') {
		if (questStep.startsWith('step')) {
			return Number(questStep.substring(4))
		} else {
			return Number(questStep)
		}
	}
	if (typeof questStep === 'number') {
		return questStep
	}
	throw Error(`Malformed quest step ${questStep} from pref ${name}`)
}

function evaluateGearConditionList(gcl?: GearConditionList) {
	if (!gcl) {
		return true
	}

	function evaluateGearCondition(gc: GearCondition) {
		if (gc.type === 'mainstat') {
			return myPrimestat() === toStat(gc.value)
		} else if (gc.type === 'pvp') {
			return hippyStoneBroken() === gc.value
		} else if (gc.type === 'overdrunk') {
			return myInebriety() > inebrietyLimit() === gc.value
		} else if (gc.type === 'quest') {
			const actualStep = questStepToNumber(get(gc.pref, 'unstarted'), gc.pref)
			const compareStep = questStepToNumber(gc.value, 'gc.value')
			switch (gc.comparison) {
				case '!':
					return actualStep !== compareStep
				case '<':
					return actualStep < compareStep
				case '<=':
					return actualStep <= compareStep
				case '>':
					return actualStep > compareStep
				case '>=':
					return actualStep >= compareStep
				default:
					return actualStep === compareStep
			}
		} else if (gc.type === 'path') {
			return myPath().name === gc.value
		} else if (gc.type === 'bounty') {
			const bountyPrefs: StringProperty[] = [
				'currentEasyBountyItem',
				'currentHardBountyItem',
				'currentSpecialBountyItem',
			]
			return (
				bountyPrefs.map(get).find((bounty) => bounty === gc.value) !== undefined
			)
		} else {
			throw Error(
				`Malformed json in chitter_gear_categories.json: gc.type is ${(gc as GearCondition).type}`,
			)
		}
	}

	return gcl.any
		? gcl.list.some(evaluateGearCondition)
		: gcl.list.every(evaluateGearCondition)
}

interface GearMod {
	mod: string
	multiplier?: number
	conditions?: GearConditionList
}

type ManualEntry = string | { name: string; weight: number }

interface ConditionalManualList {
	items: ManualEntry[]
	conditions?: GearConditionList
}

interface GearRecommendationCategory {
	name: string
	mods?: GearMod[]
	manual?: ConditionalManualList[]
	conditions?: GearConditionList
}

export default function GearPicker({ slot, fam }: GearPickerArgs) {
	const functionalSlot =
		slot === $slot`acc2` || slot === $slot`acc3`
			? $slot`acc1`
			: slot === $slot`familiar`
				? fam === $familiar`Disembodied Hand`
					? $slot`weapon`
					: fam === $familiar`Fancypants Scarecrow`
						? $slot`pants`
						: fam === $familiar`Mad Hatrack`
							? $slot`hat`
							: fam === $familiar`Left-Hand Man`
								? $slot`off-hand`
								: $slot`familiar`
				: slot
	const isWeirdFam =
		fam === $familiar`Fancypants Scarecrow` || fam === $familiar`Mad Hatrack`
	const equipped = equippedItem(slot)
	const baseFilter = (item: Item) =>
		item !== $item.none &&
		isUnrestricted(item) &&
		canEquip(item) &&
		equipped !== item &&
		itemAmount(item) +
			closetAmount(item) +
			(pullsRemaining() !== 0 ? storageAmount(item) : 0) +
			creatableAmount(item) +
			foldableAmount(item) >
			0 &&
		!(booleanModifier(item, 'Single Equip') && equippedAmount(item) > 0) &&
		(toSlot(item) === functionalSlot ||
			(toSlot(item) === $slot`weapon` &&
				slot === $slot`off-hand` &&
				have($skill`Double-Fisted Skull Smashing`) &&
				weaponHands(item) <= 1 &&
				(weaponType(item) === $stat`Moxie`) ===
					(weaponType(equippedItem($slot`weapon`)) === $stat`Moxie`)))

	let favsProp = 'chit.gear.favorites'

	const categories: GearCategory[] = []

	if (fam) {
		const uniqueFamEquip = familiarEquipment(fam)
		if (functionalSlot !== $slot`familiar`) {
			favsProp = `chit.familiar.${slot.identifierString}${
				functionalSlot !== $slot`pants` ? 's' : ''
			}`
		} else if (uniqueFamEquip !== $item.none) {
			const foldables = getRelated(uniqueFamEquip, 'fold')
			if (foldables.length > 0) {
				categories.push({
					name: 'uniques',
					items: Object.keys(foldables)
						.map((itemName) => {
							return { item: toItem(itemName), score: 1 }
						})
						.filter((entry) => baseFilter(entry.item)),
				})
			} else {
				categories.push({
					name: 'unique',
					items: [uniqueFamEquip].filter(baseFilter).map((item) => {
						return { item, score: 1 }
					}),
				})
			}
		}
	}

	const allFavorites = get(favsProp, '')
		.split('|')
		.map((itemName) => toItem(itemName))
	const filteredFavorites = allFavorites.filter(baseFilter)

	const isFavorite =
		equipped && allFavorites.find((it) => it === equipped) !== undefined
	const changedFavs = isFavorite
		? allFavorites.filter((it) => it !== equipped)
		: [...allFavorites, equipped]
	const changedFavsStr = changedFavs.map((it) => it.identifierString).join('|')

	categories.unshift({
		name: 'favorites',
		items: filteredFavorites.map((item) => {
			return { item, score: 1 }
		}),
	})

	const cgc = fileToBuffer('chitter_gear_categories.json')
	const autoCategories: GearRecommendationCategory[] =
		cgc !== '' ? JSON.parse(cgc) : []

	const inv = getInventory()
	const recommendableItems = Object.keys(inv)
		.map((itemName) => toItem(itemName))
		.filter(baseFilter)

	categories.push(
		...autoCategories
			.map((category) => {
				const res: GearCategory = { name: category.name, items: [] }
				function addItem(item: Item, score: number) {
					const existingItem = res.items.find((entry) => entry.item === item)
					if (existingItem) {
						existingItem.score += score
					} else {
						res.items.push({ item, score })
					}
				}
				if (!evaluateGearConditionList(category.conditions)) {
					// failed condition, so just return it empty, it'll get filtered out in the filter call
					return res
				}

				if (category.mods) {
					category.mods.forEach((modEntry) => {
						if (
							!evaluateGearConditionList(modEntry.conditions) ||
							modEntry.mod === ''
						) {
							return
						}
						const mult = modEntry.multiplier ?? 1
						const modifier = toModifier(modEntry.mod)
						if (modifier != $modifier.none) {
							recommendableItems.forEach((recItem) => {
								const score =
									(numericModifier(recItem, modifier) * mult) /
									(weaponHands(recItem) > 1 ? 2 : 1)
								if (score > 0) {
									addItem(recItem, score)
								}
							})
						}
					})
				}

				if (category.manual) {
					category.manual.forEach((manualListItem) => {
						if (evaluateGearConditionList(manualListItem.conditions)) {
							manualListItem.items.forEach((manualEntry) => {
								const itemName =
									typeof manualEntry === 'string'
										? manualEntry
										: manualEntry.name
								const item = toItem(itemName)
								if (baseFilter(item)) {
									addItem(
										item,
										typeof manualEntry !== 'string' ? manualEntry.weight : 1,
									)
								}
							})
						}
					})
				}

				res.items = res.items
					.filter((entry) => entry.item !== $item.none && entry.score > 0)
					.sort((lhs, rhs) =>
						lhs.score === rhs.score
							? strCompare(lhs.item.name, rhs.item.name)
							: rhs.score - lhs.score,
					)

				if (res.items.length > 6) {
					res.items = res.items.slice(0, 6)
				}

				return res
			})
			.filter((value) => value.items.length > 0),
	)

	const header =
		slot === $slot`familiar`
			? 'Change familiar equipment'
			: `Change ${slot.identifierString}`

	const extraInfo = getItemInfo(equipped)
	return (
		<Picker header={header}>
			{extraInfo.extraOptions}
			{equipped !== $item.none && (
				<ChitterOption icon={<ItemIcon item={equipped} />}>
					<HStack>
						<ActionLink callback={() => equip($item.none, slot)}>
							<OptionText verb="unequip" subject={equipped.name} />
						</ActionLink>
						<ActionLink
							callback={() => set('chit.gear.favorites', changedFavsStr)}
							dirty
						>
							<ChitterIcon
								chitImage
								image={`control_${isFavorite ? 'remove_red' : 'add_blue'}.png`}
								small
								tooltip={`${isFavorite ? 'un' : ''}favorite ${equipped.name}`}
							/>
						</ActionLink>
					</HStack>
				</ChitterOption>
			)}
			<VStack>
				<Heading>Favorites</Heading>
				{categories[0].items.length > 0 ? (
					<ButtonGroup>
						<Wrap spacing={0}>
							{categories[0].items.map((fav) => (
								<WrapItem
									key={`${slot.identifierString} favorites ${fav.item.name}`}
								>
									<ActionLink callback={() => equip(fav.item, slot)}>
										<ItemIcon
											item={fav.item}
											weirdFam={isWeirdFam}
											forEquipping
										/>
									</ActionLink>
								</WrapItem>
							))}
						</Wrap>
					</ButtonGroup>
				) : (
					<Text>You have no valid favorite items for this slot!</Text>
				)}
				<Heading>Suggestions</Heading>
				{categories
					.filter(
						(category) =>
							category.items.length > 0 && category.name !== 'favorites',
					)
					.map((category) => (
						<HStack key={`${slot.identifierString} ${category.name}`}>
							<Wrap spacing={0}>
								<WrapItem>
									<Heading as="h3">{category.name}</Heading>
								</WrapItem>
								<ButtonGroup variant="link">
									{category.items.map((entry) => (
										<WrapItem
											key={`${slot.identifierString} ${category.name} ${entry.item.name}`}
										>
											<ActionLink callback={() => equip(entry.item, slot)}>
												<ItemIcon
													item={entry.item}
													weirdFam={isWeirdFam}
													forEquipping
												/>
											</ActionLink>
										</WrapItem>
									))}
								</ButtonGroup>
							</Wrap>
						</HStack>
					))}
			</VStack>
		</Picker>
	)
}
