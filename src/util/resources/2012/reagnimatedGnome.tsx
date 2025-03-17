import { $familiar, get } from 'libram'
import { FamListEntry } from '../famList'
import { Text } from '@chakra-ui/react'

const reagnimatedGnome: FamListEntry = [
	$familiar`Reagnimated Gnome`.identifierString,
	(famInfo) => {
		const advsGained = get('_gnomeAdv')
		famInfo.desc.push(<Text>{advsGained} adv gained</Text>)
	},
]

export default reagnimatedGnome
