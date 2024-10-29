import React from 'react'
import Brick from './Brick'
import { Wrap, WrapItem } from '@chakra-ui/react'
import PickerLauncher from '../Picker/PickerLauncher'
import GearPicker from '../Picker/GearPicker'
import ItemIcon from '../Icons/ItemIcon'
import { equippedItem } from 'kolmafia'
import { $slots } from 'libram'

export default function GearBrick() {
	const gearSlots = $slots`hat, back, shirt, weapon, off-hand, pants, acc1, acc2, acc3`
	return (
		<Brick name="gear" header="Gear">
			<Wrap justify="center" spacing="1px">
				{gearSlots.map((slot) => {
					const equipped = equippedItem(slot)
					return (
						<WrapItem>
							<PickerLauncher
								WrappedPicker={GearPicker}
								pickerProps={{ slot: slot }}
							>
								<ItemIcon
									item={equipped}
									tooltipPrefix={`${slot.identifierString}: `}
								/>
							</PickerLauncher>
						</WrapItem>
					)
				})}
			</Wrap>
		</Brick>
	)
}
