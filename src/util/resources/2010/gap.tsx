import { $item, clamp, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { Text } from '@chakra-ui/react'
import PickerOption from '../../../browser/components/Option/PickerOption'
import ItemIcon from '../../../browser/components/Icons/ItemIcon'
import { navelRingFunc } from '../2007/navelRing'
import GAPPicker from '../../../browser/components/Picker/GAPPicker'

const gap: ItemListEntry = [
	$item`Greatest American Pants`.identifierString,
	(itemInfo) => {
		const buffsLeft = 5 - clamp(get('_gapBuffs'), 0, 5)
		if (buffsLeft > 0) {
			itemInfo.desc.push(<Text>{buffsLeft} super powers</Text>)
			itemInfo.borderType = 'has-drops'
			itemInfo.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={itemInfo.item} />}
					verb="activate"
					subject="super power"
					WrappedPicker={GAPPicker}
					pickerProps={{ usesRemaining: buffsLeft }}
				/>,
			)
		}
		navelRingFunc(itemInfo)
	},
]

export default gap
