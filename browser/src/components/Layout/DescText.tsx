import { Text } from '@chakra-ui/react'
import * as React from 'react'

interface DescTextArgs {
	children: React.ReactNode
	isTooltip?: boolean
}

export default function DescText({ children, isTooltip }: DescTextArgs) {
	return (
		<Text className={isTooltip ? 'popup-desc-line' : 'desc-line'}>
			{children}
		</Text>
	)
}

interface DescTextShorthandArgs {
	children: React.ReactNode
}

export function DescTextTooltip({ children }: DescTextShorthandArgs) {
	return <DescText isTooltip>{children}</DescText>
}

export function DescTextNonTooltip({ children }: DescTextShorthandArgs) {
	return <DescText>{children}</DescText>
}
