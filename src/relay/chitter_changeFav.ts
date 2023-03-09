import { Item, print, setProperty } from 'kolmafia'
import { getPropVal } from '../properties'

export default function main(action: string, pref: string, targetName: string) {
	let favs = getPropVal(pref)
	if (!Array.isArray(favs)) {
		print(`something has gone wrong with the chit property chit.${pref}`, 'red')
		return
	}
	const target = Item.get(targetName)
	if (action === 'add') {
		favs.push(target)
	} else {
		favs = favs.filter((it) => it !== target)
	}
	// just in case
	favs = favs.filter((fav) => fav instanceof Item)

	const newVal = favs.map((it) => (it as Item).name).join('|')
	setProperty(`chit.${pref}`, newVal)
}
