import * as React from 'react'
import { BrowserSkill } from '../../../guidelines'
import SkillOption from '../Option/SkillOption'
import Picker from './Picker'

interface SkillPickerArgs {
	skills: BrowserSkill[]
	header: string
}

export default function SkillPicker({ skills, header }: SkillPickerArgs) {
	return (
		<Picker
			header={header}
		>
			{ skills.map((skill) => <SkillOption skill={skill} />) }
		</Picker>
	)
}
