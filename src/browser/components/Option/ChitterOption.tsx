import * as React from 'react'
import { Flex, Spacer } from '@chakra-ui/react'

interface ChitterOptionArgs {
	icon: React.ReactNode
	children: React.ReactNode
}

export default function ChitterOption({ icon, children }: ChitterOptionArgs) {
	return (
		<Flex>
			{icon}
			<Spacer />
			{children}
		</Flex>
	)
}
