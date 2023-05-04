import * as React from 'react'
import ChitterOption from './ChitterOption'
import OptionText from './OptionText'
import { Button } from '@chakra-ui/react'
import SkillIcon from '../Icons/SkillIcon'
import { getExtraSkillInfo } from '../../skillHelpers'
import { Skill } from 'kolmafia'

interface SkillOptionArgs {
	skill: Skill
}

export default function SkillOption({ skill }: SkillOptionArgs) {
	const extraInfo = getExtraSkillInfo(skill)

	return (
		<ChitterOption
			icon={<SkillIcon skill={skill} />}
			enabled={extraInfo.usable}
		>
			{extraInfo.usable ? (
				<Button variant="link">
					<OptionText
						verb="Cast"
						subject={skill.name}
						append={extraInfo.append}
						desc={extraInfo.desc}
					/>
				</Button>
			) : (
				<OptionText
					subject={skill.name}
					append={extraInfo.append}
					desc={extraInfo.desc}
				/>
			)}
		</ChitterOption>
	)
}
