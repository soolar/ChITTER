import { $effect, $familiar, get } from 'libram'
import { FamListEntry } from '../famList'
import { haveEffect } from 'kolmafia'
import { Text } from '@chakra-ui/react'
import MainLink from '../../../browser/components/Link/MainLink'

const crimboShrub: FamListEntry = [
	$familiar`Crimbo Shrub`.identifierString,
	(famInfo, isTooltip) => {
		const gifts = get('shrubGifts')
		const readyToFire =
			gifts === 'yellow'
				? haveEffect($effect`Everything Looks Yellow`) === 0
				: gifts === 'meat' && haveEffect($effect`Everything Looks Red`) === 0
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
