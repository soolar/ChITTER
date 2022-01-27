import * as React from 'react';

interface BrickArgs {
	name: string;
	header: React.ReactNode;
	body: React.ReactNode;
	footer: React.ReactNode;
}

export default function Brick({ name, header, body, footer }: BrickArgs) {
	return (
		<table id={`chit-brick-${name}`} className="chit-brick">
			<tbody>
				<tr>{header}</tr>
				<tr>{body}</tr>
				<tr>{footer}</tr>
			</tbody>
		</table>
	);
}
