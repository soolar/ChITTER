import { GeneralInfo } from '../../../util/helpers'
import ChitterIcon from './ChitterIcon'

interface TypedChitterIconArgs<T> {
	info: GeneralInfo<T>
	children: React.ReactNode
	small?: boolean
	medium?: boolean
	contextMenuCallback?: React.MouseEventHandler<HTMLImageElement>
}

export default function TypedChitterIcon<T>({
	info,
	children,
	small,
	medium,
	contextMenuCallback,
}: TypedChitterIconArgs<T>) {
	return (
		<ChitterIcon
			image={info.image}
			borderType={info.borderType}
			small={small}
			medium={medium}
			onContextMenu={contextMenuCallback}
			tooltip={children}
			weirdoDiv={info.weirdoDiv}
		/>
	)
}
