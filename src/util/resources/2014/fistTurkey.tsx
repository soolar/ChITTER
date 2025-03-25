import { $familiar, get } from 'libram'
import { FamListEntry } from '../famList'

const fistTurkey: FamListEntry = [
	$familiar`Fist Turkey`.identifierString,
	(famInfo) => {
		famInfo.dropsInfo.push(
			{ drop: 'mus', dropped: get('_turkeyMuscle'), limit: 5 },
			{ drop: 'mys', dropped: get('_turkeyMyst'), limit: 5 },
			{ drop: 'mox', dropped: get('_turkeyMoxie'), limit: 5 },
		)
	},
]

export default fistTurkey
