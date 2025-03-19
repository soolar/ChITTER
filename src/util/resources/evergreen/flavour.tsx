import { $effect, $effects, $element, $skill, have } from 'libram'
import { EffectListEntry, NeedableEffectInfo } from '../effectList'
import { Container, Image, Text, Tooltip } from '@chakra-ui/react'
import { EffectInfo } from '../../helpers'
import { Effect, Element, Skill, useSkill } from 'kolmafia'
import Picker from '../../../browser/components/Picker/Picker'
import { RawEffectDisplay } from '../../../browser/components/Brick/EffectsBrick'
import ChitterIcon from '../../../browser/components/Icons/ChitterIcon'

interface FlavourArea {
	element: Element
	skill: Skill
	effect: Effect
	x: number
	y: number
}

function FlavourPicker() {
	const areas: FlavourArea[] = [
		{
			element: $element`sleaze`,
			skill: $skill`Spirit of Bacon Grease`,
			effect: $effect`Spirit of Bacon Grease`,
			x: 86,
			y: 33,
		},
		{
			element: $element`cold`,
			skill: $skill`Spirit of Peppermint`,
			effect: $effect`Spirit of Peppermint`,
			x: 156,
			y: 84,
		},
		{
			element: $element`spooky`,
			skill: $skill`Spirit of Wormwood`,
			effect: $effect`Spirit of Wormwood`,
			x: 133,
			y: 155,
		},
		{
			element: $element`hot`,
			skill: $skill`Spirit of Cayenne`,
			effect: $effect`Spirit of Cayenne`,
			x: 39,
			y: 155,
		},
		{
			element: $element`stench`,
			skill: $skill`Spirit of Garlic`,
			effect: $effect`Spirit of Garlic`,
			x: 25,
			y: 84,
		},
		{
			element: $element.none,
			skill: $skill`Spirit of Nothing`,
			effect: $effect.none,
			x: 89,
			y: 95,
		},
	]
	const activeArea = areas.find((area) => have(area.effect))
	const activeElement = activeArea
		? activeArea.element.identifierString.toLowerCase()
		: ''
	return (
		<Picker header="Change Your Flavour">
			<Container maxW="full" centerContent>
				<Image
					src={`/images/relayimages/chit/elementchart2${activeElement}.gif`}
					width="190"
					height="190"
					alt="Cast Flavour of Magic"
					useMap="#flavmap"
				/>
				<map name="flavmap">
					{areas
						.filter((area) => area !== activeArea)
						.map((area) => (
							<Tooltip
								label={
									<Text>
										{area.skill.identifierString} (
										{area.element.identifierString})
									</Text>
								}
							>
								<area
									shape="circle"
									alt={area.element.identifierString}
									coords={`${area.x},${area.y},22`}
									onClick={() => useSkill(area.skill)}
								/>
							</Tooltip>
						))}
				</map>
			</Container>
		</Picker>
	)
}
function flavourInfoModifier(color: string) {
	return (effectInfo: EffectInfo) => {
		effectInfo.displayName = (
			<Text as="span" color={color}>
				{effectInfo.displayName}
			</Text>
		)
		effectInfo.launches = FlavourPicker
		return { skipCleanse: true }
	}
}

const flavour: EffectListEntry[] = [
	[
		$effect`Spirit of Bacon Grease`.identifierString,
		flavourInfoModifier('blueviolet'),
	],
	[$effect`Spirit of Peppermint`.identifierString, flavourInfoModifier('blue')],
	[$effect`Spirit of Wormwood`.identifierString, flavourInfoModifier('grey')],
	[$effect`Spirit of Cayenne`.identifierString, flavourInfoModifier('red')],
	[$effect`Spirit of Garlic`.identifierString, flavourInfoModifier('green')],
]

export default flavour

export const needFlavour: NeedableEffectInfo = {
	condition: () => {
		const spirits = $effects`Spirit of Bacon Grease, Spirit of Peppermint, Spirit of Wormwood, Spirit of Cayenne, Spirit of Garlic`
		return (
			have($skill`Flavour of Magic`) &&
			spirits.find((eff) => have(eff)) === undefined
		)
	},
	neededDisplay: (
		<RawEffectDisplay
			turnsLeft={0}
			name={<Text>Choose a Flavour</Text>}
			icon={
				<ChitterIcon
					medium
					image="flavourofmagic.gif"
					tooltip={<Text>Choose a Flavour</Text>}
				/>
			}
			launches={FlavourPicker}
		/>
	),
}
