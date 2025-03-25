import Brick from './Brick'
import { Wrap, WrapItem } from '@chakra-ui/react'
import PickerLauncher from '../Picker/PickerLauncher'
import GearPicker from '../Picker/GearPicker'
import ItemIcon from '../Icons/ItemIcon'
import { equippedItem, haveSkill } from 'kolmafia'
import { $skill, $slot, $slots } from 'libram'
import ChitterIcon from '../Icons/ChitterIcon'

export default function GearBrick() {
	const gearSlots = $slots`hat, back, shirt, weapon, off-hand, pants, acc1, acc2, acc3`
	return (
		<Brick name="gear" header="Gear">
			<Wrap justify="center" spacing="1px">
				{gearSlots.map((slot) => {
					const equipped = equippedItem(slot)
					const canEquip =
						slot !== $slot`shirt` || haveSkill($skill`Torso Awareness`)
					return (
						<WrapItem>
							{canEquip ? (
								<PickerLauncher
									WrappedPicker={GearPicker}
									pickerProps={{ slot: slot }}
								>
									<ItemIcon
										item={equipped}
										tooltipPrefix={`${slot.identifierString}: `}
									/>
								</PickerLauncher>
							) : (
								<ChitterIcon image="antianti.gif" tooltip="Torso Unawareness" />
							)}
						</WrapItem>
					)
				})}
			</Wrap>
		</Brick>
	)
}
