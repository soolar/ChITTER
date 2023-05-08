/*
import * as React from 'react'
import { Text, VStack } from '@chakra-ui/react'
import Brick from './Brick'
import { BrowserCharpaneData } from '../../../parseCharpaneData'
import MainLink from '../Link/MainLink'

declare const charpaneData: BrowserCharpaneData

export default function TrailBrick() {
	const trailDetails = [
		...charpaneData.sections.trail.matchAll(
			/target=mainpane href="(?<href>[^"]+)">(?<name>[^<]+)<\/a>/g
		),
	]

	const lastZoneHref =
		charpaneData.sections.trail.match(
			/href="(?<href>[^"]+)" target=mainpane>Last Adventure:<\/a>/
		)?.groups?.href ?? '#'

	return (
		<Brick name="trail" header="Last Adventure" headerHref={lastZoneHref}>
			<VStack spacing={0}>
				{trailDetails.map((locDetails, i) => (
					<MainLink href={locDetails.groups?.href ?? '#'}>
						<Text as={i === 0 ? 'b' : 'span'}>
							{locDetails.groups?.name ?? 'Error'}
						</Text>
					</MainLink>
				))}
			</VStack>
		</Brick>
	)
}
*/
