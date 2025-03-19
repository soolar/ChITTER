import { $familiar, get } from 'libram'
import { FamListEntry } from '../famList'
import { HStack, Image, Text, VStack } from '@chakra-ui/react'
import ProgressBar from '../../../browser/components/ProgressBar'
import { familiarWeight } from 'kolmafia'
import { showFam } from '../..'

const melodramedary: FamListEntry = [
	$familiar`Melodramedary`.identifierString,
	(famInfo) => {
		const spit = get('camelSpit')
		if (spit >= 100) {
			famInfo.desc.push(<Text>Ready to spit!</Text>)
			famInfo.extraClass = 'has-drops'
		} else {
			famInfo.desc.push(
				<VStack spacing="none">
					<Text>{spit}% charged</Text>
					<ProgressBar value={spit} max={100} desc="camel spit" />
				</VStack>,
			)
		}

		const weight = familiarWeight(famInfo.thing)
		famInfo.weirdoDiv = (
			<HStack
				className={'chit-icon chit-icon-weird'}
				spacing="0"
				onContextMenu={(ev) => {
					showFam(famInfo.thing.id)
					ev.preventDefault()
				}}
			>
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
