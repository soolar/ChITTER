import {
	Button,
	Popover,
	PopoverArrow,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
} from '@chakra-ui/react'
import * as React from 'react'

export type PickerParamsBase = Record<string, unknown>

interface PickerLauncherArgs<Params extends PickerParamsBase> {
	children: React.ReactNode
	WrappedPicker: React.ComponentType<Params>
	pickerProps: Params
}

export default function PickerLauncher<Params extends PickerParamsBase>({
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
				<PopoverArrow bg="blue" />
				<PopoverCloseButton className="picker-close" />
				<WrappedPicker {...pickerProps} />
			</PopoverContent>
		</Popover>
	)
}
