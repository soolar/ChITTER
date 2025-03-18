import { $effects, $item, get, have } from 'libram'
import { ItemListEntry } from '../itemList'
import { Effect, haveEffect, myClass } from 'kolmafia'
import PickerOption from '../../../browser/components/Option/PickerOption'
import ItemIcon from '../../../browser/components/Icons/ItemIcon'
import EffectListPseudoPicker from '../../../browser/components/Picker/EffectListPseudoPicker'
import MainLinkOption from '../../../browser/components/Option/MainLinkOption'
import { getEffectInfo } from '../../helpers'
import { Text } from '@chakra-ui/react'

const daylightShavings: ItemListEntry = [
	$item`Daylight Shavings Helmet`.identifierString,
	(itemInfo) => {
		const beards = $effects`Spectacle Moustache, Toiletbrush Moustache, Barbell Moustache, Grizzly Beard, Surrealist's Moustache, Musician's Musician's Moustache, Gull-Wing Moustache, Space Warlord's Beard, Pointy Wizard Beard, Cowboy Stache, Friendly Chops`
		const beardOrder: Effect[] = []
		const classId = myClass().id
		const classIdMod = classId <= 6 ? classId : (classId + 1) % 6
		const lastBeardId = get('lastBeardBuff')
		const lastBeard = beards.find((beard) => beard.id === lastBeardId)
		const currBeard = beards.find((beard) => have(beard))
		for (let i = 0; i < 11; ++i) {
			beardOrder[i] = beards[(classIdMod * i) % 11]
		}
		const lastBeardPos = beardOrder.indexOf(
			currBeard ?? lastBeard ?? beardOrder[0],
		)
		const nextBeard = beardOrder[(lastBeardPos + 1) % 11]
		const offsetBeardOrder: Effect[] = []
		const beardOffset = currBeard ? lastBeardPos : lastBeardPos + 1
		for (let i = 0; i < 11; ++i) {
			offsetBeardOrder[i] = beardOrder[(i + beardOffset) % 11]
		}
		itemInfo.extraOptions.push(
			<PickerOption
				icon={<ItemIcon item={itemInfo.item} />}
				WrappedPicker={EffectListPseudoPicker}
				pickerProps={{
					header: 'Beard schedule',
					effects: offsetBeardOrder,
					enabled: (eff: Effect) => eff !== currBeard,
				}}
				verb="check"
				subject="upcoming beards"
			/>,
		)
		itemInfo.extraOptions.push(
			<MainLinkOption
				icon={<ItemIcon item={itemInfo.item} />}
				verb="adjust"
				subject="your facial hair"
				href="/account_facialhair.php"
			/>,
		)
		const nextBeardInfo = getEffectInfo(nextBeard)
		itemInfo.desc.push(
			<Text
				dangerouslySetInnerHTML={{
					__html: `${nextBeard.name} [${nextBeardInfo.mods}] due ${currBeard ? `in ${haveEffect(currBeard)} turns` : 'now'}`,
				}}
			/>,
		)
		if (!currBeard) {
			itemInfo.borderType = 'good'
		}
	},
]

export default daylightShavings
