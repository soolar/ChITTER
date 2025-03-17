import { $item, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { Text } from '@chakra-ui/react'

const vMask: ItemListEntry = [
	$item`V for Vivala mask`.identifierString,
	(itemInfo) => {
		const advGained = get('_vmaskAdv')
		itemInfo.desc.push(<Text>{advGained} / 10 adv gained</Text>)
		if (advGained < 10) {
			itemInfo.borderType = 'has-drops'
		}
	},
]

export default vMask
