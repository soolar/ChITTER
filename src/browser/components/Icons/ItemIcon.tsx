import * as React from 'react';
import ChitterIcon from './ChitterIcon';
import { BrowserItem } from '../../../guidelines';

interface ItemIconArgs {
	item?: BrowserItem;
}

export default function ItemIcon({ item }: ItemIconArgs) {
	if (item) {
		return (
			<ChitterIcon image={item.image} tooltip={item.name} borderType="normal" />
		);
	} else {
		return <ChitterIcon image="antianti.gif" tooltip="No item here..." />;
	}
}
