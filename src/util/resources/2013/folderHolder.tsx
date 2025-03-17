import { $item, $slots } from 'libram'
import { ItemListEntry } from '../itemList'
import { evaluatedModifiers } from '../..'
import { equippedItem } from 'kolmafia'

const folderHolder: ItemListEntry = [
	$item`over-the-shoulder Folder Holder`.identifierString,
	(itemInfo) => {
		$slots`folder1, folder2, folder3, folder4, folder5`.forEach((folder) => {
			itemInfo.mods += `, ${evaluatedModifiers(equippedItem(folder))}`
		})
	},
]

export default folderHolder
