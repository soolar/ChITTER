import React from 'react'
import { Item, stringModifier } from 'kolmafia'
import { Text, VStack } from '@chakra-ui/react'
import ChitterIcon from './ChitterIcon'
import { showItem } from '../../../util'
import { getItemInfo } from '../../../util/itemHelpers'

interface ItemIconArgs {
	item?: Item
	small?: boolean
	tooltipPrefix?: string
	tooltipDesc?: string
	weirdFam?: boolean
	forEquipping?: boolean
}

export default function ItemIcon({
	item,
	small,
	tooltipPrefix,
	tooltipDesc,
	weirdFam,
	forEquipping,
}: ItemIconArgs) {
	const extraInfo = getItemInfo(item, {
		namePrefix: tooltipPrefix,
		forEquipping,
	})

	const mods = item ? stringModifier(item, 'Evaluated Modifiers') : ''

	let weirdFamText
	if (weirdFam && item) {
		const match = mods.match(/Familiar Effect: "([^"]+), cap (\d+)"/)
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
					<Text
						dangerouslySetInnerHTML={{
							__html: `${forEquipping ? `${extraInfo.equipVerb} ` : ''}${
								extraInfo.displayName
							}${tooltipDesc ? ` (${tooltipDesc})` : ''}`,
						}}
					/>
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
			onContextMenu={
				item &&
				((ev) => {
					showItem(Number(item.descid))
					ev.preventDefault()
				})
			}
		/>
	)
}
