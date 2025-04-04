import { cliExecute, itemAmount, myFamiliar } from 'kolmafia'
import { $item, MummingTrunk } from 'libram'
import Picker from '../../../browser/components/Picker/Picker'
import { Flex, Text, VStack } from '@chakra-ui/react'
import ActionLink from '../../../browser/components/Link/ActionLink'
import ChitterIcon from '../../../browser/components/Icons/ChitterIcon'
import PickerLauncher from '../../../browser/components/Picker/PickerLauncher'

interface MummingCostume {
	name: string
	imagenum: number
	desc: (attributes: { [attribute: string]: boolean }) => string[]
	mainModifier: string
	cmd: string
}

const costumes: MummingCostume[] = [
	{
		name: 'The Captain',
		imagenum: 1,
		desc: (attributes) => [
			`+${attributes['hashands'] ? 30 : 15}% Meat`,
			...(attributes['undead'] ? ['25% Delevel'] : []),
		],
		mainModifier: 'Meat Drop',
		cmd: 'meat',
	},
	{
		name: 'Beelzebub',
		imagenum: 2,
		desc: (attributes) => [
			`${attributes['haswings'] ? '6-10' : '4-5'} MP/combat`,
			...(attributes['hot'] ? ['Hot damage'] : []),
		],
		mainModifier: 'MP Regen Min',
		cmd: 'mp',
	},
	{
		name: 'Saint Patrick',
		imagenum: 3,
		desc: (attributes) => [
			`+${attributes['animal'] ? 4 : 3} Mus exp`,
			...(attributes['bite'] ? ['Stagger enemy once/combat'] : []),
		],
		mainModifier: 'Muscle Experience',
		cmd: 'muscle',
	},
	{
		name: 'Prince George',
		imagenum: 4,
		desc: (attributes) => [
			`+${attributes['wearsclothes'] ? 25 : 15}% Items`,
			...(attributes['fast'] ? ['Bleed enemies'] : []),
		],
		mainModifier: 'Item Drop',
		cmd: 'item',
	},
	{
		name: 'Oliver Cromwell',
		imagenum: 5,
		desc: (attributes) => [
			`+${attributes['haseyes'] ? 4 : 3} Mys exp`,
			...(attributes['flies'] ? ['Helps you get the jump'] : []),
		],
		mainModifier: 'Mysticality Experience',
		cmd: 'myst',
	},
	{
		name: 'The Doctor',
		imagenum: 6,
		desc: (attributes) => [
			`${attributes['technological'] ? '18-20' : '8-10'} HP/combat`,
			...(attributes['evil'] ? ['Phys damage and delevel'] : []),
		],
		mainModifier: 'HP Regen Min',
		cmd: 'hp',
	},
	{
		name: 'Miss Funny',
		imagenum: 7,
		desc: (attributes) => [
			`+${attributes['sleaze'] ? 4 : 2} Mox exp`,
			...(attributes['insect'] ? ['Sleaze damage'] : []),
		],
		mainModifier: 'Moxie Experience',
		cmd: 'moxie',
	},
]

function availableCostumes() {
	const currentCostumes = MummingTrunk.currentCostumes()
	return costumes.filter(
		(costume) =>
			currentCostumes
				.values()
				.find(
					(costumeModScore) => costumeModScore[0] === costume.mainModifier,
				) === undefined,
	)
}

function activeMumming() {
	const fam = myFamiliar()
	const currCostume = MummingTrunk.currentCostumes().get(fam)
	return currCostume
		? costumes.find((costume) => costume.mainModifier === currCostume[0])
		: undefined
}

function MummingPicker() {
	const myFam = myFamiliar()
	const attributes: { [attribute: string]: boolean } = {}
	myFam.attributes.split('; ').forEach((attribute) => {
		attributes[attribute] = true
	})
	return (
		<Picker header="Pick a Costume">
			<VStack>
				{availableCostumes().map((costume) => (
					<ActionLink
						callback={() => cliExecute(`mummery ${costume.cmd}`)}
						dirty
					>
						<VStack spacing={0}>
							<Flex>
								<ChitterIcon
									image={`mummericon${costume.imagenum}.gif`}
									small
									tooltip={costume.name}
								/>
								<Text>{costume.name}</Text>
							</Flex>
							{costume.desc(attributes).map((line) => (
								<Text className="descline">{line}</Text>
							))}
						</VStack>
					</ActionLink>
				))}
			</VStack>
		</Picker>
	)
}

export default function MummingIcon() {
	const currentCostume = activeMumming()

	const attributes: { [attribute: string]: boolean } = {}
	myFamiliar()
		.attributes.split('; ')
		.forEach((attribute) => {
			attributes[attribute] = true
		})

	const costumesLeft = availableCostumes()

	const mummeryTooltip = (
		<VStack spacing="none">
			{costumesLeft.length > 0 && <Text>Pick a Mummer's Costume</Text>}
			{currentCostume && (
				<Text>
					Currently {currentCostume.name} (
					{currentCostume.desc(attributes).join(', ')})
				</Text>
			)}
			{costumesLeft.length === 0 && <Text>Out of costumes for the day</Text>}
		</VStack>
	)

	const mummeryIcon = (
		<ChitterIcon
			image={`mummericon${currentCostume?.imagenum ?? 0}.gif`}
			tooltip={mummeryTooltip}
			borderType="none"
			small
		/>
	)

	return (
		itemAmount($item`mumming trunk`) > 0 &&
		(costumesLeft.length > 0 ? (
			<PickerLauncher WrappedPicker={MummingPicker} pickerProps={{}}>
				{mummeryIcon}
			</PickerLauncher>
		) : (
			currentCostume && mummeryIcon
		))
	)
}
