import * as React from 'react';

interface PickerLauncherArgs {
	children: React.ReactNode;
	picker: React.ReactNode;
}

export default function PickerLauncher({
	children,
	picker,
}: PickerLauncherArgs) {
	const [pickerCoords, setPickerCoords] = React.useState([-1, -1]);
	const isHidden = pickerCoords[0] === -1 && pickerCoords[1] === -1;

	const handleClick = (e: React.MouseEvent) => {
		if (isHidden) {
			setPickerCoords([e.pageX, e.pageY]);
		} else {
			setPickerCoords([-1, -1]);
		}
	};

	const pickerStyle = {
		position: 'absolute' as const,
		top: pickerCoords[1],
		left: pickerCoords[0],
	};
	const pickerSpan = !isHidden && <span style={pickerStyle}>{picker}</span>;

	return (
		<span>
			{pickerSpan}
			<span onClick={handleClick}>{children}</span>
		</span>
	);
}
