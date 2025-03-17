import { $item, $modifiers, $slots } from 'libram'
import { ItemListEntry } from '../itemList'
import { ItemInfo } from '../../helpers'
import { equippedItem, Item, Modifier } from 'kolmafia'

function sniffFunc(itemInfo: ItemInfo) {
	function stickerAmount(sticker: Item) {
		return $slots`sticker1, sticker2, sticker3`.reduce(
			(acc, slot) => acc + (equippedItem(slot) === sticker ? 1 : 0),
			0,
		)
	}
	function addSticker(sticker: Item, value: number, modifiers: Modifier[]) {
		const sa = stickerAmount(sticker)
		if (sa > 0) {
			modifiers.forEach((modifier) => {
				itemInfo.mods += `, ${modifier.identifierString}: +${sa * value}`
			})
		}
	}
	addSticker(
		$item`scratch 'n' sniff unicorn sticker`,
		25,
		$modifiers`Item Drop`,
	)
	addSticker($item`scratch 'n' sniff apple sticker`, 2, $modifiers`Experience`)
	addSticker($item`scratch 'n' sniff UPC sticker`, 25, $modifiers`Meat Drop`)
	addSticker(
		$item`scratch 'n' sniff wrestler sticker`,
		10,
		$modifiers`Muscle Percent, Mysticality Percent, Moxie Percent`,
	)
	addSticker(
		$item`scratch 'n' sniff dragon sticker`,
		3,
		$modifiers`Hot Damage, Cold Damage, Stench Damage, Spooky Damage, Sleaze Damage`,
	)
	addSticker(
		$item`scratch 'n' sniff rock band sticker`,
		20,
		$modifiers`Weapon Damage, Spell Damage`,
	)
	itemInfo.mods += ', Breakable'
}

const scratchNSniff: ItemListEntry[] = [
	[$item`scratch 'n' sniff sword`.identifierString, sniffFunc],
	[$item`scratch 'n' sniff crossbow`.identifierString, sniffFunc],
]

export default scratchNSniff
