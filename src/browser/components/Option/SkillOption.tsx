import * as React from 'react'
import ChitterOption from './ChitterOption'
import OptionText from './OptionText'
import { BrowserSkill } from '../../../guidelines'
import { Button } from '@chakra-ui/react'
import SkillIcon from '../Icons/SkillIcon'

interface SkillOptionArgs {
	skill: BrowserSkill
	desc: string
	append?: string
}

export default function SkillOption({ skill, desc, append }: SkillOptionArgs) {
	return (
		<ChitterOption icon={<SkillIcon skill={skill} />}>
			<Button variant="link">
				<OptionText
					verb="Cast"
					subject={skill.name}
					append={append}
					descline={desc}
				/>
			</Button>
		</ChitterOption>
	)
}
