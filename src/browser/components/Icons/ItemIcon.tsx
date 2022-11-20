import * as React from 'react'
import ChitterIcon from './ChitterIcon'
import { BrowserItem } from '../../../guidelines'
import { getExtraItemInfo } from '../../itemHelpers'
import { Text, VStack } from '@chakra-ui/react'
import { parseMods, showItem } from '../../../utils'

interface ItemIconArgs {
	item?: BrowserItem
	small?: boolean
	tooltipPrefix?: string
}

export default function ItemIcon({ item, small, tooltipPrefix }: ItemIconArgs) {
	const extraInfo = getExtraItemInfo(item, { namePrefix: tooltipPrefix })
	return (
		<ChitterIcon
			image={extraInfo.image}
			tooltip={
				<VStack spacing="none">
					<Text>{extraInfo.displayName}</Text>
					{extraInfo.desc}
					{item && (
						<Text
							className="popup-desc-line"
							dangerouslySetInnerHTML={{ __html: extraInfo.mods }}
						/>
					)}
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
