import { $familiar, get } from 'libram'
import { FamListEntry } from '../famList'
import { Text } from '@chakra-ui/react'

const slimeling: FamListEntry = [
	$familiar`Slimeling`.identifierString,
	(famInfo) => {
		const fullness = get('slimelingFullness')
		const stacksDue = get('slimelingStacksDue')
		const stacksDropped = get('slimelingStacksDropped')
		const hasFullness = fullness > 0
		const hasStacksToDrop = stacksDue > 0 && stacksDue > stacksDropped
		if (hasFullness || hasStacksToDrop) {
			famInfo.desc.push(
				<>
					{hasFullness && <Text>~{fullness} fullness</Text>}
					{hasStacksToDrop && (
						<Text>
							{stacksDropped}/{stacksDue} stacks dropped
						</Text>
					)}
				</>,
			)
		}
		if (hasStacksToDrop) {
			famInfo.extraClass = stacksDropped === 0 ? 'all-drops' : 'has-drops'
		}
	},
]

export default slimeling
