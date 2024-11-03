import { Text } from '@chakra-ui/react'
import React from 'react'
import Picker from './Picker'
import ChitterOption from '../Option/ChitterOption'
import ChitterIcon from '../Icons/ChitterIcon'
import ActionLink from '../Link/ActionLink'
import { cliExecute } from 'kolmafia'
import OptionText from '../Option/OptionText'

interface PowerDetails {
	name: string
	desc: string
	img: string
	duration: number
}

const powers: PowerDetails[] = [
	{
		name: 'Skill',
		desc: 'Combat Skills/Spells cost 0 MP',
		img: 'snowflakes.gif',
		duration: 5,
	},
	{
		name: 'Structure',
		desc: '+500 DA, +5 Primatic Res',
		img: 'wallshield.gif',
		duration: 10,
	},
	{
		name: 'Vision',
		desc: '+25% Item Drops',
		img: 'xrayspecs.gif',
		duration: 20,
	},
	{
		name: 'Speed',
		desc: '+100% Mox',
		img: 'fast.gif',
		duration: 20,
	},
	{
		name: 'Accuracy',
		desc: '+30% Crit Chance',
		img: 'reticle.gif',
		duration: 10,
	},
]

interface GAPPickerArgs {
	usesRemaining: number
}

export default function GAPPicker({ usesRemaining }: GAPPickerArgs) {
	return (
		<Picker header={`Activate Super Power (${usesRemaining} left)`}>
			{powers.map((power) => (
				<ChitterOption
					key={`gap${power.name}`}
					icon={
						<ChitterIcon
							image={power.img}
							tooltip={<Text>Super {power.name}</Text>}
						/>
					}
				>
					<ActionLink
						callback={() => cliExecute(`gap ${power.name.toLowerCase()}`)}
					>
						<OptionText
							verb="Activate"
							subject={`Super ${power.name}`}
							desc={power.desc}
						/>
					</ActionLink>
				</ChitterOption>
			))}
		</Picker>
	)
}
