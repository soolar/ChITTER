import * as React from 'react'
import ChitterOption from './ChitterOption'
import PickerLauncher, { PickerParamsBase } from '../Picker/PickerLauncher'
import { Button, Text } from '@chakra-ui/react'
import OptionText from './OptionText'

interface PickerOptionArgs<Params extends PickerParamsBase> {
	icon: React.ReactNode
	WrappedPicker: React.ComponentType<Params>
	pickerProps: Params
	verb: string
	subject: string
}

export default function PickerOption<Params extends PickerParamsBase>({
	icon,
	WrappedPicker,
	pickerProps,
	verb,
	subject,
}: PickerOptionArgs<Params>) {
	return (
		<ChitterOption icon={icon}>
			<PickerLauncher WrappedPicker={WrappedPicker} pickerProps={pickerProps}>
				<Button variant="link">
					<OptionText verb={verb} subject={subject} />
				</Button>
			</PickerLauncher>
		</ChitterOption>
	)
}
