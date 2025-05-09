import { Box, Tooltip } from '@chakra-ui/react'
import { clamp } from 'libram'

interface ProgressBarArgs {
	value: number
	max: number
	desc?: string
	vertical?: boolean
	thin?: boolean
}

export default function ProgressBar({
	value,
	max,
	desc,
	vertical,
	thin,
}: ProgressBarArgs) {
	const percent = value === max ? 100 : (100 * clamp(value, 0, max)) / max
	const percentVertical = 100 - percent
	const percentText = `${vertical ? percentVertical : percent}%`
	// TODO: Figure out why full doesn't work for height in vertical mode
	const bar = (
		<Box
			bgColor={vertical ? 'blue' : '#eeeeee'}
			w={vertical ? '1px' : 'full'}
			h={vertical ? '32px' : thin ? '2px' : '4px'}
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
