import React from 'react'

import ChitterIcon from './ChitterIcon'
import { Familiar, familiarWeight } from 'kolmafia'
import { Text, Tooltip, VStack } from '@chakra-ui/react'
import { $familiar } from 'libram'
import { getFamInfo, getWeirdoDivContents } from '../../../util/familiarHelpers'
import { showFam } from '../../../util'

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
		const extraInfo = getFamInfo(fam, true, style)
		const tooltip = tooltipOverride || (
			<VStack spacing="none">
				<Text>{fam.name}</Text>
				<Text>
					the {weight}lb {type}
				</Text>
				{extraInfo.desc}
			</VStack>
		)

		const weirdoDivContents = getWeirdoDivContents(fam)

		if (weirdoDivContents) {
			return <Tooltip label={tooltip}>{weirdoDivContents}</Tooltip>
		}

		return (
			<ChitterIcon
				image={fam.image}
				tooltip={tooltip}
				borderType={extraInfo.borderType}
				extraClass={extraInfo.extraClass}
				onContextMenu={(ev) => {
					showFam(fam.id)
					ev.preventDefault()
				}}
			/>
		)
	} else {
		return <ChitterIcon image="antianti.gif" tooltip={getSadMessage(style)} />
	}
}
