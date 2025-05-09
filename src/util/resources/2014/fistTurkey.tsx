import { $familiar, clamp, get } from 'libram'
import { FamListEntry } from '../famList'
import { HStack, Text, VStack } from '@chakra-ui/react'
import ProgressBar from '../../../browser/components/ProgressBar'

const fistTurkey: FamListEntry = [
	$familiar`Fist Turkey`.identifierString,
	(famInfo) => {
		famInfo.desc.push(
			<HStack>
				{[
					{ drop: 'mus', dropped: get('_turkeyMuscle') },
					{ drop: 'mys', dropped: get('_turkeyMyst') },
					{ drop: 'mox', dropped: get('_turkeyMoxie') },
				].map((turkeyInfo) => (
					<VStack spacing="none">
						<Text>
							{5 - clamp(turkeyInfo.dropped, 0, 5)} / 5 {turkeyInfo.drop}
						</Text>
						<ProgressBar
							value={clamp(5 - turkeyInfo.dropped, 0, 5)}
							max={5}
							desc={`${turkeyInfo.drop} left`}
							thin
						/>
					</VStack>
				))}
			</HStack>,
		)
		famInfo.dropsInfo.push()
	},
]

export default fistTurkey
