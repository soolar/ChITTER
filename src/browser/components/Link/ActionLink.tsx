import { useContext } from 'react'
import { Link } from '@chakra-ui/react'
import { RefreshContext } from 'tome-kolmafia-react'

interface ActionLinkArgs {
	callback: () => void
	children: React.ReactNode
	dirty?: boolean
}

export default function ActionLink({
	callback,
	children,
	dirty,
}: ActionLinkArgs) {
	const refContext = useContext(RefreshContext)
	const wrappedCallback = dirty
		? () => {
				callback()
				refContext.triggerHardRefresh()
			}
		: callback
	return <Link onClick={wrappedCallback}>{children}</Link>
}
