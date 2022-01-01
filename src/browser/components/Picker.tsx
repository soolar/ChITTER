import * as React from 'react';

interface PickerArgs {
	columns: number;
	header: React.ReactNode;
	children: React.ReactNode;
	footer: React.ReactNode;
}

export default function Picker({
	columns,
	header,
	children,
	footer,
}: PickerArgs) {
	return (
		<table className="chit-picker">
			<tbody>
				<tr className="chit-picker-header">
					<th colSpan={columns}>{header}</th>
				</tr>
				{children}
				<tr className="chit-picker-footer">{footer}</tr>
			</tbody>
		</table>
	);
}
