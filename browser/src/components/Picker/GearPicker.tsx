import * as React from 'react'
import {
	ButtonGroup,
	Heading,
	HStack,
	Text,
	VStack,
	Wrap,
	WrapItem,
} from '@chakra-ui/react'
import Picker from './Picker'
import ItemIcon from '../Icons/ItemIcon'
import { useExtraItemInfo } from '../../itemHelpers'
import ChitterOption from '../Option/ChitterOption'
import ChitterIcon from '../Icons/ChitterIcon'
import CommandLink from '../Link/CommandLink'
import { $familiar, $skill, $slot } from 'libram'
import {
	availableAmount,
	booleanModifier,
	canEquip,
	closetAmount,
	creatableAmount,
	equippedAmount,
	equippedItem,
	Familiar,
	familiarEquipment,
	getRelated,
	haveSkill,
	Item,
	itemAmount,
	pullsRemaining,
	Slot,
	storageAmount,
	toInt,
	toItem,
	toSlot,
	toString,
} from 'kolmafia'
import { getPropVal } from '../../utils'

type GearPickerArgs = {
	slot: Slot
	fam?: Familiar
}

export default function GearPicker({ slot, fam }: GearPickerArgs) {
	const slotName = toString(slot as unknown as string)
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
	const foldableAmount = (it: Item) =>
		Object.keys(getRelated(it, 'fold'))
			.filter((foldableName) => toItem(foldableName) !== it)
			.reduce(
				(partial, foldableName) =>
					partial + availableAmount(toItem(foldableName)),
				0,
			)
	const baseFilter = (item: Item) =>
		canEquip(item) &&
		(toSlot(item) === functionalSlot ||
			(haveSkill($skill`Double-Fisted Skull Smashing`) &&
				toSlot(item) === $slot`weapon` &&
				slot === $slot`off-hand`)) &&
		equipped !== item &&
		itemAmount(item) +
			closetAmount(item) +
			(pullsRemaining() !== 0 ? storageAmount(item) : 0) +
			creatableAmount(item) +
			foldableAmount(item) >
			0 &&
		!(booleanModifier(item, 'Single Equip') && equippedAmount(item) > 0)
	const favsProp = 'gear.favorites'
	const favsList = ((getPropVal(favsProp) ?? []) as Item[])
		.sort((a: Item, b: Item) => toInt(a) - toInt(b))
		.filter(baseFilter)
	const categories = [
		{
			name: 'favorites',
			items: favsList,
		},
	]

	/*
	gearCategories.forEach((category) => {
		categories.push({
			name: category.name,
			items: category.items[
				functionalSlotName as BrowserGearCategorySlot
			].filter((it) => equipped !== it),
		})
	})
	*/

	if (fam) {
		const uniqueEquipment = familiarEquipment(fam)
		if (uniqueEquipment) {
			const foldables = Object.keys(getRelated(uniqueEquipment, 'fold') ?? {})
			if (foldables.length > 0) {
				categories.push({
					name: 'uniques',
					items: foldables
						.filter((itemName: string) => itemName !== '')
						.map((itemName: string) => toItem(itemName))
						.filter(baseFilter),
				})
			} else {
				categories.push({
					name: 'unique',
					items: [uniqueEquipment].filter(baseFilter),
				})
			}
		}
	}

	const equippedFav = !!favsList.find((it) => it === equipped)

	const extraInfo = useExtraItemInfo(equipped, { forEquipping: true })
	return (
		<Picker header={`Change ${slotName}`}>
			{extraInfo.extraOptions}
			{equipped && (
				<ChitterOption icon={<ItemIcon item={equipped} />}>
					<HStack>
						<CommandLink cmd={`unequip ${slotName}`}>
							<Text>
								<Text as="b">unequip</Text>&nbsp;
								<Text
									as="span"
									dangerouslySetInnerHTML={{ __html: equipped.name }}
								/>
							</Text>
						</CommandLink>
						<CommandLink
							cmd={`chitter_changeFav.js (${
								equippedFav ? 'remove' : 'add'
							}, ${favsProp}, ${equipped.name})`}
						>
							<ChitterIcon
								chitImage
								image={`control_${equippedFav ? 'remove_red' : 'add_blue'}.png`}
								small
								tooltip={`${equippedFav ? 'un' : ''}favorite ${equipped.name}`}
							/>
						</CommandLink>
					</HStack>
				</ChitterOption>
			)}
			<VStack>
				<Heading>Favorites</Heading>
				{categories[0].items.length > 0 ? (
					<ButtonGroup>
						<Wrap spacing={0}>
							{categories[0].items.map((fav) => {
								return (
									<WrapItem key={`${slotName} favorites ${fav.name}`}>
										<CommandLink cmd={`equip ${slotName} ${fav.name}`}>
											<ItemIcon item={fav} weirdFam={isWeirdFam} forEquipping />
										</CommandLink>
									</WrapItem>
								)
							})}
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
					.map((category) => {
						return (
							<HStack key={`${slotName} ${category.name}`}>
								<Wrap spacing={0}>
									<WrapItem>
										<Heading as="h3">{category.name}</Heading>
									</WrapItem>
									<ButtonGroup variant="link">
										{category.items.map((item) => {
											return (
												<WrapItem
													key={`${slotName} ${category.name} ${item.name}`}
												>
													<CommandLink cmd={`equip ${slotName} ${item.name}`}>
														<ItemIcon
															item={item}
															weirdFam={isWeirdFam}
															forEquipping
														/>
													</CommandLink>
												</WrapItem>
											)
										})}
									</ButtonGroup>
								</Wrap>
							</HStack>
						)
					})}
			</VStack>
		</Picker>
	)
}
