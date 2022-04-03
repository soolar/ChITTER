import { ChakraProvider, Container } from '@chakra-ui/react';
import * as React from 'react';
import FamiliarBrick from './components/Brick/FamiliarBrick';

export default function App() {
	return (
		<ChakraProvider>
			<Container maxW="full">
				<FamiliarBrick />
			</Container>
		</ChakraProvider>
	);
}
