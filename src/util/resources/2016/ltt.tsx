import { $item, $slots } from 'libram'
import { ItemListEntry } from '../itemList'
import { evaluatedModifiers } from '../..'
import { equippedItem } from 'kolmafia'

const ltt: ItemListEntry = [
	$item`your cowboy boots`.identifierString,
	(itemInfo) => {
		$slots`bootskin, bootspur`.forEach(
			(slot) =>
				(itemInfo.mods += `, ${evaluatedModifiers(equippedItem(slot))}`),
		)
	},
]

export default ltt
