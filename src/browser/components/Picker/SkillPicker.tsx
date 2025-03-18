import { Skill } from 'kolmafia'
import Picker from './Picker'
import SkillOption from '../Option/SkillOption'

interface SkillPickerArgs {
	skills: Skill[]
	header: string
}

export default function SkillPicker({ skills, header }: SkillPickerArgs) {
	return (
		<Picker header={header}>
			{skills.map((skill) => (
				<SkillOption key={skill.identifierString} skill={skill} />
			))}
		</Picker>
	)
}
