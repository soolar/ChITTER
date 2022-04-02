import * as React from 'react';
import { BrowserCharacter } from '../../../character';
import { BrowserFamiliar, BrowserList } from '../../../guidelines';
import FamIcon from '../FamIcon';
import Icon from '../Icon';
import IconPicker from './IconPicker';

declare const familiars: BrowserList<BrowserFamiliar>;
declare const my: BrowserCharacter;

export type FamiliarPickerType = 'default' | 'bjorn' | 'crown';

interface FamiliarPickerArgs {
	type?: FamiliarPickerType;
	onClickHeader?: (e: React.MouseEvent) => void;
}

export default function FamiliarPicker({
	type = 'default',
	onClickHeader,
}: FamiliarPickerArgs) {
	const activeFam =
		type === 'default'
			? familiars.active[0]
			: type === 'bjorn'
			? my.bjornFam
			: my.crownFam;

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
			{familiars.favorites
				.filter((fam) => fam !== activeFam)
				.map((fam) => (
					<FamIcon fam={fam} />
				))}
		</IconPicker>
	);
}
