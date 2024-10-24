import React from 'react'
import { Link } from '@chakra-ui/react'

interface ActionLinkArgs {
	callback: () => void
	children: React.ReactNode
}

export default function ActionLink({ callback, children }: ActionLinkArgs) {
	return <Link onClick={callback}>{children}</Link>
}
