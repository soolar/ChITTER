import React from 'react'
import ChitterOption from './ChitterOption'
import MainLink from '../Link/MainLink'
import OptionText from './OptionText'

interface MainLinkOptionArgs {
	icon: React.ReactNode
	href: string
	verb: string
	subject: string
}

export default function MainLinkOption({
	icon,
	href,
	verb,
	subject,
}: MainLinkOptionArgs) {
	return (
		<ChitterOption icon={icon}>
			<MainLink href={href}>
				<OptionText verb={verb} subject={subject} />
			</MainLink>
		</ChitterOption>
	)
}
