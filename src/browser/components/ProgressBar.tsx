import { Box, Tooltip } from '@chakra-ui/react'

interface ProgressBarArgs {
	value: number
	max: number
	desc?: string
	vertical?: boolean
}

export default function ProgressBar({
	value,
	max,
	desc,
	vertical,
}: ProgressBarArgs) {
	const percent = value === max ? 100 : (100 * Math.min(value, max)) / max
	const percentVertical = 100 - percent
	const percentText = `${vertical ? percentVertical : percent}%`
	// TODO: Figure out why full doesn't work for height in vertical mode
	const bar = (
		<Box
			bgColor={vertical ? 'blue' : '#eeeeee'}
			w={vertical ? '1px' : 'full'}
			h={vertical ? '32px' : '4px'}
		>
			<Box
				bgColor={vertical ? '#eeeeee' : 'blue'}
				w={vertical ? 'full' : percentText}
				h={vertical ? percentText : 'full'}
			/>
		</Box>
	)
	return vertical ? (
		bar
	) : (
		<Tooltip
			label={`${value.toLocaleString()} / ${max.toLocaleString()}${
				desc !== '' ? ` ${desc}` : ''
			}`}
		>
			{bar}
		</Tooltip>
	)
}
