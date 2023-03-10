import * as React from 'react'
import ChitterIcon from './ChitterIcon'
import { BrowserItem } from '../../../guidelines'
import { getExtraItemInfo } from '../../itemHelpers'
import { Text, VStack } from '@chakra-ui/react'
import { showItem } from '../../../utils'

interface ItemIconArgs {
	item?: BrowserItem
	small?: boolean
	tooltipPrefix?: string
	weirdFam?: boolean
}

export default function ItemIcon({
	item,
	small,
	tooltipPrefix,
	weirdFam,
}: ItemIconArgs) {
	const extraInfo = getExtraItemInfo(item, { namePrefix: tooltipPrefix })

	let weirdFamText
	if (weirdFam && item) {
		const match = item.mods.match(/Familiar Effect: "([^"]+), cap (\d+)"/)
		if (match) {
			weirdFamText = (
				<Text className="popup-desc-line">
					{match[1]} (limit {match[2]}lbs)
				</Text>
			)
		}
	}

	return (
		<ChitterIcon
			image={extraInfo.image}
			tooltip={
				<VStack spacing="none">
					<Text dangerouslySetInnerHTML={{ __html: extraInfo.displayName }} />
					{!weirdFam &&
						extraInfo.desc.map((node) => (
							<span className="popup-desc-line">{node}</span>
						))}
					{item &&
						(weirdFam ? (
							weirdFamText
						) : (
							<Text
								className="popup-desc-line"
								dangerouslySetInnerHTML={{ __html: extraInfo.mods }}
							/>
						))}
				</VStack>
			}
			borderType={extraInfo.borderType}
			small={small}
			onClick={
				item &&
				((ev) => {
					if (ev.shiftKey) {
						showItem(item.descId)
					}
				})
			}
		/>
	)
}
