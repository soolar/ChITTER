import * as React from 'react'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { BrowserList, BrowserSlot } from '../../../guidelines'
import ItemIcon from '../Icons/ItemIcon'
import Brick from './Brick'
import PickerLauncher from '../Picker/PickerLauncher'
import GearPicker from '../Picker/GearPicker'

declare const slots: BrowserList<BrowserSlot>

export default function GearBrick() {
	return (
		<Brick name="gear" header="Gear">
			<Wrap justify="center" spacing="2px">
				{slots.favorites.map((slot) => {
					return (
						<WrapItem>
							<PickerLauncher
								WrappedPicker={GearPicker}
								pickerProps={{ slot: slot }}
							>
								<ItemIcon
									item={slot.equipped}
									tooltipPrefix={`${slot.name}: `}
								/>
							</PickerLauncher>
						</WrapItem>
					)
				})}
			</Wrap>
		</Brick>
	)
}
