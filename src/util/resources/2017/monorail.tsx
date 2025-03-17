import { $item, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { Text } from '@chakra-ui/react'

const monorail: ItemListEntry = [
	$item`mafia thumb ring`.identifierString,
	(itemInfo) => {
		const thumbAdvs = get('_mafiaThumbRingAdvs')
		itemInfo.desc.push(<Text>{thumbAdvs} adv gained</Text>)
	},
]

export default monorail
