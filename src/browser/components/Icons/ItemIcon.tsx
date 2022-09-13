import * as React from 'react'
import ChitterIcon from './ChitterIcon'
import { BrowserItem } from '../../../guidelines'

interface ItemIconArgs {
	item?: BrowserItem
	small?: boolean
}

export default function ItemIcon({ item, small }: ItemIconArgs) {
	if (item) {
		return (
			<ChitterIcon
				image={item.image}
				tooltip={item.name}
				borderType="normal"
				small={small}
			/>
		)
	} else {
		return (
			<ChitterIcon
				image="antianti.gif"
				tooltip="No item here..."
				small={small}
			/>
		)
	}
}
