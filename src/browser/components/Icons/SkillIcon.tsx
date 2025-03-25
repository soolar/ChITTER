import { Skill } from 'kolmafia'
import ChitterIcon from './ChitterIcon'
import { getSkillInfo } from '../../../util/helpers'

interface SkillIconArgs {
	skill: Skill
}

export default function SkillIcon({ skill }: SkillIconArgs) {
	const info = getSkillInfo(skill)
	return (
		<ChitterIcon
			image={info.image}
			tooltip={info.displayName}
			borderType="normal"
		/>
	)
}
