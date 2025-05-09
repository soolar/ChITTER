import { Box, HStack, Image, Tooltip } from '@chakra-ui/react'
import ProgressBar from '../ProgressBar'

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
	weirdoDiv?: React.ReactNode
	progress?: { value: number; max: number }[]
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
	weirdoDiv,
	progress,
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
	if (weirdoDiv) {
		classes.push('chit-icon-weird')
	}

	return (
		<Tooltip label={tooltip} onContextMenu={onContextMenu}>
			<HStack spacing="0">
				{weirdoDiv ? (
					<Box as="span" className={classes.join(' ')}>
						{weirdoDiv}
					</Box>
				) : (
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
					/>
				)}
				{progress &&
					progress.map((prog) => (
						<ProgressBar value={prog.value} max={prog.max} vertical />
					))}
			</HStack>
		</Tooltip>
	)
}
