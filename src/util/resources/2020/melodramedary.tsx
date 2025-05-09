import { $familiar, clamp, get } from 'libram'
import { FamListEntry } from '../famList'
import { HStack, Image, Text } from '@chakra-ui/react'
import { familiarWeight } from 'kolmafia'

const melodramedary: FamListEntry = [
	$familiar`Melodramedary`.identifierString,
	(famInfo) => {
		const spit = clamp(get('camelSpit'), 0, 100)
		if (spit >= 100) {
			famInfo.desc.push(<Text>Ready to spit!</Text>)
			famInfo.extraClass = 'has-drops'
		} else {
			famInfo.progress.push({ value: spit, max: 100, desc: 'camel spit' })
		}

		const weight = familiarWeight(famInfo.thing)
		famInfo.weirdoDiv = (
			<HStack spacing="0">
				<Image src="/images/otherimages/camelfam_left.gif" border={0} />
				{Array(Math.floor(weight / 5)).fill(
					<Image src="/images/otherimages/camelfam_middle.gif" border={0} />,
				)}
				<Image src="/images/otherimages/camelfam_right.gif" border={0} />
			</HStack>
		)
	},
]

export default melodramedary
