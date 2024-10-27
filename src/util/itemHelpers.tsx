import React from 'react'
import { BorderType } from '../browser/components/Icons/ChitterIcon'
import {
	availableAmount,
	closetAmount,
	creatableAmount,
	getRelated,
	Item,
	itemAmount,
	myBjornedFamiliar,
	myEnthronedFamiliar,
	pullsRemaining,
	storageAmount,
	stringModifier,
	toItem,
	weaponHands,
} from 'kolmafia'
import { $familiar, $item } from 'libram'
import { parseMods } from '.'
import { getFamInfo } from './familiarHelpers'
import PickerOption from '../browser/components/Option/PickerOption'
import ItemIcon from '../browser/components/Icons/ItemIcon'
import FamiliarPicker from '../browser/components/Picker/FamiliarPicker'

type EquipVerb =
	| 'equip'
	| 'uncloset'
	| 'fold'
	| 'create'
	| 'pull'
	| 'somehow equip'

export function foldableAmount(item: Item) {
	return Object.keys(getRelated(item, 'fold'))
		.filter((foldableName) => foldableName !== item.identifierString)
		.map((foldableName) => toItem(foldableName))
		.reduce((partial, foldable) => partial + availableAmount(foldable), 0)
}

interface ItemInfo {
	displayName: string
	desc: React.ReactNode[]
	mods: string
	extraOptions: React.ReactNode[]
	image: string
	extraClass?: string
	borderType: BorderType
	equipVerb: EquipVerb
}

interface GetItemInfoOptionalArgs {
	namePrefix?: string
	iconOverride?: string
	forEquipping?: boolean
}

export function getItemInfo(
	item?: Item,
	optionals: GetItemInfoOptionalArgs = {},
): ItemInfo {
	const isSomething = item && item !== $item.none
	const name = isSomething ? item.name : 'empty'
	const mods = isSomething ? stringModifier(item, 'Evaluated Modifiers') : ''
	const res: ItemInfo = {
		displayName: optionals.namePrefix ? `${optionals.namePrefix}${name}` : name,
		desc: [],
		mods,
		extraOptions: [],
		image: optionals.iconOverride || (isSomething ? item.image : 'blank.gif'),
		borderType: 'normal',
		equipVerb: 'equip',
	}

	if (!isSomething) {
		return res
	}

	const hands = weaponHands(item)
	if (hands > 1) {
		res.displayName = `${res.displayName} (${hands}h)`
	}

	switch (item.identifierString) {
		case $item`Buddy Bjorn`.identifierString: {
			const bjornFam = myBjornedFamiliar()
			if (bjornFam !== $familiar.none) {
				res.image = bjornFam.image
				const bjornInfo = getFamInfo(bjornFam, true, 'bjornify')
				res.desc.push(...bjornInfo.desc)
			}
			res.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={item} />}
					WrappedPicker={FamiliarPicker}
					pickerProps={{ type: 'bjornify' as const }}
					verb="pick"
					subject="a rider"
				/>,
			)
			break
		}
		case $item`Crown of Thrones`.identifierString: {
			const throneFam = myEnthronedFamiliar()
			if (throneFam !== $familiar.none) {
				res.image = throneFam.image
				const throneInfo = getFamInfo(throneFam, true, 'enthrone')
				res.desc.push(...throneInfo.desc)
			}
			res.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={item} />}
					WrappedPicker={FamiliarPicker}
					pickerProps={{ type: 'enthrone' as const }}
					verb="pick"
					subject="a rider"
				/>,
			)
			break
		}
	}

	const inv = itemAmount(item)
	if (inv === 0 && optionals.forEquipping) {
		const clos = closetAmount(item)
		const fold = foldableAmount(item)
		const storage = storageAmount(item)
		const pulls = pullsRemaining()
		const make = creatableAmount(item)
		if (clos > 0) {
			res.equipVerb = 'uncloset'
		} else if (fold > 0) {
			res.equipVerb = 'fold'
		} else if (storage > 0 && pulls === -1) {
			res.equipVerb = 'pull'
		} else if (make > 0) {
			res.equipVerb = 'create'
			res.borderType = 'warning'
		} else if (storage > 0 && pulls > 0) {
			res.equipVerb = 'pull'
			res.borderType = 'danger'
		} else {
			res.equipVerb = 'somehow equip'
		}
	}

	res.mods = parseMods(res.mods)

	return res
}
