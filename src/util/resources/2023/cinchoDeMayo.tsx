import { $item, $skill, $skills, clamp, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { ItemInfo, SkillInfo, unusableResource } from '../../helpers'
import { totalFreeRests } from 'kolmafia'
import { Text } from '@chakra-ui/react'
import PickerOption from '../../../browser/components/Option/PickerOption'
import ItemIcon from '../../../browser/components/Icons/ItemIcon'
import SkillPicker from '../../../browser/components/Picker/SkillPicker'
import { SkillListEntry } from '../skillList'

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
			icon={<ItemIcon item={itemInfo.thing} />}
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

export const cinchoDeMayo: ItemListEntry[] = [
	[$item`Cincho de Mayo`.identifierString, cinchoFunc],
	[$item`replica Cincho de Mayo`.identifierString, cinchoFunc],
]

function handleCinch(skillInfo: SkillInfo, cost: number) {
	unusableResource(
		skillInfo,
		100 - clamp(get('_cinchUsed'), 0, 100),
		cost,
		'cinch',
	)
}

export const cinchoDeMayoSkills: SkillListEntry[] = [
	[
		$skill`Cincho: Confetti Extravaganza`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(
				<Text>Double substats from this fight, but get smacked</Text>,
			)
			handleCinch(skillInfo, 5)
		},
	],
	[
		$skill`Cincho: Dispense Salt and Lime`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(<Text>Triples stat gain from next drink</Text>)
			handleCinch(skillInfo, 25)
		},
	],
	[
		$skill`Cincho: Fiesta Exit`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(<Text>Force a noncom</Text>)
			handleCinch(skillInfo, 60)
		},
	],
	[
		$skill`Cincho: Party Foul`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(<Text>Damage, weaken, and stun</Text>)
			handleCinch(skillInfo, 5)
		},
	],
	[
		$skill`Cincho: Party Soundtrack`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(<Text>30 adv +5lbs fam weight</Text>)
			handleCinch(skillInfo, 25)
		},
	],
	[
		$skill`Cincho: Projectile Piñata`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(<Text>Damage, stun, and get candy</Text>)
			handleCinch(skillInfo, 5)
		},
	],
]
