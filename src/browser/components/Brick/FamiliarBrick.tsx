import * as React from 'react';
import { nextLevelInfo } from '../../../familiarHelpers';
import { BrowserFamiliar, BrowserList, BrowserSlot } from '../../../guidelines';
import { showFam } from '../../../utils';
import FamIcon from '../FamIcon';
import FamiliarPicker from '../Picker/FamiliarPicker';
import ItemIcon from '../ItemIcon';
import PickerLauncher from '../Picker/PickerLauncher';
import ProgressBar from '../ProgressBar';

declare const familiars: BrowserList<BrowserFamiliar>;
declare const slots: BrowserList<BrowserSlot>;

export default function FamiliarBrick() {
	const currFam = familiars.active[0];
	const nextInfo = nextLevelInfo(currFam);

	return (
		<table id="chit-familiar" className="chit-brick">
			<tbody>
				<tr>
					<th
						style={{ width: 40, color: 'blue' }}
						title={`Buffed Weight (Base Weight: ${currFam.weight} lb)`}
					>
						{currFam.buffedWeight}
					</th>
					<th>{currFam.name}</th>
					<th style={{ width: 30 }}>&nbsp;</th>
				</tr>
				<tr>
					<td>
						<PickerLauncher
							WrappedPicker={FamiliarPicker}
							pickerProps={{
								onClickHeader: (e: React.MouseEvent) => {
									void e;
								},
							}}
						>
							<FamIcon fam={currFam} />
						</PickerLauncher>
					</td>
					<td className="info" onClick={() => showFam(currFam.id)}>
						{currFam.type}
					</td>
					<td>
						<ItemIcon item={slots.byName.familiar.equipped} />
					</td>
				</tr>
				<tr>
					<td colSpan={3}>
						<ProgressBar value={nextInfo.progress} max={nextInfo.goal} />
					</td>
				</tr>
			</tbody>
		</table>
	);
}
