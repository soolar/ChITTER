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
import { getGearRecommendations, useExtraItemInfo } from '../../itemHelpers'
import ChitterOption from '../Option/ChitterOption'
import ChitterIcon from '../Icons/ChitterIcon'
import CallbackLink from '../Link/CallbackLink'
import CommandLink from '../Link/CommandLink'
import { $familiar, $skill, $slot } from 'libram'
import {
	availableAmount,
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
	haveSkill,
	isUnrestricted,
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
import { $item } from 'libram'
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
		isUnrestricted(item) &&
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
	const recommendations = getGearRecommendations(functionalSlot)
	recommendations.categoryOrder.forEach((name) => {
		categories.push({
			name,
			items: (recommendations.categories.get(name) as Item[]).filter(
				(it) => equipped !== it,
			),
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

	const extraInfo = useExtraItemInfo(equipped, true, { forEquipping: true })
	return (
		<Picker header={`Change ${slotName}`}>
			{extraInfo.extraOptions}
			{equipped && (
				<ChitterOption icon={<ItemIcon item={equipped} />}>
					<HStack>
						<CallbackLink callback={() => equip(slot, $item.none)}>
							<Text>
								<Text as="b">unequip</Text>&nbsp;
								<Text
									as="span"
									dangerouslySetInnerHTML={{ __html: equipped.name }}
								/>
							</Text>
						</CallbackLink>
						<CommandLink
							cmd={`chitter_changeFav.js (${
								equippedFav ? 'remove' : 'add'
							}, ${favsProp}, ${equipped.name})`}
						>
							<ChitterIcon
								chitImage
								image={`control_${equippedFav ? 'remove_red' : 'add_blue'}.png`}
								size="small"
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
										<CallbackLink callback={() => equip(slot, fav)}>
											<ItemIcon item={fav} weirdFam={isWeirdFam} forEquipping />
										</CallbackLink>
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
													<CallbackLink callback={() => equip(slot, item)}>
														<ItemIcon
															item={item}
															weirdFam={isWeirdFam}
															forEquipping
														/>
													</CallbackLink>
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
