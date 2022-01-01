import * as React from 'react';
import Picker from './Picker';

interface IconPickerArgs {
	columns: number;
	header: React.ReactNode;
	children: React.ReactNode;
	footer: React.ReactNode;
}

export default function IconPicker({
	columns,
	header,
	children,
	footer,
}: IconPickerArgs) {
	return (
		<Picker columns={columns} header={header} footer={footer}>
			<tr className="chit-icon-picker">
				<td colSpan={columns}>{children}</td>
			</tr>
		</Picker>
	);
}
