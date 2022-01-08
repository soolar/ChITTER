import * as React from 'react';
import Icon from './Icon';
import { BrowserItem } from '../../guidelines';

interface ItemIconArgs {
	item: BrowserItem | undefined;
}

export default function ItemIcon({ item }: ItemIconArgs) {
	if (item) {
		return (
			<span>
				<Icon image={item.image} title={item.name} borderType="normal" />
			</span>
		);
	} else {
		return (
			<span>
				<Icon image="antianti.gif" title="No item here..." />
			</span>
		);
	}
}
