import React from 'react'
import { Item, stringModifier } from 'kolmafia'
import { Text, VStack } from '@chakra-ui/react'
import ChitterIcon from './ChitterIcon'
import { parseMods, showItem } from '../../../util'

interface ItemIconArgs {
	item?: Item
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
	const extraInfo = {
		desc: [<Text>TODO: Extra Info</Text>],
		image: item?.image ?? 'blank.gif',
		equipVerb: 'equip',
		displayName: `${tooltipPrefix ? `${tooltipPrefix} ` : ''}${item?.identifierString ?? 'none'}`,
		borderType: 'normal' as const,
	}
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

	const parsedMods = parseMods(mods)

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
								dangerouslySetInnerHTML={{ __html: parsedMods }}
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
