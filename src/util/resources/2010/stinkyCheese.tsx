import { $item, get } from 'libram'
import { ItemInfo } from '../../helpers'
import { Text } from '@chakra-ui/react'
import { ItemListEntry } from '../itemList'

function stinkyCheeseGeneral(itemInfo: ItemInfo) {
	const stinkiness = get('_stinkyCheeseCount')
	if (stinkiness < 100) {
		itemInfo.progress = { value: stinkiness, max: 100, desc: 'stinkiness' }
		itemInfo.borderType = 'has-drops'
	} else {
		itemInfo.desc.push(<Text>All stunk up</Text>)
	}
}

function stinkyCheeseEye(itemInfo: ItemInfo) {
	if (!get('_stinkyCheeseBanisherUsed')) {
		itemInfo.desc.push(<Text>Stink eye (banish) available</Text>)
	}
	stinkyCheeseGeneral(itemInfo)
}

const stinkyCheese: ItemListEntry[] = [
	[$item`stinky cheese eye`.identifierString, stinkyCheeseEye],
	[$item`stinky cheese sword`.identifierString, stinkyCheeseGeneral],
	[$item`stinky cheese diaper`.identifierString, stinkyCheeseGeneral],
	[$item`stinky cheese wheel`.identifierString, stinkyCheeseGeneral],
	[$item`Staff of Queso Escusado`.identifierString, stinkyCheeseGeneral],
]

export default stinkyCheese
