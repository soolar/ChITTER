import { ChakraProvider, Container } from '@chakra-ui/react'
import * as React from 'react'
import CharacterBrick from './components/Brick/CharacterBrick'
import EffectsBrick from './components/Brick/EffectsBrick'
import FamiliarBrick from './components/Brick/FamiliarBrick'
import GearBrick from './components/Brick/GearBrick'
import StatsBrick from './components/Brick/StatsBrick'
import theme from './theme'

export default function App() {
	return (
		<ChakraProvider theme={theme}>
			<Container maxW="full" p="2px">
				<CharacterBrick />
				<StatsBrick />
				<GearBrick />
				<EffectsBrick />
				<FamiliarBrick />
			</Container>
		</ChakraProvider>
	)
}
