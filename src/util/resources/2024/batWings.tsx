import { $item, $skill, get } from 'libram'
import { ItemListEntry } from '../itemList'
import SkillOption from '../../../browser/components/Option/SkillOption'
import { SkillListEntry } from '../skillList'
import { Text } from '@chakra-ui/react'

const batWings: ItemListEntry = [
	$item`bat wings`.identifierString,
	(itemInfo) => {
		itemInfo.dropsInfo.push(
			{
				drop: 'free fight',
				dropped: get('_batWingsFreeFights'),
				limit: 5,
				important: true,
			},
			{ drop: 'rest', dropped: get('_batWingsRestUsed'), limit: 11 },
			{ drop: 'cauldron', dropped: get('_batWingsCauldronUsed'), limit: 11 },
			{
				drop: 'swoop',
				dropped: get('_batWingsSwoopUsed'),
				limit: 11,
				important: true,
			},
		)
		if (get('_batWingsRestUsed') < 11) {
			itemInfo.extraOptions.push(
				<SkillOption skill={$skill`Rest upside down`} />,
			)
		}
	},
]

export default batWings

export const batWingsSkills: SkillListEntry[] = [
	[
		$skill`Rest upside down`.identifierString,
		(skillInfo) => {
			skillInfo.desc.push(<Text>Restore 1000 HP/MP</Text>)
		},
	],
]
