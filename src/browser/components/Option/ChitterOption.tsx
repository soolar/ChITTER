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
		<Flex className={realEnabled ? 'option-enabled' : 'option-disabled'}>
			<Box className="option-icon">{icon}</Box>
			<Spacer />
			<Box className="option-body">{children}</Box>
		</Flex>
	)
}
