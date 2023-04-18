import * as React from 'react'
import { Container, Image } from '@chakra-ui/react'
import Picker from './Picker'
import { BrowserCharacter } from '../../../character'
import { BrowserEffect, BrowserList } from '../../../guidelines'

declare const my: BrowserCharacter
declare const effects: BrowserList<BrowserEffect>

interface FlavourArea {
	element: string
	spirit: string
	x: number
	y: number
}

export default function FlavourPicker() {
	const areas: FlavourArea[] = [
		{ element: 'Sleaze', spirit: 'Bacon Grease', x: 86, y: 33 },
		{ element: 'Cold', spirit: 'Peppermint', x: 156, y: 84 },
		{ element: 'Spooky', spirit: 'Wormwood', x: 133, y: 155 },
		{ element: 'Hot', spirit: 'Cayenne', x: 39, y: 155 },
		{ element: 'Stench', spirit: 'Garlic', x: 25, y: 84 },
		{ element: 'None', spirit: 'Nothing', x: 89, y: 95 },
	]
	const activeArea = areas.find(
		(area) => effects.byName[`Spirit of ${area.spirit}`]?.turnsActive > 0
	)
	const activeElement = activeArea ? activeArea.element.toLowerCase() : 'none'
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
						.filter((flavourArea) => flavourArea !== activeArea)
						.map((flavourArea) => (
							<area
								shape="circle"
								alt={flavourArea.element}
								title={`Spirit of ${flavourArea.spirit} (${flavourArea.element})`}
								coords={`${flavourArea.x},${flavourArea.y},22`}
								href={`/KoLmafia/sideCommand?cmd=cast+spirit+of+${flavourArea.spirit
									.toLowerCase()
									.replace(/ /g, '+')}&pwd=${my.hash}`}
							/>
						))}
				</map>
			</Container>
		</Picker>
	)
}
