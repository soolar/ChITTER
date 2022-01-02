import * as React from 'react';
import { BrowserFamiliar, BrowserList } from '../guidelines';
import FamIcon from './components/FamIcon';
import FamiliarPicker from './components/FamiliarPicker';
import PickerLauncher from './components/PickerLauncher';

declare const familiars: BrowserList<BrowserFamiliar>;

export default function App() {
	return (
		<div id="chitterContainer">
			<PickerLauncher
				WrappedPicker={FamiliarPicker}
				pickerProps={{
					onClickHeader: (e: React.MouseEvent) => {
						void e;
					},
				}}
			>
				<FamIcon fam={familiars.active[0]} />
			</PickerLauncher>
		</div>
	);
}
