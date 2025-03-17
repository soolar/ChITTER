import { $item, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { Text } from '@chakra-ui/react'

const juneCleaver: ItemListEntry = [
	$item`June cleaver`.identifierString,
	(itemInfo) => {
		const fightsLeft = get('_juneCleaverFightsLeft')
		if (fightsLeft === 0) {
			itemInfo.desc.push(<Text>noncom now!</Text>)
			itemInfo.borderType = 'good'
		} else {
			itemInfo.desc.push(<Text>{fightsLeft} to noncom</Text>)
		}
	},
]

export default juneCleaver
