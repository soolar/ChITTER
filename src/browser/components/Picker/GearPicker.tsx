import * as React from 'react'
import {
	Button,
	ButtonGroup,
	Heading,
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
import SimpleOption from '../Option/SimpleOption'
import { BrowserChitProperties } from '../../../properties'
import ChitterOption from '../Option/ChitterOption'
import ChitterIcon from '../Icons/ChitterIcon'
import CommandLink from '../Link/CommandLink'

type GearPickerArgs = {
	slot: BrowserSlot
	fam?: BrowserFamiliar
}

declare const items: BrowserList<BrowserItem>
declare const familiars: BrowserList<BrowserFamiliar>
declare const chitProperties: BrowserChitProperties

export default function GearPicker({ slot, fam }: GearPickerArgs) {
	const functionalSlotName =
		slot.name === 'acc2' || slot.name === 'acc3'
			? 'acc1'
			: slot.name === 'familiar'
			? fam === familiars.byName['disembodied hand']
				? 'weapon'
				: fam === familiars.byName['fancypants scarecrow']
				? 'pants'
				: fam === familiars.byName['mad hatrack']
				? 'hat'
				: fam === familiars.byName['left-hand man']
				? 'off-hand'
				: 'familiar'
			: slot.name
	const isWeirdFam =
		fam === familiars.byName['fancypants scarecrow'] ||
		fam === familiars.byName['mad hatrack']
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
					<CommandLink cmd={`unequip ${slot.name}`}>
						<Text>
							<Text as="b">unequip</Text>&nbsp;{equipped.name}
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
				</ChitterOption>
			)}
			{categories
				.filter((category) => category.items.length > 0)
				.map((category) => {
					return (
						<VStack>
							<Heading>{category.name}</Heading>
							<ButtonGroup variant="link">
								<Wrap spacing={0}>
									{category.items.map((item) => {
										return (
											<WrapItem>
												<CommandLink cmd={`equip ${slot.name} ${item.name}`}>
													<ItemIcon item={item} weirdFam={isWeirdFam} />
												</CommandLink>
											</WrapItem>
										)
									})}
								</Wrap>
							</ButtonGroup>
						</VStack>
					)
				})}
		</Picker>
	)
}
