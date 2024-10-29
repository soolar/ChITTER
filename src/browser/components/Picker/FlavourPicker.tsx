import {
	Effect,
	Element,
	haveEffect,
	Skill,
	toEffect,
	useSkill,
} from 'kolmafia'
import { $effect, $element, $skill } from 'libram'
import React from 'react'
import Picker from './Picker'
import { Container, Image, Text, Tooltip } from '@chakra-ui/react'

interface FlavourArea {
	element: Element
	skill: Skill
	effect: Effect
	x: number
	y: number
}

export default function FlavourPicker() {
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
	const activeArea = areas.find((area) => haveEffect(area.effect) > 0)
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
