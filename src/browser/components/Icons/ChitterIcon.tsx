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
	medium?: boolean
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
	medium,
	onContextMenu,
	chitImage,
}: ChitterIconArgs) {
	const classes = ['chit-icon']
	if (borderType !== 'normal') {
		classes.push(`border-${borderType}`)
	}
	if (small) {
		classes.push('small')
	} else if (medium) {
		classes.push('medium')
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
