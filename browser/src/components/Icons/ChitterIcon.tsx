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

export type IconSize = 'tiny' | 'small' | 'medium' | 'full'

interface ChitterIconArgs {
	image: string
	tooltip: React.ReactNode
	borderType?: BorderType
	specialPath?: boolean
	extraClass?: string
	size?: IconSize
	onContextMenu?: React.MouseEventHandler<HTMLImageElement>
	chitImage?: boolean
}

export default function ChitterIcon({
	image,
	tooltip,
	borderType = 'normal',
	specialPath = false,
	extraClass = '',
	size = 'full',
	onContextMenu,
	chitImage,
}: ChitterIconArgs) {
	const classes = ['chit-icon']
	if (borderType !== 'normal') {
		classes.push(`border-${borderType}`)
	}
	if (size && size !== 'full') {
		classes.push(size)
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
