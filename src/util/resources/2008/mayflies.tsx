import { $item, clamp, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { Text } from '@chakra-ui/react'

const mayflies: ItemListEntry = [
	$item`mayfly bait necklace`.identifierString,
	(itemInfo) => {
		const fliesSummoned = clamp(get('_mayflySummons'), 0, 30)
		if (fliesSummoned < 30) {
			itemInfo.borderType = 'has-drops'
		}
		itemInfo.desc.push(<Text>{fliesSummoned} / 30 swarms summoned</Text>)
	},
]

export default mayflies
