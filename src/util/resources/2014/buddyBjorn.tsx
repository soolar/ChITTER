import { $item } from 'libram'
import { ItemListEntry } from '../itemList'
import { carrierFunc } from '../2010/crownOfThrones'

const buddyBjorn: ItemListEntry = [
	$item`Buddy Bjorn`.identifierString,
	(itemInfo) => {
		carrierFunc(itemInfo, 'bjornify')
	},
]

export default buddyBjorn
