import * as React from 'react'
import {
	Button,
	ButtonGroup,
	Heading,
	Switch,
	Text,
	VStack,
	Wrap,
	WrapItem,
} from '@chakra-ui/react'
import Picker from './Picker'
import { BrowserItem, BrowserList, BrowserSlot } from '../../../guidelines'
import ItemIcon from '../Icons/ItemIcon'
import { getExtraItemInfo } from '../../itemHelpers'
import SimpleOption from '../Option/SimpleOption'

interface GearPickerArgs {
	slot: BrowserSlot
}

declare const items: BrowserList<BrowserItem>

export default function GearPicker({ slot }: GearPickerArgs) {
	const functionalSlotName =
		slot.name === 'acc2' || slot.name === 'acc3' ? 'acc1' : slot.name
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

	const extraInfo = getExtraItemInfo(equipped)
	return (
		<Picker header={`Change ${slot.name}`}>
			{extraInfo.extraOptions}
			{equipped && (
				<SimpleOption
					icon={<ItemIcon item={equipped} />}
					verb="unequip"
					subject={equipped.name}
				/>
			)}
			{categories.map((category) => {
				return (
					<VStack>
						<Heading>{category.name}</Heading>
						<ButtonGroup variant="link">
							<Wrap spacing={0}>
								{category.items.map((item) => {
									return (
										<WrapItem>
											<Button>
												<ItemIcon item={item} />
											</Button>
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
