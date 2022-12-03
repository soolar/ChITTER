import { Image, Tooltip } from '@chakra-ui/react'
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
	onClick?: React.MouseEventHandler<HTMLImageElement>
}

export default function ChitterIcon({
	image,
	tooltip,
	borderType = 'normal',
	specialPath = false,
	extraClass = '',
	small,
	onClick,
}: ChitterIconArgs) {
	return (
		<Tooltip label={tooltip}>
			<Image
				src={specialPath ? image : `/images/itemimages/${image}`}
				className={`chit-icon${borderType !== 'none' ? ` ${borderType}` : ''}${
					extraClass ? ` ${extraClass}` : ''
				}`}
				alt={image}
				maxWidth={small ? '16px' : '32px'}
				maxHeight={small ? '16px' : '32px'}
				onClick={onClick}
			/>
		</Tooltip>
	)
}
