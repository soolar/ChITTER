import { $item, get } from 'libram'
import { ItemInfo } from '../../helpers'
import { Text } from '@chakra-ui/react'
import { ItemListEntry } from '../itemList'

export function navelRingFunc(itemInfo: ItemInfo) {
	const runsUsed = get('_navelRunaways')
	const freeChance =
		runsUsed < 3 ? 100 : runsUsed < 6 ? 80 : runsUsed < 9 ? 50 : 20
	itemInfo.desc.push(<Text>{freeChance}% free run chance</Text>)
	if (freeChance >= 100) {
		itemInfo.borderType = 'all-drops'
	}
}

const navelRing: ItemListEntry = [
	$item`navel ring of navel gazing`.identifierString,
	navelRingFunc,
]

export default navelRing
