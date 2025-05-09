import { $familiar, $item, clamp, get } from 'libram'
import { FamListEntry } from '../famList'
import { Text } from '@chakra-ui/react'
import { availableAmount } from 'kolmafia'

const gelatinousCubeling: FamListEntry = [
	$familiar`Gelatinous Cubeling`.identifierString,
	(famInfo) => {
		const progress = clamp(get('cubelingProgress'), 0, 12)
		famInfo.progress.push({
			value: progress,
			max: 12,
			desc: 'to drop',
		})
		const needs = [
			{ name: 'Pole', item: $item`eleven-foot pole` },
			{ name: 'Ring', item: $item`ring of Detect Boring Doors` },
			{ name: 'Pick', item: $item`Pick-O-Matic lockpicks` },
		].filter((need) => availableAmount(need.item) === 0)
		if (needs.length > 0) {
			famInfo.desc.push(
				<Text>Need {needs.map((need) => need.name).join(', ')}</Text>,
			)
			famInfo.extraClass = 'all-drops'
		}
	},
]

export default gelatinousCubeling
