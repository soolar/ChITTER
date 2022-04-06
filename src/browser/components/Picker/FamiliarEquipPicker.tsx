import { Button, ButtonGroup, Wrap, WrapItem } from '@chakra-ui/react';
import * as React from 'react';
import { BrowserItem, BrowserList } from '../../../guidelines';
import ItemIcon from '../Icons/ItemIcon';
import Picker from './Picker';

declare const items: BrowserList<BrowserItem>;

export default function FamiliarEquipmentPicker() {
	return (
		<Picker header="Change Familiar Equipment">
			<ButtonGroup variant="link">
				<Wrap spacing={0}>
					{items.favorites
						.filter((it) => it.slotStr === 'familiar')
						.map((it) => (
							<WrapItem>
								<Button>
									<ItemIcon item={it} />
								</Button>
							</WrapItem>
						))}
				</Wrap>
			</ButtonGroup>
		</Picker>
	);
}
