import * as React from 'react'

import ChitterIcon from './ChitterIcon'
import { Familiar, familiarWeight } from 'kolmafia'
import { Text, VStack } from '@chakra-ui/react'
import { $familiar } from 'libram'

export type FamiliarVerb = 'familiar' | 'bjornify' | 'enthrone'

function getSadMessage(style: FamiliarVerb) {
	switch (style) {
		case 'familiar':
			return "You don't have a familiar with you"
		case 'bjornify':
			return "You don't have a familiar in your buddy bjorn"
		case 'enthrone':
			return "You don't have a familiar enthroned"
		default:
			return 'Something has gone wrong'
	}
}

interface FamIconArgs {
	fam?: Familiar
	style: FamiliarVerb
	tooltipOverride?: React.ReactNode
}

export default function FamIcon({ fam, style, tooltipOverride }: FamIconArgs) {
	if (fam && fam !== $familiar`none`) {
		const weight = familiarWeight(fam)
		const type = fam.identifierString
		const extraInfo = <Text>TODO: getExtraFamInfo</Text>
		const tooltip = tooltipOverride || (
			<VStack spacing="none">
				<Text>{fam.name}</Text>
				<Text>
					the {weight}lb {type}
				</Text>
				{extraInfo}
			</VStack>
		)

		// todo: weirdos

		return (
			<ChitterIcon image={fam.image} tooltip={tooltip} borderType="normal" />
		)
	} else {
		return <ChitterIcon image="antianti.gif" tooltip={getSadMessage(style)} />
	}
}
