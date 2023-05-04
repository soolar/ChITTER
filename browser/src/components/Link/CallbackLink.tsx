import { Link } from '@chakra-ui/react'
import * as React from 'react'

interface CallbackLinkArgs {
	callback: () => void
	children: React.ReactNode
}

export default function CallbackLink({ callback, children }: CallbackLinkArgs) {
	return (
		<Link href="#" onClick={callback}>
			{children}
		</Link>
	)
}
