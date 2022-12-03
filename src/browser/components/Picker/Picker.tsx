import { PopoverBody, PopoverFooter, PopoverHeader } from '@chakra-ui/react'
import * as React from 'react'

interface PickerArgs {
	header: React.ReactNode
	children: React.ReactNode
	footer?: React.ReactNode
}

export default function Picker({
	header,
	children,
	footer = null,
}: PickerArgs) {
	return (
		<>
			<PopoverHeader className="picker-header">{header}</PopoverHeader>
			<PopoverBody className="picker-body">{children}</PopoverBody>
			{footer && <PopoverFooter className="picker-footer">{footer}</PopoverFooter>}
		</>
	)
}
