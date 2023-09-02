import * as React from 'react'
import { $skills, get } from 'libram'
import SkillPicker from './SkillPicker'

export default function PickerSweatpants() {
	const sweat = get('sweat')
	return (
		<SkillPicker
			header={`Sweat Magic (${sweat}% sweaty)`}
			skills={$skills`Sip Some Sweat, Drench Yourself in Sweat, Sweat Out Some Booze, Make Sweat-Ade, Sweat Flick, Sweat Spray, Sweat Flood, Sweat Sip`}
		/>
	)
}
