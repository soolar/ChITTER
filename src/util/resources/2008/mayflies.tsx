import { $item, clamp, get } from 'libram'
import { ItemListEntry } from '../itemList'

const mayflies: ItemListEntry = [
	$item`mayfly bait necklace`.identifierString,
	(itemInfo) => {
		const fliesSummoned = clamp(get('_mayflySummons'), 0, 30)
		if (fliesSummoned < 30) {
			itemInfo.borderType = 'has-drops'
		}
		itemInfo.progress = {
			value: fliesSummoned,
			max: 30,
			desc: 'swarms summoned',
		}
	},
]

export default mayflies
