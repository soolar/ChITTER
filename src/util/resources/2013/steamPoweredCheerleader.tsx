import { $familiar, get } from 'libram'
import { FamListEntry } from '../famList'
import { Text, VStack } from '@chakra-ui/react'
import ProgressBar from '../../../browser/components/ProgressBar'

const steamPoweredCheerleader: FamListEntry = [
	$familiar`Steam-Powered Cheerleader`.identifierString,
	(famInfo) => {
		const steamPercent = Math.ceil(get('_cheerleaderSteam') / 2)
		if (steamPercent > 0) {
			famInfo.desc.push(
				<VStack spacing="none">
					<Text>{steamPercent}% steam</Text>
					<ProgressBar value={steamPercent} max={100} desc="% steam" />
				</VStack>,
			)
			famInfo.extraClass = steamPercent > 50 ? 'all-drops' : 'has-drops'
		}
	},
]

export default steamPoweredCheerleader
