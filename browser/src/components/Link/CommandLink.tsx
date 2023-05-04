import { Link } from '@chakra-ui/react'
import { myHash } from 'kolmafia'
import * as React from 'react'

interface CommandLinkArgs {
	cmd: string
	children: React.ReactNode
}

export default function CommandLink({ cmd, children }: CommandLinkArgs) {
	return (
		<Link href={`/KoLmafia/sideCommand?cmd=${encodeURI(cmd)}&pwd=${myHash()}`}>
			{children}
		</Link>
	)
}
