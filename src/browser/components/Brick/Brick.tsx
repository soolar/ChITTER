import { Box, Center, GridItem, Heading, SimpleGrid } from '@chakra-ui/react'
import * as React from 'react'

interface BrickArgs {
	name: string
	header: string | React.ReactNode
	children: React.ReactNode
	footer?: React.ReactNode
}

export default function Brick({ name, header, children, footer }: BrickArgs) {
	return (
		<Box p={1} shadow="md" borderWidth="1px">
			<SimpleGrid id={`chit-brick-${name}`}>
				<GridItem bgColor="#efefef">
					{typeof header === 'string' ? (
						<Heading>
							<Center>{header}</Center>
						</Heading>
					) : (
						<>{header}</>
					)}
				</GridItem>
				<GridItem>{children}</GridItem>
				{footer && <GridItem>{footer}</GridItem>}
			</SimpleGrid>
		</Box>
	)
}
