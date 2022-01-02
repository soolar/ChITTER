import * as React from 'react';

type HasOnClickHeader = { onClickHeader: (e: React.MouseEvent) => void };

interface PickerLauncherArgs<Params extends HasOnClickHeader> {
	children: React.ReactNode;
	WrappedPicker: React.ComponentType<Params>;
	pickerProps: Params;
}

export default function PickerLauncher<Params extends HasOnClickHeader>({
	children,
	WrappedPicker,
	pickerProps,
}: PickerLauncherArgs<Params>) {
	const [pickerTop, setPickerTop] = React.useState(-1);
	const isHidden = pickerTop === -1;

	const handleClick = (e: React.MouseEvent) => {
		if (isHidden) {
			setPickerTop(e.pageY);
		} else {
			setPickerTop(-1);
		}
	};

	const pickerStyle = {
		position: 'absolute' as const,
		top: pickerTop,
	};
	const pickerSpan = !isHidden && (
		<span style={pickerStyle}>
			<WrappedPicker {...pickerProps} onClickHeader={handleClick} />
		</span>
	);

	return (
		<span>
			{pickerSpan}
			<span onClick={handleClick}>{children}</span>
		</span>
	);
}
