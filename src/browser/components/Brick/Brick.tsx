import { Box, GridItem, SimpleGrid } from '@chakra-ui/react';
import * as React from 'react';

interface BrickArgs {
	name: string;
	header: React.ReactNode;
	body: React.ReactNode;
	footer: React.ReactNode;
}

export default function Brick({ name, header, body, footer }: BrickArgs) {
	return (
		<Box p={1} shadow="md" borderWidth="1px">
			<SimpleGrid id={`chit-brick-${name}`}>
				<GridItem>{header}</GridItem>
				<GridItem>{body}</GridItem>
				<GridItem>{footer}</GridItem>
			</SimpleGrid>
		</Box>
	);
}
