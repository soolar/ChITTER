import { Link } from '@chakra-ui/react'
import { BrowserCharacter } from '../../../character'
import * as React from 'react'

declare const my: BrowserCharacter

interface CommandLinkArgs {
	cmd: string
	children: React.ReactNode
}

export default function CommandLink({ cmd, children }: CommandLinkArgs) {
	return (
		<Link href={`/KoLmafia/sideCommand?cmd=${encodeURI(cmd)}&pwd=${my.hash}`}>
			{children}
		</Link>
	)
}
