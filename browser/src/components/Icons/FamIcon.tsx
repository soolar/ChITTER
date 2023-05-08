import * as React from 'react'
import ChitterIcon from './ChitterIcon'
import { Text, Tooltip, VStack } from '@chakra-ui/react'
import { useExtraFamInfo, useWeirdoDivContents } from '../../familiarHelpers'
import { showFam } from '../../utils'
import { Familiar, familiarWeight, toInt, toString } from 'kolmafia'

interface FamIconArgs {
	fam?: Familiar
	isBjorn?: boolean
	tooltipOverride?: React.ReactNode
}

export default function FamIcon({
	fam,
	isBjorn,
	tooltipOverride,
}: FamIconArgs) {
	if (fam) {
		const extraInfo = useExtraFamInfo(fam, true, !!isBjorn)
		const weight = familiarWeight(fam)
		const famNum = toInt(fam)
		const tooltip = tooltipOverride || (
			<VStack spacing="none">
				<Text>{fam.name}</Text>
				<Text>
					the {weight}lb {toString(fam as unknown as string)}
				</Text>
				{extraInfo.desc}
			</VStack>
		)
		const weirdoDivContents = useWeirdoDivContents(fam)

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
					showFam(famNum ?? 0)
					ev.preventDefault()
				}}
			/>
		)
	} else {
		return (
			<ChitterIcon
				image="antianti.gif"
				tooltip="You don't have a familiar with you"
			/>
		)
	}
}
