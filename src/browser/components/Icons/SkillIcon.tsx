import { Skill } from 'kolmafia'
import { getSkillInfo } from '../../../util/helpers'
import TypedChitterIcon from './TypedChitterIcon'

interface SkillIconArgs {
	skill: Skill
}

export default function SkillIcon({ skill }: SkillIconArgs) {
	const info = getSkillInfo(skill)
	// TODO: Better tooltip, add contextMenuCallback
	return <TypedChitterIcon info={info} tooltipStart={info.displayName} />
}
