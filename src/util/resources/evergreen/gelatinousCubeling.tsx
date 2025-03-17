import { $familiar, $item, get } from 'libram'
import { FamListEntry } from '../famList'
import { Text, VStack } from '@chakra-ui/react'
import ProgressBar from '../../../browser/components/ProgressBar'
import { availableAmount } from 'kolmafia'

const gelatinousCubeling: FamListEntry = [
	$familiar`Gelatinous Cubeling`.identifierString,
	(famInfo) => {
		const progress = get('cubelingProgress')
		famInfo.desc.push(
			<VStack spacing="none">
				<Text>{progress}/12 to drop</Text>
				<ProgressBar value={progress} max={12} desc="progress" />
			</VStack>,
		)
		const needs = [
			{ name: 'Pole', item: $item`eleven-foot pole` },
			{ name: 'Ring', item: $item`ring of Detect Boring Doors` },
			{ name: 'Pick', item: $item`Pick-O-Matic lockpicks` },
		].filter((need) => availableAmount(need.item) < 1)
		if (needs.length > 0) {
			famInfo.desc.push(
				<Text>Need {needs.map((need) => need.name).join(', ')}</Text>,
			)
			famInfo.extraClass = 'all-drops'
		}
	},
]

export default gelatinousCubeling
