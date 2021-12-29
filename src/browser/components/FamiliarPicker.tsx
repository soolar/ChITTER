import * as React from 'react';
import {
	BrowserFamiliar,
	BrowserList,
} from '../../guidelines';
import FamIcon from './FamIcon';
import Icon from './Icon';

declare const familiars: BrowserList<BrowserFamiliar>;

interface FamiliarPickerArgs {
	isBjorn?: boolean;
}

export default function FamiliarPicker({
	isBjorn = false,
}: FamiliarPickerArgs) {
	void isBjorn; // for now

	return (
		<table className='chit-picker'>
			<tbody>
				<tr className='chit-picker-header'>
					<th colSpan={3}>
						Change familiar
					</th>
				</tr>
				<tr className='chit-icon-picker'>
					<td colSpan={3}>
						{familiars.favorites.map((fam) => <FamIcon fam={fam} />)}
					</td>
				</tr>
				<tr className='chit-picker-footer'>
					<td><Icon image='terrarium.gif' title='Visit your terrarium' /></td>
					<td><div>Visit Your Terrarium</div></td>
					<td><Icon image='antianti.gif' title='Use no familiar' /></td>
				</tr>
			</tbody>
		</table>
	)
}
