import { Center, Image, Spinner, Tooltip } from '@chakra-ui/react'
import * as React from 'react'

export type BorderType =
	| 'normal'
	| 'has-drops'
	| 'all-drops'
	| 'good'
	| 'warning'
	| 'danger'
	| 'none'

interface ChitterIconArgs {
	image: string
	tooltip: React.ReactNode
	borderType?: BorderType
	specialPath?: boolean
	extraClass?: string
	small?: boolean
	onContextMenu?: React.MouseEventHandler<HTMLImageElement>
	chitImage?: boolean
}

export default function ChitterIcon({
	image,
	tooltip,
	borderType = 'normal',
	specialPath = false,
	extraClass = '',
	small,
	onContextMenu,
	chitImage,
}: ChitterIconArgs) {
	const classes = ['chit-icon']
	if (borderType !== 'normal') {
		classes.push(`border-${borderType}`)
	}
	if (small) {
		classes.push('small')
	}
	if (extraClass) {
		classes.push(extraClass)
	}
	const classStr = classes.join(' ')

	return (
		<Tooltip label={tooltip}>
			{image ? (
				<Image
					src={
						specialPath
							? image
							: chitImage
							? `/images/relayimages/chit/${image}`
							: `/images/itemimages/${image}`
					}
					className={classStr}
					alt={image}
					onContextMenu={onContextMenu}
				/>
			) : (
				<Center width="32px" height="32px" className={classStr}>
					<Spinner speed="1s" />
				</Center>
			)}
		</Tooltip>
	)
}
