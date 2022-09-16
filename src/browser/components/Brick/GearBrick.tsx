import * as React from 'react'
import { Flex } from '@chakra-ui/react'
import { BrowserList, BrowserSlot } from '../../../guidelines'
import ItemIcon from '../Icons/ItemIcon'
import Brick from './Brick'
import PickerLauncher from '../Picker/PickerLauncher'
import GearPicker from '../Picker/GearPicker'

declare const slots: BrowserList<BrowserSlot>

export default function GearBrick() {
	return (
		<Brick name="gear" header="Gear">
			<Flex>
				{slots.favorites.map((slot) => {
					return (
						<PickerLauncher
							WrappedPicker={GearPicker}
							pickerProps={{ slotName: slot.name }}
						>
							<ItemIcon
								item={slot.equipped}
								tooltipOverride={`${slot.name}: ${
									slot.equipped ? slot.equipped.name : 'empty'
								}`}
							/>
						</PickerLauncher>
					)
				})}
			</Flex>
		</Brick>
	)
}
