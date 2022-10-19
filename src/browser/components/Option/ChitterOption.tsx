import * as React from 'react'
import { Box, Flex, Spacer } from '@chakra-ui/react'

interface ChitterOptionArgs {
	icon: React.ReactNode
	children: React.ReactNode
	enabled?: boolean
}

export default function ChitterOption({
	icon,
	children,
	enabled,
}: ChitterOptionArgs) {
	const realEnabled = enabled === undefined ? true : enabled

	return (
		<Flex className={realEnabled ? undefined : 'option-disabled'}>
			{icon}
			<Spacer />
			<Box className="option-body">{children}</Box>
		</Flex>
	)
}
