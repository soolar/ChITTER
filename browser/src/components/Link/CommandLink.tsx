import { Link } from '@chakra-ui/react'
import { cliExecute } from 'kolmafia'
import * as React from 'react'

interface CommandLinkArgs {
	cmd: string
	children: React.ReactNode
}

export default function CommandLink({ cmd, children }: CommandLinkArgs) {
	return (
		<Link href="#" onClick={() => cliExecute(cmd)}>
			{children}
		</Link>
	)
}
