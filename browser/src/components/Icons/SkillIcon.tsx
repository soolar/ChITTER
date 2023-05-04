import * as React from 'react'
import ChitterIcon from './ChitterIcon'
import { Text } from '@chakra-ui/react'
import { Skill } from 'kolmafia'

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
