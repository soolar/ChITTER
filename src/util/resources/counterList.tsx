import { CounterInfoModifier } from '../helpers'
import { digitizeCounter } from './2016/sourceTerminal'

export type CounterListEntry = [string, CounterInfoModifier]

const counterList: CounterListEntry[] = [
	// 2016
	digitizeCounter,
]

export default counterList
