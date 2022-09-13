import { extendTheme, withDefaultSize } from '@chakra-ui/react'

const theme = extendTheme(
	{
		components: {
			Button: {
				variants: {
					link: {
						rounded: 'none',
						padding: '0px',
						margin: '0px',
					},
				},
			},
		},
	},
	withDefaultSize({
		size: 's',
		components: ['Heading'],
	})
)

export default theme
