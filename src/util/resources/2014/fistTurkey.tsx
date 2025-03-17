import { $familiar, get } from 'libram'
import { FamListEntry } from '../famList'
import { Text, Tooltip } from '@chakra-ui/react'

const fistTurkey: FamListEntry = [
	$familiar`Fist Turkey`.identifierString,
	(famInfo, isTooltip) => {
		const musLeft = 5 - get('_turkeyMuscle')
		const mysLeft = 5 - get('_turkeyMyst')
		const moxLeft = 5 - get('_turkeyMoxie')
		const statsLeft = musLeft + mysLeft + moxLeft
		if (statsLeft > 0) {
			const statsLeftStr = (
				[
					[musLeft, 'mus'],
					[mysLeft, 'mys'],
					[moxLeft, 'mox'],
				] as [number, string][]
			)
				.filter((entry) => entry[0] > 0)
				.map((entry) => `${entry[0]} ${entry[1]}`)
				.join(', ')
			if (isTooltip) {
				famInfo.desc.push(<Text>{statsLeftStr} left</Text>)
			} else {
				famInfo.desc.push(
					<Tooltip label={<Text>{statsLeftStr}</Text>}>
						<Text>{statsLeft} stats left</Text>
					</Tooltip>,
				)
			}
		}
	},
]

export default fistTurkey
