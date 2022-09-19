import * as React from 'react'
import ChitterOption from './ChitterOption'
import { Button, Text } from '@chakra-ui/react'

interface SimpleOptionArgs {
	icon: React.ReactNode
	verb: string
	subject: string
	details?: string
}

export default function SimpleOption({
	icon,
	verb,
	subject,
	details,
}: SimpleOptionArgs) {
	return (
		<ChitterOption icon={icon}>
			<Button variant="link">
				<Text>
					<Text as="b">{verb}</Text>&nbsp;{subject}
				</Text>
				{details && <Text>{details}</Text>}
			</Button>
		</ChitterOption>
	)
}
