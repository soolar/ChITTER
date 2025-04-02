import {
	Button,
	Popover,
	PopoverArrow,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
} from '@chakra-ui/react'

export type PickerParamsBase = Record<string, unknown>

interface PickerLauncherArgs<Params extends PickerParamsBase> {
	children: React.ReactNode
	WrappedPicker: React.ComponentType<Params>
	pickerProps: Params
	fullButton?: boolean
}

export default function PickerLauncher<Params extends PickerParamsBase>({
	children,
	WrappedPicker,
	pickerProps,
	fullButton,
}: PickerLauncherArgs<Params>) {
	return (
		<Popover>
			<PopoverTrigger>
				<Button variant="link" width={fullButton ? '100%' : undefined}>
					{children}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow bg="blue" />
				<PopoverCloseButton className="picker-close" />
				<WrappedPicker {...pickerProps} />
			</PopoverContent>
		</Popover>
	)
}
