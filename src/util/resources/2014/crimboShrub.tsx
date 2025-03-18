import { $effect, $familiar, get, have } from 'libram'
import { FamListEntry } from '../famList'
import { Text } from '@chakra-ui/react'
import MainLink from '../../../browser/components/Link/MainLink'

const crimboShrub: FamListEntry = [
	$familiar`Crimbo Shrub`.identifierString,
	(famInfo, isTooltip) => {
		const gifts = get('shrubGifts')
		const readyToFire =
			gifts === 'yellow'
				? have($effect`Everything Looks Yellow`)
				: gifts === 'meat' && have($effect`Everything Looks Red`)
		famInfo.extraClass = 'all-drops'
		if (readyToFire) {
			famInfo.desc.push(<Text>Ready to fire!</Text>)
		}
		if (!get('_shrubDecorated')) {
			const decorated = get('shrubGifts') !== ''
			famInfo.desc.push(
				<Text>
					{isTooltip ? (
						decorated ? (
							'Can decorate'
						) : (
							'Can redecorate'
						)
					) : (
						<MainLink href="/inv_use.php?pwd&which=3&whichitem=7958">
							{decorated ? 'Can redecorate' : 'Decorate your shrub!'}
						</MainLink>
					)}
				</Text>,
			)
		} else {
			famInfo.extraClass = undefined
		}
	},
]

export default crimboShrub
