import * as React from 'react'
import { Text, VStack } from '@chakra-ui/react'

interface OptionTextArgs {
	verb?: string
	subject: string
	append?: string
	desc?: React.ReactNode[] | string
}

export default function OptionText({
	verb,
	subject,
	append,
	desc,
}: OptionTextArgs) {
	return (
		<VStack spacing={0}>
			<Text>
				{verb && (
					<>
						<Text as="b">{verb}</Text>&nbsp;
					</>
				)}
				{subject}
				{append && ` (${append})`}
			</Text>
			{desc &&
				(typeof desc === 'string' ? (
					<Text
						dangerouslySetInnerHTML={{ __html: desc }}
						className="desc-line"
					/>
				) : (
					<VStack>{desc}</VStack>
				))}
		</VStack>
	)
}
