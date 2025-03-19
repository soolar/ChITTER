import ChitterIcon from './ChitterIcon'
import { Familiar, familiarWeight } from 'kolmafia'
import { Text, Tooltip, VStack } from '@chakra-ui/react'
import { $familiar } from 'libram'
import { getFamInfo } from '../../../util/helpers'
import { showFam } from '../../../util'
import { CarryVerb } from '../../../util/resources/2010/crownOfThrones'

export type FamiliarVerb = 'familiar' | CarryVerb

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

		if (extraInfo.weirdoDiv) {
			return <Tooltip label={tooltip}>{extraInfo.weirdoDiv}</Tooltip>
		}

		return (
			<ChitterIcon
				image={extraInfo.image}
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
