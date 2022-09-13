import { Box, GridItem, SimpleGrid } from '@chakra-ui/react'
import * as React from 'react'

interface BrickArgs {
	name: string
	header: React.ReactNode
	children: React.ReactNode
	footer?: React.ReactNode
}

export default function Brick({ name, header, children, footer }: BrickArgs) {
	return (
		<Box p={1} shadow="md" borderWidth="1px">
			<SimpleGrid id={`chit-brick-${name}`}>
				<GridItem bgColor="#efefef">{header}</GridItem>
				<GridItem>{children}</GridItem>
				<GridItem>{footer}</GridItem>
			</SimpleGrid>
		</Box>
	)
}
