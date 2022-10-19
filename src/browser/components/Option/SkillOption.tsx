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
	enabled?: boolean
}

export default function SkillOption({
	skill,
	desc,
	append,
	enabled,
}: SkillOptionArgs) {
	const realEnabled = enabled === undefined ? true : enabled
	const verb = realEnabled ? 'Cast' : undefined

	return (
		<ChitterOption icon={<SkillIcon skill={skill} />} enabled={realEnabled}>
			<Button variant="link">
				<OptionText
					verb={verb}
					subject={skill.name}
					append={append}
					descline={desc}
				/>
			</Button>
		</ChitterOption>
	)
}
