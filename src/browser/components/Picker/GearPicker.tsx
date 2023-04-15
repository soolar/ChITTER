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
import {
	BrowserFamiliar,
	BrowserItem,
	BrowserList,
	BrowserSlot,
} from '../../../guidelines'
import ItemIcon from '../Icons/ItemIcon'
import { getExtraItemInfo } from '../../itemHelpers'
import {
	BrowserChitProperties,
	BrowserGearCategory,
	BrowserGearCategorySlot,
} from '../../../properties'
import ChitterOption from '../Option/ChitterOption'
import ChitterIcon from '../Icons/ChitterIcon'
import CommandLink from '../Link/CommandLink'
import { $familiar } from '../../fakeLibram'
import { BrowserCharacter } from '../../../character'

type GearPickerArgs = {
	slot: BrowserSlot
	fam?: BrowserFamiliar
}

declare const items: BrowserList<BrowserItem>
declare const chitProperties: BrowserChitProperties
declare const gearCategories: BrowserGearCategory[]
declare const my: BrowserCharacter

export default function GearPicker({ slot, fam }: GearPickerArgs) {
	const functionalSlotName =
		slot.name === 'acc2' || slot.name === 'acc3'
			? 'acc1'
			: slot.name === 'familiar'
			? fam === $familiar`Disembodied Hand`
				? 'weapon'
				: fam === $familiar`Fancypants Scarecrow`
				? 'pants'
				: fam === $familiar`Mad Hatrack`
				? 'hat'
				: fam === $familiar`Left-Hand Man`
				? 'off-hand'
				: 'familiar'
			: slot.name
	const isWeirdFam =
		fam === $familiar`Fancypants Scarecrow` || fam === $familiar`Mad Hatrack`
	const equipped = slot.equipped
	const baseFilter = (item: BrowserItem) =>
		item.slotStr === functionalSlotName &&
		equipped !== item &&
		item.available > 0
	const categories = [
		{
			name: 'favorites',
			items: items.favorites.filter(baseFilter),
		},
	]

	gearCategories.forEach((category) => {
		categories.push({
			name: category.name,
			items: category.items[
				functionalSlotName as BrowserGearCategorySlot
			].filter((it) => equipped !== it),
		})
	})

	let favsProp = 'gear.favorites'
	let favsList = items.favorites

	if (fam) {
		if (functionalSlotName !== 'familiar') {
			favsProp = `familiar.${functionalSlotName}${
				functionalSlotName !== 'pants' ? 's' : ''
			}`
			favsList = chitProperties[favsProp] as BrowserItem[]
			categories[0].items = favsList.filter(baseFilter)
		} else if (fam.uniqueEquipment) {
			if (fam.uniqueEquipment.foldableNames) {
				categories.push({
					name: 'uniques',
					items: fam.uniqueEquipment.foldableNames
						.map((itemName) => items.byName[itemName])
						.filter(baseFilter),
				})
			} else {
				categories.push({
					name: 'unique',
					items: [fam.uniqueEquipment].filter(baseFilter),
				})
			}
		}
	}

	const equippedFav = !!favsList.find((it) => it === equipped)

	const extraInfo = getExtraItemInfo(equipped)
	return (
		<Picker header={`Change ${slot.name}`}>
			{extraInfo.extraOptions}
			{equipped && (
				<ChitterOption icon={<ItemIcon item={equipped} />}>
					<HStack>
						<CommandLink cmd={`unequip ${slot.name}`}>
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
									<WrapItem key={`${slot.name} favorites ${fav.name}`}>
										<CommandLink cmd={`equip ${slot.name} ${fav.name}`}>
											<ItemIcon item={fav} weirdFam={isWeirdFam} forEquipping />
										</CommandLink>
									</WrapItem>
								)
							})}
						</Wrap>
					</ButtonGroup>
				) : (
					<Text>You have no favorite items for this slot!</Text>
				)}
				<Heading>Suggestions</Heading>
				{categories
					.filter(
						(category) =>
							category.items.length > 0 && category.name !== 'favorites'
					)
					.map((category) => {
						return (
							<HStack key={`${slot.name} ${category.name}`}>
								<Wrap spacing={0}>
									<WrapItem>
										<Heading as="h3">{category.name}</Heading>
									</WrapItem>
									<ButtonGroup variant="link">
										{category.items.map((item) => {
											return (
												<WrapItem
													key={`${slot.name} ${category.name} ${item.name}`}
												>
													<CommandLink cmd={`equip ${slot.name} ${item.name}`}>
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
