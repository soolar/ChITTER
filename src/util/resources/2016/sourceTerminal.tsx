import { CounterListEntry } from '../counterList'
import { get } from 'libram'

export const digitizeCounter: CounterListEntry = [
	'Digitize Monster',
	(counterInfo) => {
		const digitizeMonster = get('_sourceTerminalDigitizeMonster')?.toString()
		const digitizeCount = get('_sourceTerminalDigitizeMonsterCount')
		counterInfo.desc.push(`${digitizeMonster} #${digitizeCount}`)
	},
]
