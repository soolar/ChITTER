import { PopoverBody, PopoverFooter, PopoverHeader } from '@chakra-ui/react';
import * as React from 'react';

interface PickerArgs {
	header: React.ReactNode;
	children: React.ReactNode;
	footer?: React.ReactNode;
}

export default function Picker({
	header,
	children,
	footer = null,
}: PickerArgs) {
	return (
		<>
			<PopoverHeader fontWeight="bold">{header}</PopoverHeader>
			<PopoverBody>{children}</PopoverBody>
			{footer && <PopoverFooter>{footer}</PopoverFooter>}
		</>
	);
}
