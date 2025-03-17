import { $familiar, $item } from 'libram'
import { getFamInfo, ItemInfo } from '../../helpers'
import { myBjornedFamiliar, myEnthronedFamiliar } from 'kolmafia'
import PickerOption from '../../../browser/components/Option/PickerOption'
import FamiliarPicker from '../../../browser/components/Picker/FamiliarPicker'
import ItemIcon from '../../../browser/components/Icons/ItemIcon'
import { ItemListEntry } from '../itemList'

export type CarryVerb = 'enthrone' | 'bjornify'

export function carrierFunc(itemInfo: ItemInfo, verb: CarryVerb) {
	const carriedFam =
		verb === 'bjornify' ? myBjornedFamiliar() : myEnthronedFamiliar()
	if (carriedFam !== $familiar.none) {
		itemInfo.image = carriedFam.image
		const carriedInfo = getFamInfo(carriedFam, true, verb)
		itemInfo.desc.push(...carriedInfo.desc)
		itemInfo.borderType = carriedInfo.borderType
	}
	itemInfo.extraOptions.push(
		<PickerOption
			icon={<ItemIcon item={itemInfo.item} />}
			WrappedPicker={FamiliarPicker}
			pickerProps={{ type: verb }}
			verb="pick"
			subject="a rider"
		/>,
	)
}

const crownOfThrones: ItemListEntry = [
	$item`Crown of Thrones`.identifierString,
	(itemInfo: ItemInfo) => {
		carrierFunc(itemInfo, 'enthrone')
	},
]

export default crownOfThrones
