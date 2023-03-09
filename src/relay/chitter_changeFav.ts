import { getProperty, Item, setProperty } from 'kolmafia'

export default function main(action: string, pref: string, targetName: string) {
	let favs = getProperty(pref)
		.split('|')
		.map((name) => Item.get(name))
	const target = Item.get(targetName)
	if (action === 'add') {
		favs.push(target)
	} else {
		favs = favs.filter((it) => it !== target)
	}

	setProperty(pref, favs.map((it) => it.name).join('|'))
}
