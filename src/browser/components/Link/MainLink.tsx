import * as React from 'react'
import { Link } from '@chakra-ui/react'
import { BrowserCharacter } from '../../../character'

declare const my: BrowserCharacter

function modifyHref(href: string) {
	return href.replace(/([&?]pwd)(&|$)/, `$1=${my.hash}$2`)
}

interface MainLinkArgs {
	href: string
	children: React.ReactNode
}

export default function MainLink({ href, children }: MainLinkArgs) {
	const modifiedHref = modifyHref(href)
	return (
		<Link href={modifiedHref} target="mainpane">
			{children}
		</Link>
	)
}
