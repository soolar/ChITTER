import * as React from 'react'
import { Image, Tooltip } from '@chakra-ui/react'

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
	extraClass,
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

	return (
		<Tooltip label={tooltip}>
			<Image
				src={
					specialPath
						? image
						: chitImage
							? `/images/relayimages/chit/${image}`
							: `/images/itemimages/${image}`
				}
				className={classes.join(' ')}
				alt={image}
				onContextMenu={onContextMenu}
			/>
		</Tooltip>
	)
}
