import { Link } from '@chakra-ui/react'
import { myHash } from 'kolmafia'

function modifyHref(href: string) {
	return href.replace(/([&?]pwd)(&|$)/, `$1=${myHash()}$2`)
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
