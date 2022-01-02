import * as React from 'react';

interface PickerArgs {
	columns: number;
	header: React.ReactNode;
	children: React.ReactNode;
	footer: React.ReactNode;
	onClickHeader?: (e: React.MouseEvent) => void;
}

export default function Picker({
	columns,
	header,
	children,
	footer,
	onClickHeader,
}: PickerArgs) {
	return (
		<table className="chit-picker">
			<tbody>
				<tr className="chit-picker-header" onClick={onClickHeader}>
					<th colSpan={columns}>{header}</th>
				</tr>
				{children}
				<tr className="chit-picker-footer">{footer}</tr>
			</tbody>
		</table>
	);
}
