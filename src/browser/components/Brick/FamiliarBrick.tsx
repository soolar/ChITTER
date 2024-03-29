import * as React from 'react'
import {
	BrowserFamiliar,
	BrowserList,
	MummeryCharacter,
} from '../../../guidelines'
import { showFam } from '../../../utils'
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
import { getExtraFamInfo, nextLevelInfo } from '../../familiarHelpers'
import ChitterIcon from '../Icons/ChitterIcon'
import MainLink from '../Link/MainLink'
import GearPicker from '../Picker/GearPicker'
import { $item, $slot } from '../../fakeLibram'

declare const familiars: BrowserList<BrowserFamiliar>

const mummeryCharacterToIconMap: { [char: MummeryCharacter]: string } = {
	['The Captain']: 'mummericon1.gif',
	Beelzebub: 'mummericon2.gif',
	['Saint Patrick']: 'mummericon3.gif',
	['Prince George']: 'mummericon4.gif',
	['Oliver Cromwell']: 'mummericon5.gif',
	['The Doctor']: 'mummericon6.gif',
	['Miss Funny']: 'mummericon7.gif',
}

export default function FamiliarBrick() {
	const currFam = familiars.active[0]

	if (currFam) {
		const nextInfo = nextLevelInfo(currFam)
		const extraInfo = getExtraFamInfo(currFam, false, false)

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
					<Heading onClick={() => showFam(currFam.id)}>{currFam.name}</Heading>
				</Tooltip>
				{extraInfo.desc && <Text>{extraInfo.desc}</Text>}
			</VStack>
		)

		const famEquip = (
			<PickerLauncher
				WrappedPicker={GearPicker}
				pickerProps={{ slot: $slot`familiar`, fam: currFam }}
			>
				<ItemIcon item={$slot`familiar`.equipped} />
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
				{currFam.mummeryCharacter && (
					<Text>Currently {currFam.mummeryCharacter}</Text>
				)}
			</VStack>
		)

		return (
			<Brick
				name="familiar"
				header={
					<Flex>
						{$item`mumming trunk`.inInventory > 0 && (
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
						)}
						<Spacer />
						<Heading>
							<Tooltip
								label={`Buffed Weight (Base Weight: ${currFam.weight}lb)`}
							>
								<span style={{ color: 'blue' }}>{currFam.buffedWeight}lb</span>
							</Tooltip>{' '}
							{currFam.type}
						</Heading>
						<Spacer />
					</Flex>
				}
				footer={
					<ProgressBar
						value={nextInfo.progress}
						max={nextInfo.goal}
						desc={`exp to ${currFam.weight + 1}lbs`}
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
