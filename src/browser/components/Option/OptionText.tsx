import * as React from 'react'
import { Text, VStack } from '@chakra-ui/react'

interface OptionTextArgs {
	verb: string
	subject: string
	append?: string
	descline?: string
}

export default function OptionText({
	verb,
	subject,
	append,
	descline,
}: OptionTextArgs) {
	return (
		<VStack>
			<Text>
				<Text as="b">{verb}</Text>&nbsp;{subject}
				{append && ` (${append})`}
			</Text>
			{descline && <Text>{descline}</Text>}
		</VStack>
	)
}
