import { $item, $skill, $skills, clamp, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { Text } from '@chakra-ui/react'
import PickerOption from '../../../browser/components/Option/PickerOption'
import ItemIcon from '../../../browser/components/Icons/ItemIcon'
import SkillPicker from '../../../browser/components/Picker/SkillPicker'
import { SkillListEntry } from '../skillList'
import { SkillInfo, unusableResource } from '../../helpers'

export const designerSweatpants: ItemListEntry = [
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
				icon={<ItemIcon item={itemInfo.thing} />}
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

function handleSweat(skillInfo: SkillInfo, cost: number) {
	unusableResource(skillInfo, clamp(get('sweat'), 0, 100), cost, 'sweat')
}

export const designerSweatpantsSkills: SkillListEntry[] = [
	[
		$skill`Sip Some Sweat`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(<Text>Restore 50 MP</Text>)
			handleSweat(skillInfo, 5)
		},
	],
	[
		$skill`Drench Yourself in Sweat`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(<text>+100% Init for 5 turns</text>)
			handleSweat(skillInfo, 15)
		},
	],
	[
		$skill`Sweat Out Some Booze`.identifierString,
		(skillInfo) => {
			const usesLeft = clamp(3 - get('_sweatOutSomeBoozeUsed'), 0, 3)
			skillInfo.desc.push(<Text>Cleans 1 liver</Text>)
			if (usesLeft > 0) {
				skillInfo.desc.push(<Text>{usesLeft} left today</Text>)
			} else {
				skillInfo.desc.push(<Text>All used for the day</Text>)
				skillInfo.usable = false
			}
			handleSweat(skillInfo, 25)
		},
	],
	[
		$skill`Make Sweat-Ade`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(
				<Text>Makes a 4 spleen consumable that grants 5 PvP fights</Text>,
			)
			handleSweat(skillInfo, 50)
		},
	],
	[
		$skill`Sweat Flick`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(<Text>Deal sleaze damage equal to sweat</Text>)
			handleSweat(skillInfo, 1)
		},
	],
	[
		$skill`Sweat Spray`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(
				<Text>Deal minor sleaze damage for the rest of combat</Text>,
			)
			handleSweat(skillInfo, 3)
		},
	],
	[
		$skill`Sweat Flood`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(<Text>Stun for 5 rounds (reusable)</Text>)
			handleSweat(skillInfo, 5)
		},
	],
	[
		$skill`Sweat Sip`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(<Text>Restore 50 MP... in combat</Text>)
			handleSweat(skillInfo, 5)
		},
	],
]
