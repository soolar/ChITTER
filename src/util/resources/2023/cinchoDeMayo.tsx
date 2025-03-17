import { $item, $skills, clamp, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { ItemInfo } from '../../helpers'
import { totalFreeRests } from 'kolmafia'
import { Text } from '@chakra-ui/react'
import PickerOption from '../../../browser/components/Option/PickerOption'
import ItemIcon from '../../../browser/components/Icons/ItemIcon'
import SkillPicker from '../../../browser/components/Picker/SkillPicker'

function cinchoFunc(itemInfo: ItemInfo) {
	const cinch = 100 - clamp(get('_cinchUsed'), 0, 100)
	const restsTaken = get('_cinchoRests')
	const cinchToGain = clamp(30 - 5 * (restsTaken - 4), 5, 30)
	const freeRestsLeft = totalFreeRests() - get('timesRested')
	const cinchWasted = cinchToGain + cinch - 100
	itemInfo.desc.push(<Text>{cinch} cinch available</Text>)
	itemInfo.desc.push(
		<Text>
			{restsTaken} rests taken, will gain {cinchToGain} cinch{' '}
			{cinchWasted > 0 && `(wasting ${cinchWasted})`}
		</Text>,
	)
	itemInfo.desc.push(
		<Text>{freeRestsLeft > 0 ? freeRestsLeft : 'no'} free rests left</Text>,
	)
	itemInfo.extraOptions.push(
		<PickerOption
			icon={<ItemIcon item={itemInfo.item} />}
			WrappedPicker={SkillPicker}
			pickerProps={{
				skills: $skills`Cincho: Confetti Extravaganza, Cincho: Dispense Salt and Lime, Cincho: Fiesta Exit, Cincho: Party Foul, Cincho: Party Soundtrack, Cincho: Projectile Piñata`,
				header: `Use some cinch (${cinch} available)`,
			}}
			verb="use"
			subject="some cinch"
		/>,
	)
}

const cinchoDeMayo: ItemListEntry[] = [
	[$item`Cincho de Mayo`.identifierString, cinchoFunc],
	[$item`replica Cincho de Mayo`.identifierString, cinchoFunc],
]

export default cinchoDeMayo
