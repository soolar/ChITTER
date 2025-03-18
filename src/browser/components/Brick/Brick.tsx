import { Box, Center, GridItem, Heading, SimpleGrid } from '@chakra-ui/react'
import MainLink from '../Link/MainLink'

interface BrickArgs {
	name: string
	header: string | React.ReactNode
	headerHref?: string
	children: React.ReactNode
	footer?: React.ReactNode
}

export default function Brick({
	name,
	header,
	headerHref,
	children,
	footer,
}: BrickArgs) {
	const headerBlock =
		typeof header === 'string' ? (
			<Heading>
				<Center>{header}</Center>
			</Heading>
		) : (
			<>{header}</>
		)
	return (
		<Box p={1} shadow="md" borderWidth="1px" className="chit-brick">
			<SimpleGrid id={`chit-brick-${name}`}>
				<GridItem bgColor="#efefef">
					{headerHref ? (
						<MainLink href={headerHref}>{headerBlock}</MainLink>
					) : (
						headerBlock
					)}
				</GridItem>
				<GridItem>{children}</GridItem>
				{footer && <GridItem>{footer}</GridItem>}
			</SimpleGrid>
		</Box>
	)
}
