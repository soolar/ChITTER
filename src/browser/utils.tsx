import { HStack, Image } from '@chakra-ui/react'
import * as React from 'react'
import { BrowserFamiliar } from '../guidelines'

export function getWeirdoDivContents(fam: BrowserFamiliar) {
	switch (fam.type) {
		case 'Melodramedary':
			return (
				<HStack className="chit-icon" spacing="0">
					<Image src="/images/otherimages/camelfam_left.gif" border={0} />
					{Array(Math.floor(fam.weight / 5)).fill(
						<Image src="/images/otherimages/camelfam_middle.gif" border={0} />
					)}
					<Image src="/images/otherimages/camelfam_right.gif" border={0} />
				</HStack>
			)
	}

	return null
}
