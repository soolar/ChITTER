import { Text, VStack } from '@chakra-ui/react'
import { GeneralInfo } from '../../../util/helpers'
import ChitterIcon from './ChitterIcon'
import ProgressBar from '../ProgressBar'

interface TypedChitterIconArgs<T> {
	info: GeneralInfo<T>
	tooltipStart: React.ReactNode
	tooltipEnd?: React.ReactNode
	small?: boolean
	medium?: boolean
	contextMenuCallback?: React.MouseEventHandler<HTMLImageElement>
}

export default function TypedChitterIcon<T>({
	info,
	tooltipStart,
	tooltipEnd,
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
			tooltip={
				<VStack spacing="none">
					{tooltipStart}
					{info.progress.map((prog) => (
						<VStack spacing="none">
							<Text className="popup-desc-line">
								{prog.value} / {prog.max} {prog.desc}
							</Text>
							<ProgressBar value={prog.value} max={prog.max} desc={prog.desc} />
						</VStack>
					))}
					{info.desc.map((node) => (
						<span className="popup-desc-line">{node}</span>
					))}
					{tooltipEnd}
				</VStack>
			}
			weirdoDiv={info.weirdoDiv}
			progress={info.progress}
		/>
	)
}
