import * as React from 'react'
import {
	Button,
	ButtonGroup,
	Heading,
	VStack,
	Wrap,
	WrapItem,
} from '@chakra-ui/react'
import Picker from './Picker'
import { BrowserItem, BrowserList, BrowserSlot } from '../../../guidelines'
import ItemIcon from '../Icons/ItemIcon'
import { getExtraItemInfo } from '../../itemHelpers'
import GearOption from '../GearOption'

interface GearPickerArgs {
	slotName: string
}

declare const items: BrowserList<BrowserItem>
declare const slots: BrowserList<BrowserSlot>

export default function GearPicker({ slotName }: GearPickerArgs) {
	const functionalSlotName =
		slotName === 'acc2' || slotName === 'acc3' ? 'acc1' : slotName
	const slot = slots.byName[slotName]
	const equipped = slot.equipped
	const categories = [
		{
			name: 'favorites',
			items: items.favorites.filter(
				(item) =>
					item.slotStr === functionalSlotName && equipped.name !== item.name
			),
		},
	]
	const extraInfo = getExtraItemInfo(equipped)
	return (
		<Picker header={`Change ${slotName}`}>
			{extraInfo.extraOptions.map((option) => {
				return <GearOption item={equipped}>{option}</GearOption>
			})}
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
