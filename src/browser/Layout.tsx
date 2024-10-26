import { useContext } from 'react'
import { Container } from '@chakra-ui/react'
import { RefreshContext } from 'tome-kolmafia'
import FamiliarBrick from './components/Brick/FamiliarBrick'
import GearBrick from './components/Brick/GearBrick'

export default function Layout() {
	useContext(RefreshContext)

	return (
		<Container paddingX={0} fontSize="sm">
			<GearBrick />
			<FamiliarBrick />
		</Container>
	)
}
