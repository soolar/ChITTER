import * as React from 'react';
import Icon from './Icon';
import { BrowserItem } from '../../guidelines';

interface ItemIconArgs {
	item: BrowserItem | undefined;
}

export default function ItemIcon({ item }: ItemIconArgs) {
	if (item) {
		return <Icon image={item.image} tooltip={item.name} borderType="normal" />;
	} else {
		return <Icon image="antianti.gif" tooltip="No item here..." />;
	}
}
