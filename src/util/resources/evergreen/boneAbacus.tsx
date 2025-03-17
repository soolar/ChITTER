import { $item, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { Text } from '@chakra-ui/react'

const boneAbacus: ItemListEntry = [
	$item`bone abacus`.identifierString,
	(itemInfo) => {
		const victories = get('boneAbacusVictories')
		if (victories < 1000) {
			itemInfo.desc.push(<Text>{victories} / 1000 wins</Text>)
			itemInfo.borderType = 'has-drops'
		} else {
			itemInfo.desc.push(<Text>You did it!</Text>)
		}
	},
]

export default boneAbacus
