import { Skill, toInt } from 'kolmafia'
import * as React from 'react'
import SkillOption from '../Option/SkillOption'
import Picker from './Picker'

interface SkillPickerArgs {
	skills: Skill[]
	header: string
}

export default function SkillPicker({ skills, header }: SkillPickerArgs) {
	return (
		<Picker header={header}>
			{skills.map((skill) => (
				<SkillOption key={toInt(skill)} skill={skill} />
			))}
		</Picker>
	)
}
