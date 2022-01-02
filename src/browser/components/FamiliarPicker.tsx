import * as React from 'react';
import { BrowserFamiliar, BrowserList } from '../../guidelines';
import FamIcon from './FamIcon';
import Icon from './Icon';
import IconPicker from './IconPicker';

declare const familiars: BrowserList<BrowserFamiliar>;

interface FamiliarPickerArgs {
	isBjorn?: boolean;
	onClickHeader?: (e: React.MouseEvent) => void;
}

export default function FamiliarPicker({
	isBjorn = false,
	onClickHeader,
}: FamiliarPickerArgs) {
	void isBjorn; // for now

	return (
		<IconPicker
			columns={3}
			header="Change Familiar"
			footer={
				<>
					<td>
						<Icon image="terrarium.gif" title="Visit your terrarium" />
					</td>
					<td>
						<div>Visit Your Terrarium</div>
					</td>
					<td>
						<Icon image="antianti.gif" title="Use no familiar" />
					</td>
				</>
			}
			onClickHeader={onClickHeader}
		>
			{familiars.favorites.map((fam) => (
				<FamIcon fam={fam} />
			))}
		</IconPicker>
	);
}
