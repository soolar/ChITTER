import React from 'react'
import PickerLauncher, { PickerParamsBase } from '../Picker/PickerLauncher'
import ChitterOption from './ChitterOption'
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
				<OptionText verb={verb} subject={subject} />
			</PickerLauncher>
		</ChitterOption>
	)
}
