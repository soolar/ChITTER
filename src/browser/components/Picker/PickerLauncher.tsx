import {
	Button,
	Popover,
	PopoverArrow,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
} from '@chakra-ui/react';
import * as React from 'react';

interface PickerLauncherArgs<Params> {
	children: React.ReactNode;
	WrappedPicker: React.ComponentType<Params>;
	pickerProps: Params;
}

export default function PickerLauncher<Params>({
	children,
	WrappedPicker,
	pickerProps,
}: PickerLauncherArgs<Params>) {
	return (
		<Popover>
			<PopoverTrigger>
				<Button variant="unstyled">{children}</Button>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<PopoverCloseButton />
				<WrappedPicker {...pickerProps} />
			</PopoverContent>
		</Popover>
	);
}
