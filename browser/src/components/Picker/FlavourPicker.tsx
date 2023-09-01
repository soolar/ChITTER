import * as React from 'react'
import { Container, Image } from '@chakra-ui/react'
import Picker from './Picker'
import { haveEffect, myHash, toEffect, toSkill, useSkill } from 'kolmafia'

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
		(area) => haveEffect(toEffect(`Spirit of ${area.spirit}`)) > 0,
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
						.map((flavourArea) => {
							const spiritSkill = toSkill(`Spirit of ${flavourArea.spirit}`)
							return (
								<area
									shape="circle"
									alt={flavourArea.element}
									title={`Spirit of ${flavourArea.spirit} (${flavourArea.element})`}
									coords={`${flavourArea.x},${flavourArea.y},22`}
									onClick={() => useSkill(spiritSkill)}
									href="#"
								/>
							)
						})}
				</map>
			</Container>
		</Picker>
	)
}
