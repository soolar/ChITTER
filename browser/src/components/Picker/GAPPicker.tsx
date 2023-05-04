import { Button, Text } from '@chakra-ui/react'
import * as React from 'react'
import ChitterIcon from '../Icons/ChitterIcon'
import ChitterOption from '../Option/ChitterOption'
import OptionText from '../Option/OptionText'
import Picker from './Picker'

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
		desc: '+500 DA, +5 Prismatic resistance',
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
		desc: '+100% Moxie',
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
					icon={
						<ChitterIcon
							image={power.img}
							tooltip={<Text>Super {power.name}</Text>}
						/>
					}
				>
					<Button variant="link">
						<OptionText
							verb="Activate"
							subject={`Super ${power.name}`}
							desc={power.desc}
						/>
					</Button>
				</ChitterOption>
			))}
		</Picker>
	)
}
