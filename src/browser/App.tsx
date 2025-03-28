import { ChakraProvider } from '@chakra-ui/react'
import { RefreshContextProvider } from 'tome-kolmafia-react'
import theme from './theme'
import Layout from './Layout'

export default function App() {
	return (
		<ChakraProvider theme={theme}>
			<RefreshContextProvider>
				<Layout />
			</RefreshContextProvider>
		</ChakraProvider>
	)
}
