import * as React from 'react'
import ChitterIcon from './ChitterIcon'
import { Text, VStack } from '@chakra-ui/react'
import { showItem } from '../../utils'
import { Item } from 'kolmafia'
import { $item } from 'libram'
import { useExtraItemInfo } from '../../itemHelpers'

interface ItemIconArgs {
	item: Item
	small?: boolean
	tooltipPrefix?: string
	weirdFam?: boolean
	forEquipping?: boolean
}

export default function ItemIcon({
	item,
	small,
	tooltipPrefix,
	weirdFam,
	forEquipping,
}: ItemIconArgs) {
	const extraInfo = useExtraItemInfo(item, true, {
		namePrefix: tooltipPrefix,
		forEquipping,
	})

	// this check is done here rather than in the callback to avoid risking $item`none` being
	// unknown as the callback is run, as unlikely as that is
	const showItemCallback =
		item !== $item`none` ? () => showItem(Number(item.descid)) : undefined

	let weirdFamText
	if (weirdFam && item) {
		const match = extraInfo.rawMods.match(
			/Familiar Effect: "([^"]+), cap (\d+)"/,
		)
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
							}`,
						}}
					/>
					{!weirdFam && extraInfo.desc}
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
			borderType={'normal'}
			small={small}
			onContextMenu={(ev) => {
				if (showItemCallback) {
					showItemCallback()
				}
				ev.preventDefault()
			}}
		/>
	)
}
