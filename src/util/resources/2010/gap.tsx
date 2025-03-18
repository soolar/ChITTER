import { $effect, $item, clamp, get } from 'libram'
import { ItemListEntry } from '../itemList'
import { Text } from '@chakra-ui/react'
import PickerOption from '../../../browser/components/Option/PickerOption'
import ItemIcon from '../../../browser/components/Icons/ItemIcon'
import { navelRingFunc } from '../2007/navelRing'
import { cliExecute, Effect } from 'kolmafia'
import Picker from '../../../browser/components/Picker/Picker'
import { getEffectInfo } from '../../helpers'
import ChitterOption from '../../../browser/components/Option/ChitterOption'
import ChitterIcon from '../../../browser/components/Icons/ChitterIcon'
import ActionLink from '../../../browser/components/Link/ActionLink'
import OptionText from '../../../browser/components/Option/OptionText'
import { EffectListEntry } from '../effectList'

interface PowerDetails {
	eff: Effect
	name: string
	img: string
	duration: number
}

interface GAPPickerArgs {
	usesRemaining: number
}

function GAPPicker({ usesRemaining }: GAPPickerArgs) {
	const powers: PowerDetails[] = [
		{
			eff: $effect`Super Skill`,
			name: 'skill',
			img: 'snowflakes.gif',
			duration: 5,
		},
		{
			eff: $effect`Super Structure`,
			name: 'structure',
			img: 'wallshield.gif',
			duration: 10,
		},
		{
			eff: $effect`Super Vision`,
			name: 'vision',
			img: 'xrayspecs.gif',
			duration: 20,
		},
		{
			eff: $effect`Super Speed`,
			name: 'speed',
			img: 'fast.gif',
			duration: 20,
		},
		{
			eff: $effect`Super Accuracy`,
			name: 'accuracy',
			img: 'reticle.gif',
			duration: 10,
		},
	]

	return (
		<Picker header={`Activate Super Power (${usesRemaining} left)`}>
			{powers.map((power) => {
				const effInfo = getEffectInfo(power.eff)
				return (
					<ChitterOption
						key={`gap${power.name}`}
						icon={
							<ChitterIcon
								image={power.img}
								tooltip={<Text>Super {power.name}</Text>}
							/>
						}
					>
						<ActionLink callback={() => cliExecute(`gap ${power.name}`)} dirty>
							<OptionText
								verb="Activate"
								subject={power.eff.identifierString}
								desc={`${effInfo.mods} (${power.duration} turns)`}
							/>
						</ActionLink>
					</ChitterOption>
				)
			})}
		</Picker>
	)
}

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

export const gapEffects: EffectListEntry[] = [
	[
		$effect`Super Skill`.identifierString,
		(effectInfo) => {
			effectInfo.mods = 'Combat skills/spells cost 0 MP'
			return { skipParse: true }
		},
	],
]
