import { $item, $slot } from 'libram'
import { ItemListEntry } from '../itemList'
import { evaluatedModifiers } from '../..'
import { equippedItem } from 'kolmafia'

const alicesArmy: ItemListEntry = [
	$item`card sleeve`.identifierString,
	(itemInfo) => {
		itemInfo.mods += `, ${evaluatedModifiers(equippedItem($slot`card-sleeve`))}`
	},
]

export default alicesArmy
