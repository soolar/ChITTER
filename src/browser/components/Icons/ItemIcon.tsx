import { Item, stringModifier } from 'kolmafia'
import { Text, VStack } from '@chakra-ui/react'
import { showItem } from '../../../util'
import { getItemInfo } from '../../../util/helpers'
import ProgressBar from '../ProgressBar'
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
		>
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
				{extraInfo.progress && (
					<VStack spacing="none">
						<Text className="popup-desc-line">
							{extraInfo.progress.value} / {extraInfo.progress.max}{' '}
							{extraInfo.progress.desc}
						</Text>
						<ProgressBar
							value={extraInfo.progress.value}
							max={extraInfo.progress.max}
							desc={extraInfo.progress.desc}
						/>
					</VStack>
				)}
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
		</TypedChitterIcon>
	)
}
