import { Skill, useSkill } from 'kolmafia'
import React from 'react'
import ChitterOption from './ChitterOption'
import SkillIcon from '../Icons/SkillIcon'
import ActionLink from '../Link/ActionLink'
import OptionText from './OptionText'
import { getSkillInfo } from '../../../util/skillHelpers'

interface SkillOptionArgs {
	skill: Skill
}

export default function SkillOption({ skill }: SkillOptionArgs) {
	const info = getSkillInfo(skill)
	return (
		<ChitterOption icon={<SkillIcon skill={skill} />} enabled={info.usable}>
			{info.usable ? (
				<ActionLink callback={() => useSkill(skill)}>
					<OptionText
						verb="cast"
						subject={skill.name}
						append={info.append}
						desc={info.desc}
					/>
				</ActionLink>
			) : (
				<OptionText
					subject={skill.name}
					append={info.append}
					desc={info.desc}
				/>
			)}
		</ChitterOption>
	)
}
