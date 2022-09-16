import * as React from 'react'
import ChitterIcon from './ChitterIcon'
import { BrowserItem } from '../../../guidelines'
import { getExtraItemInfo } from '../../itemHelpers'
import { Text, VStack } from '@chakra-ui/react'

interface ItemIconArgs {
	item?: BrowserItem
	small?: boolean
	tooltipOverride?: string
}

export default function ItemIcon({
	item,
	small,
	tooltipOverride,
}: ItemIconArgs) {
	if (item) {
		const extraInfo = getExtraItemInfo(item)
		const defaultTooltip = (
			<VStack spacing="none">
				<Text>{item.name}</Text>
				{extraInfo.desc}
			</VStack>
		)
		return (
			<ChitterIcon
				image={item.image}
				tooltip={tooltipOverride || defaultTooltip}
				borderType="normal"
				small={small}
			/>
		)
	} else {
		return (
			<ChitterIcon
				image="antianti.gif"
				tooltip={tooltipOverride || 'No item here...'}
				small={small}
			/>
		)
	}
}
