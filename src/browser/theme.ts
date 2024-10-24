import { extendTheme, withDefaultSize } from '@chakra-ui/react'

const theme = extendTheme(
	{
		fonts: {
			body: 'Arial, Helvetica, sans-serif',
			heading: 'Arial, Helvetica, sans-serif',
		},
		fontSizes: {
			xs: '12px',
		},
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
		breakpoints: {
			sm: '20em',
			md: '25em',
			lg: '30em',
			xl: '40em',
			'2xl': '50em',
		},
	},
	withDefaultSize({
		size: 's',
		components: ['Heading'],
	}),
)

export default theme
