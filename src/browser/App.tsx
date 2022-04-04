import { ChakraProvider, Container } from '@chakra-ui/react';
import * as React from 'react';
import FamiliarBrick from './components/Brick/FamiliarBrick';
import theme from './theme';

export default function App() {
	return (
		<ChakraProvider theme={theme}>
			<Container maxW="full">
				<FamiliarBrick />
			</Container>
		</ChakraProvider>
	);
}
