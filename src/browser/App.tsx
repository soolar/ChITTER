import { ChakraProvider, Container } from '@chakra-ui/react';
import * as React from 'react';
import EffectsBrick from './components/Brick/EffectsBrick';
import FamiliarBrick from './components/Brick/FamiliarBrick';
import StatsBrick from './components/Brick/StatsBrick';
import theme from './theme';

export default function App() {
	return (
		<ChakraProvider theme={theme}>
			<Container maxW="full">
				<StatsBrick />
				<EffectsBrick />
				<FamiliarBrick />
			</Container>
		</ChakraProvider>
	);
}
