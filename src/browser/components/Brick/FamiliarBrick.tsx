import * as React from 'react'
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
import {
	familiarWeight,
	itemAmount,
	myFamiliar,
	weightAdjustment,
} from 'kolmafia'
import { $item, MummingTrunk } from 'libram'
import MainLink from '../Link/MainLink'
import ChitterIcon from '../Icons/ChitterIcon'
import FamIcon from '../Icons/FamIcon'
import PickerLauncher from '../Picker/PickerLauncher'
import FamiliarPicker from '../Picker/FamiliarPicker'

export default function FamiliarBrick() {
	const currFam = myFamiliar()
	const baseWeight = familiarWeight(currFam)
	const buffedWeight = baseWeight + weightAdjustment()
	const famType = currFam.identifierString

	const famInfo = (
		<VStack spacing="none">
			<Tooltip label="Click for Familiar Haiku (TODO)">
				<Heading>{currFam.name}</Heading>
			</Tooltip>
			<Text>TODO: extra info</Text>
		</VStack>
	)

	const famIcon = (
		<PickerLauncher
			WrappedPicker={FamiliarPicker}
			pickerProps={{
				type: 'familiar' as const,
			}}
		>
			<FamIcon fam={currFam} style="familiar" />
		</PickerLauncher>
	)
	const famEquip = <Text>TODO: famEquip</Text>

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

	const costumes = MummingTrunk.currentCostumes()
	const currCostume = costumes.get(currFam)
	const costumeModifier = currCostume && currCostume[0]

	const mummeryTooltip = (
		<VStack spacing="none">
			<Text>Pick a Mummer's Costume</Text>
			{currCostume && <Text>Currently {costumeModifier}</Text>}
		</VStack>
	)

	return currFam ? (
		<Brick
			name="familiar"
			header={
				<Flex>
					{itemAmount($item`mumming trunk`) > 0 && (
						<MainLink href="/inv_use.php?whichitem=9592&pwd">
							<ChitterIcon
								image="mummericon0.gif"
								tooltip={mummeryTooltip}
								borderType="none"
								small
							/>
						</MainLink>
					)}
					<Spacer />
					<Heading>
						<Tooltip label={`Buffed Weight (Base Weight: ${baseWeight}lb)`}>
							<Text as="span" color="blue">
								{buffedWeight}lb
							</Text>
						</Tooltip>{' '}
						{famType}
					</Heading>
					<Spacer />
				</Flex>
			}
			footer={<Text>TODO: ProgressBar with fam xp</Text>}
		>
			{layout}
		</Brick>
	) : (
		<Brick name="familiar" header={<Heading>Familiar</Heading>}>
			<Flex>
				<Text>TODO: FamIcon with PickerLauncher</Text>
				<Spacer />
				<Heading>(none)</Heading>
				<Spacer />
			</Flex>
		</Brick>
	)
}
