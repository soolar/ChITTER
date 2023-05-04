import { Box, Tooltip } from '@chakra-ui/react'
import * as React from 'react'

interface ProgressBarArgs {
	value: number
	max: number
	desc?: string
}

export default function ProgressBar({ value, max, desc }: ProgressBarArgs) {
	const width = (100 * Math.min(value, max)) / max
	return (
		<Tooltip
			label={`${value.toLocaleString()} / ${max.toLocaleString()}${
				desc !== '' ? ` ${desc}` : ''
			}`}
		>
			<Box bgColor="#eeeeee" w="full" h="4px">
				<Box w={`${width}%`} bgColor="blue" h="full" />
			</Box>
		</Tooltip>
	)
}
