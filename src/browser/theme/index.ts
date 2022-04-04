import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
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
});

export default theme;
