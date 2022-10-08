import * as React from 'react'
import ChitterIcon from './ChitterIcon'
import { BrowserSkill } from '../../../guidelines'
import { Text } from '@chakra-ui/react'

interface SkillIconArgs {
	skill: BrowserSkill
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
