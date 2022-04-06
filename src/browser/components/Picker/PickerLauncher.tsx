import {
	Button,
	Popover,
	PopoverArrow,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
} from '@chakra-ui/react';
import * as React from 'react';

type ParamsBase = Record<string, unknown>;

interface PickerLauncherArgs<Params extends ParamsBase> {
	children: React.ReactNode;
	WrappedPicker: React.ComponentType<Params>;
	pickerProps: Params;
}

export default function PickerLauncher<Params extends ParamsBase>({
	children,
	WrappedPicker,
	pickerProps,
}: PickerLauncherArgs<Params>) {
	return (
		<Popover>
			<PopoverTrigger>
				<Button variant="link">{children}</Button>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<PopoverCloseButton />
				<WrappedPicker {...pickerProps} />
			</PopoverContent>
		</Popover>
	);
}
