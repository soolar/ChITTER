import { $familiar, get } from 'libram'
import { FamListEntry } from '../famList'
import { Text } from '@chakra-ui/react'

const temporalRiftlet: FamListEntry = [
	$familiar`Temporal Riftlet`.identifierString,
	(famInfo) => {
		const advsGained = get('_riftletAdv')
		famInfo.desc.push(<Text>{advsGained} adv gained</Text>)
	},
]

export default temporalRiftlet
