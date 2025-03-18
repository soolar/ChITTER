import { myLocation, toUrl } from 'kolmafia'
import Brick from './Brick'
import { Text, VStack } from '@chakra-ui/react'
import MainLink from '../Link/MainLink'

export default function TrailBrick() {
	const lastZone = myLocation()
	const lastZoneUrl = toUrl(lastZone)

	return (
		<Brick name="trail" header="Last Adventure">
			<VStack spacing={0}>
				<MainLink href={lastZoneUrl}>
					<Text as="b">{lastZone.identifierString}</Text>
				</MainLink>
			</VStack>
		</Brick>
	)
}
