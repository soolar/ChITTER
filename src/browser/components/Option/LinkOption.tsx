import { Button, Link } from '@chakra-ui/react'
import * as React from 'react'
import ChitterOption from './ChitterOption'
import OptionText from './OptionText'

interface LinkOptionArgs {
	icon: React.ReactNode
	verb: string
	subject: string
	link: string
	enabled?: boolean
}

export default function LinkOption({
	icon,
	verb,
	subject,
	link,
	enabled,
}: LinkOptionArgs) {
	const realEnabled = enabled ?? true

	return (
		<ChitterOption icon={icon} enabled={realEnabled}>
			<Button as="a" href={realEnabled ? link : undefined} variant="link">
				<OptionText verb={verb} subject={subject} />
			</Button>
		</ChitterOption>
	)
}
