import { Skill } from 'kolmafia'
import ChitterIcon from './ChitterIcon'
import { Text } from '@chakra-ui/react'

interface SkillIconArgs {
	skill: Skill
}

export default function SkillIcon({ skill }: SkillIconArgs) {
	return (
		<ChitterIcon
			image={skill.image}
			tooltip={<Text>{skill.name}</Text>}
			borderType="normal"
		/>
	)
}
