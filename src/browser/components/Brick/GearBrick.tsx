import * as React from 'react'
import { Flex, Heading } from '@chakra-ui/react'
import { BrowserList, BrowserSlot } from '../../../guidelines'
import ItemIcon from '../Icons/ItemIcon'
import Brick from './Brick'

declare const slots: BrowserList<BrowserSlot>

export default function GearBrick() {
	return (
		<Brick name="gear" header={<Heading>Gear</Heading>}>
			<Flex>
				{slots.favorites.map((slot) => {
					return (
						<ItemIcon
							item={slot.equipped}
							tooltipOverride={`${slot.name}: ${slot.equipped.name}`}
						/>
					)
				})}
			</Flex>
		</Brick>
	)
}
