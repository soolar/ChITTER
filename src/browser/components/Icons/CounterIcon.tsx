import { Counter, getCounterInfo } from '../../../util/helpers'
import TypedChitterIcon from './TypedChitterIcon'

interface CounterIconArgs {
	counter: Counter
	small?: boolean
	medium?: boolean
}

export default function CounterIcon({
	counter,
	small,
	medium,
}: CounterIconArgs) {
	const info = getCounterInfo(counter)

	return (
		<TypedChitterIcon
			info={info}
			small={small}
			medium={medium}
			tooltipStart={info.displayName}
		/>
	)
}
