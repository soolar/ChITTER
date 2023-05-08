import * as React from 'react'
import { showFam } from '../../utils'
import FamIcon from '../Icons/FamIcon'
import FamiliarPicker from '../Picker/FamiliarPicker'
import ItemIcon from '../Icons/ItemIcon'
import PickerLauncher from '../Picker/PickerLauncher'
import ProgressBar from '../ProgressBar'
import Brick from './Brick'
import {
	Flex,
	Heading,
	HStack,
	Spacer,
	Text,
	Tooltip,
	useBreakpointValue,
	VStack,
} from '@chakra-ui/react'
import { nextLevelInfo, useExtraFamInfo } from '../../familiarHelpers'
import ChitterIcon from '../Icons/ChitterIcon'
import MainLink from '../Link/MainLink'
import GearPicker from '../Picker/GearPicker'
//import { $item, $slot } from 'libram'
import {
	equippedItem,
	familiarWeight,
	itemAmount,
	myFamiliar,
	toInt,
	toSlot,
	toString,
	weightAdjustment,
} from 'kolmafia'

/*
const mummeryCharacterToIconMap: { [char: MummeryCharacter]: string } = {
	['The Captain']: 'mummericon1.gif',
	Beelzebub: 'mummericon2.gif',
	['Saint Patrick']: 'mummericon3.gif',
	['Prince George']: 'mummericon4.gif',
	['Oliver Cromwell']: 'mummericon5.gif',
	['The Doctor']: 'mummericon6.gif',
	['Miss Funny']: 'mummericon7.gif',
}
*/

export default function FamiliarBrick() {
	const currFam = myFamiliar()

	if (currFam) {
		const nextInfo = nextLevelInfo(currFam)
		const extraInfo = useExtraFamInfo(currFam, false, false)

		const famIcon = (
			<PickerLauncher
				WrappedPicker={FamiliarPicker}
				pickerProps={{
					type: 'default' as const,
				}}
			>
				<FamIcon fam={currFam} tooltipOverride="Pick a Familiar" />
			</PickerLauncher>
		)

		const famInfo = (
			<VStack spacing="none">
				<Tooltip label="Click for Familiar Haiku">
					<Heading onClick={() => showFam(toInt(currFam))}>
						{currFam.name}
					</Heading>
				</Tooltip>
				{extraInfo.desc && <Text>{extraInfo.desc}</Text>}
			</VStack>
		)

		const famEquip = (
			<PickerLauncher
				WrappedPicker={GearPicker}
				pickerProps={{ slot: toSlot(`familiar`), fam: currFam }}
			>
				<ItemIcon item={equippedItem(toSlot(`familiar`))} />
			</PickerLauncher>
		)

		const layout = useBreakpointValue({
			base: (
				<VStack>
					<HStack>
						{famIcon}
						{famEquip}
					</HStack>
					{famInfo}
				</VStack>
			),
			sm: (
				<Flex>
					{famIcon}
					<Spacer />
					{famInfo}
					<Spacer />
					{famEquip}
				</Flex>
			),
		})

		const mummery = (
			<VStack spacing="none">
				<Text>Pick a Mummer's Costume</Text>
				{/*currFam.mummeryCharacter && (
					<Text>Currently {currFam.mummeryCharacter}</Text>
				)*/}
			</VStack>
		)

		return (
			<Brick
				name="familiar"
				header={
					<Flex>
						{/*itemAmount($item`mumming trunk`) > 0 && (
							<MainLink href="/inv_use.php?whichitem=9592&pwd">
								<ChitterIcon
									image={
										currFam.mummeryCharacter
											? mummeryCharacterToIconMap[currFam.mummeryCharacter]
											: 'mummericon0.gif'
									}
									tooltip={mummery}
									borderType="none"
									small
								/>
							</MainLink>
						)*/}
						<Spacer />
						<Heading>
							<Tooltip
								label={`Buffed Weight (Base Weight: ${familiarWeight(
									currFam
								)}lb)`}
							>
								<span style={{ color: 'blue' }}>
									{familiarWeight(currFam) + weightAdjustment()}lb
								</span>
							</Tooltip>{' '}
							{toString(currFam as unknown as string)}
						</Heading>
						<Spacer />
					</Flex>
				}
				footer={
					<ProgressBar
						value={nextInfo.progress}
						max={nextInfo.goal}
						desc={`exp to ${familiarWeight(currFam) + 1}lbs`}
					/>
				}
			>
				{layout}
			</Brick>
		)
	} else {
		return (
			<Brick name="familiar" header={<Heading>Familiar</Heading>}>
				<Flex>
					<PickerLauncher
						WrappedPicker={FamiliarPicker}
						pickerProps={{ type: 'default' as const }}
					>
						<FamIcon tooltipOverride="Pick a Familiar" />
					</PickerLauncher>
					<Spacer />
					<Heading>(none)</Heading>
					<Spacer />
				</Flex>
			</Brick>
		)
	}
}
