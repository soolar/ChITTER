import { $item, $skills, clamp, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { Text } from '@chakra-ui/react'
import PickerOption from '../../../browser/components/Option/PickerOption'
import ItemIcon from '../../../browser/components/Icons/ItemIcon'
import SkillPicker from '../../../browser/components/Picker/SkillPicker'

const designerSweatpants: ItemListEntry = [
	$item`designer sweatpants`.identifierString,
	(itemInfo) => {
		const sweat = clamp(get('sweat'), 0, 100)
		const sweatBoozeLeft = clamp(3 - get('_sweatOutSomeBoozeUsed'), 0, 3)
		itemInfo.desc.push(<Text>{sweat}% sweaty</Text>)
		if (sweatBoozeLeft > 0) {
			itemInfo.desc.push(<Text>{sweatBoozeLeft} booze sweats</Text>)
		}
		itemInfo.extraOptions.push(
			<PickerOption
				icon={<ItemIcon item={itemInfo.item} />}
				WrappedPicker={SkillPicker}
				pickerProps={{
					skills: $skills`Sip Some Sweat, Drench Yourself in Sweat, Sweat Out Some Booze, Make Sweat-Ade, Sweat Flick, Sweat Spray, Sweat Flood, Sweat Sip`,
					header: `Use some sweat (${sweat} left)`,
				}}
				verb="use"
				subject="some sweat"
			/>,
		)
	},
]

export default designerSweatpants
