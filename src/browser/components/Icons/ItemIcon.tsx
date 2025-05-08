import { Item, stringModifier } from 'kolmafia'
import { Text } from '@chakra-ui/react'
import { showItem } from '../../../util'
import { getItemInfo } from '../../../util/helpers'
import TypedChitterIcon from './TypedChitterIcon'

interface ItemIconArgs {
	item: Item
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
		<TypedChitterIcon
			info={extraInfo}
			small={small}
			contextMenuCallback={
				item &&
				((ev) => {
					showItem(Number(item.descid))
					ev.preventDefault()
				})
			}
			tooltipStart={
				<Text
					dangerouslySetInnerHTML={{
						__html: `${forEquipping ? `${extraInfo.equipVerb} ` : ''}${
							extraInfo.displayName
						}${tooltipDesc ? ` (${tooltipDesc})` : ''}`,
					}}
				/>
			}
			tooltipEnd={
				item &&
				(weirdFam ? (
					weirdFamText
				) : (
					<Text
						className="popup-desc-line"
						dangerouslySetInnerHTML={{ __html: extraInfo.mods }}
					/>
				))
			}
		/>
	)
}
