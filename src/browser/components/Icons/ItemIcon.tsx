import * as React from 'react'
import ChitterIcon from './ChitterIcon'
import { BrowserItem } from '../../../guidelines'

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
		return (
			<ChitterIcon
				image={item.image}
				tooltip={tooltipOverride || item.name}
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
