import { getProperty, toSkill } from 'kolmafia'
import * as React from 'react'
//import { $skill, get } from 'libram'
import SkillPicker from './SkillPicker'

export default function PickerSweatpants() {
	const sweat = getProperty('sweat')
	return (
		<SkillPicker
			header={`Sweat Magic (${sweat}% sweaty)`}
			skills={[
				toSkill(`Sip Some Sweat`),
				toSkill(`Drench Yourself in Sweat`),
				toSkill(`Sweat Out Some Booze`),
				toSkill(`Make Sweat-Ade`),
				toSkill(`Sweat Flick`),
				toSkill(`Sweat Spray`),
				toSkill(`Sweat Flood`),
				toSkill(`Sweat Sip`),
			]}
		/>
	)
}
