import { $item, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { evaluatedModifiers } from '../..'

const edpiece: ItemListEntry = [
	$item`The Crown of Ed the Undying`.identifierString,
	(itemInfo) => {
		itemInfo.mods += `, ${evaluatedModifiers(`Edpiece:${get('edPiece')}`)}`
	},
]

export default edpiece
