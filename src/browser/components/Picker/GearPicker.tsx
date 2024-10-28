import React from 'react'
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
	getRelated,
	Item,
	itemAmount,
	pullsRemaining,
	Slot,
	storageAmount,
	toItem,
	toSlot,
	weaponHands,
} from 'kolmafia'
import { $familiar, $item, $skill, $slot, get, have, set } from 'libram'
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
import { foldableAmount, getItemInfo } from '../../../util/itemHelpers'
import OptionText from '../Option/OptionText'
import ChitterIcon from '../Icons/ChitterIcon'

interface GearCategory {
	name: string
	items: Item[]
}

interface GearPickerArgs {
	slot: Slot
	fam?: Familiar
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
				have($skill`Double-fisted skull smashing`) &&
				weaponHands(item) <= 1))

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
						.map((itemName) => toItem(itemName))
						.filter(baseFilter),
				})
			} else {
				categories.push({
					name: 'unique',
					items: [uniqueFamEquip].filter(baseFilter),
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
		items: filteredFavorites,
	})

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
									key={`${slot.identifierString} favorites ${fav.name}`}
								>
									<ActionLink callback={() => equip(fav, slot)}>
										<ItemIcon item={fav} weirdFam={isWeirdFam} forEquipping />
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
									{category.items.map((item) => (
										<WrapItem
											key={`${slot.identifierString} ${category.name} ${item.name}`}
										>
											<ActionLink callback={() => equip(item, slot)}>
												<ItemIcon
													item={item}
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
