import * as React from 'react'
import { Wrap, WrapItem } from '@chakra-ui/react'
import Brick from './Brick'
import PickerLauncher from '../Picker/PickerLauncher'
import GearPicker from '../Picker/GearPicker'
import { Slot, toSlot, toString } from 'kolmafia'
//import { $slots } from 'libram'
import ItemIcon from '../Icons/ItemIcon'
import { equippedItem } from 'kolmafia'

interface GearBrickSlotIconArgs {
	slot: Slot
}

function GearBrickSlotIcon({ slot }: GearBrickSlotIconArgs) {
	const slotName = toString(slot as unknown as string)

	return (
		<WrapItem>
			<PickerLauncher WrappedPicker={GearPicker} pickerProps={{ slot }}>
				<ItemIcon item={equippedItem(slot)} tooltipPrefix={`${slotName}: `} />
			</PickerLauncher>
		</WrapItem>
	)
}

export default function GearBrick() {
	const relevantSlots = [
		//$slots`hat, back, shirt, weapon, off-hand, pants, acc1, acc2, acc3`
		toSlot('hat'),
		toSlot('back'),
		toSlot('shirt'),
		toSlot('weapon'),
		toSlot('off-hand'),
		toSlot('pants'),
		toSlot('acc1'),
		toSlot('acc2'),
		toSlot('acc3'),
	]

	return (
		<Brick name="gear" header="Gear">
			<Wrap justify="center" spacing="2px">
				{relevantSlots.map((slot) => (
					<GearBrickSlotIcon slot={slot} />
				))}
			</Wrap>
		</Brick>
	)
}