import * as React from 'react'
import ChitterIcon from './ChitterIcon'
import { BrowserItem } from '../../../guidelines'
import { getExtraItemInfo } from '../../itemHelpers'
import { Text, VStack } from '@chakra-ui/react'

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
					</VStack>
				}
				borderType={extraInfo.borderType}
				small={small}
			/>
		)
}
