import { $item, clamp, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { Text } from '@chakra-ui/react'

const pantsgiving: ItemListEntry = [
	$item`Pantsgiving`.identifierString,
	(itemInfo) => {
		const turnsUsed = get('_pantsgivingCount')
		const fullnessGained = get('_pantsgivingFullness')
		let turnsNeeded = 5
		for (let i = 0; i < fullnessGained; ++i) {
			turnsNeeded *= 10
		}
		if (turnsUsed < turnsNeeded) {
			itemInfo.progress = {
				value: turnsUsed,
				max: turnsNeeded,
				desc: 'to next fullness',
			}
		} else {
			itemInfo.desc.push(<Text>Fullness ready!</Text>)
			itemInfo.borderType = 'good'
		}
		const crumbs = 10 - clamp(get('_pantsgivingCrumbs'), 0, 10)
		const banishes = 5 - clamp(get('_pantsgivingBanish'), 0, 5)
		if (crumbs > 0) {
			itemInfo.desc.push(<Text>{crumbs} crumbs left</Text>)
		}
		if (banishes > 0) {
			itemInfo.desc.push(<Text>{banishes} banishes left</Text>)
		}
	},
]

export default pantsgiving
