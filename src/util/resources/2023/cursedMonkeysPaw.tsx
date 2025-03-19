import { $item, $skills, clamp, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { Text } from '@chakra-ui/react'
import MainLinkOption from '../../../browser/components/Option/MainLinkOption'
import ItemIcon from '../../../browser/components/Icons/ItemIcon'

const cursedMonkeysPaw: ItemListEntry = [
	$item`cursed monkey's paw`.identifierString,
	(itemInfo) => {
		// sorted such that index = wishes used to unlock that skill
		const pawSkills = $skills`Monkey Slap, Monkey Tickle, Evil Monkey Eye, Monkey Peace Sign, Monkey Point, Monkey Punch`
		const pawSkillDescs = [
			'Batter up-like',
			'Delevel',
			<>
				<Text className="modSpooky">Spooky damage</Text> + delevel
			</>,
			'Heal',
			'Olfaction-like',
			'Physical damage',
		]
		const wishesUsed = clamp(get('_monkeyPawWishesUsed'), 0, 5)
		itemInfo.desc.push(<Text>{wishesUsed} / 5 wishes used</Text>)
		if (wishesUsed < 5) {
			itemInfo.borderType = 'has-drops'
		}
		itemInfo.image = `monkeypaw${wishesUsed}.gif`
		itemInfo.desc.push(
			<Text>
				Current skill: {pawSkills[wishesUsed].identifierString} (
				{pawSkillDescs[wishesUsed]})
			</Text>,
		)
		if (wishesUsed < 5) {
			itemInfo.desc.push(
				<Text>
					Next skill: {pawSkills[wishesUsed + 1].identifierString} (
					{pawSkillDescs[wishesUsed + 1]})
				</Text>,
			)
			itemInfo.extraOptions.push(
				<MainLinkOption
					icon={<ItemIcon item={itemInfo.thing} />}
					href="/main.php?pwd&action=cmonk"
					verb="wish"
					subject="for an item or effect"
				/>,
			)
		}
	},
]

export default cursedMonkeysPaw
