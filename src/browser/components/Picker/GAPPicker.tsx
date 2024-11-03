import { Text } from '@chakra-ui/react'
import React from 'react'
import Picker from './Picker'
import ChitterOption from '../Option/ChitterOption'
import ChitterIcon from '../Icons/ChitterIcon'
import ActionLink from '../Link/ActionLink'
import { cliExecute, Effect } from 'kolmafia'
import OptionText from '../Option/OptionText'
import { $effect } from 'libram'
import { getEffectInfo } from '../../../util/effectHelpers'

interface PowerDetails {
	eff: Effect
	name: string
	img: string
	duration: number
}

interface GAPPickerArgs {
	usesRemaining: number
}

export default function GAPPicker({ usesRemaining }: GAPPickerArgs) {
	const powers: PowerDetails[] = [
		{
			eff: $effect`Super Skill`,
			name: 'skill',
			img: 'snowflakes.gif',
			duration: 5,
		},
		{
			eff: $effect`Super Structure`,
			name: 'structure',
			img: 'wallshield.gif',
			duration: 10,
		},
		{
			eff: $effect`Super Vision`,
			name: 'vision',
			img: 'xrayspecs.gif',
			duration: 20,
		},
		{
			eff: $effect`Super Speed`,
			name: 'speed',
			img: 'fast.gif',
			duration: 20,
		},
		{
			eff: $effect`Super Accuracy`,
			name: 'accuracy',
			img: 'reticle.gif',
			duration: 10,
		},
	]

	return (
		<Picker header={`Activate Super Power (${usesRemaining} left)`}>
			{powers.map((power) => {
				const effInfo = getEffectInfo(power.eff)
				return (
					<ChitterOption
						key={`gap${power.name}`}
						icon={
							<ChitterIcon
								image={power.img}
								tooltip={<Text>Super {power.name}</Text>}
							/>
						}
					>
						<ActionLink callback={() => cliExecute(`gap ${power.name}`)} dirty>
							<OptionText
								verb="Activate"
								subject={power.eff.identifierString}
								desc={`${effInfo.mods} (${power.duration} turns)`}
							/>
						</ActionLink>
					</ChitterOption>
				)
			})}
		</Picker>
	)
}
