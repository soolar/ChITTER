import * as React from 'react'
import ChitterOption from './ChitterOption'
import OptionText from './OptionText'
import { BrowserSkill } from '../../../guidelines'
import { Button } from '@chakra-ui/react'
import SkillIcon from '../Icons/SkillIcon'
import { getExtraSkillInfo } from '../../skillHelpers'

interface SkillOptionArgs {
	skill: BrowserSkill
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
