import { SkillInfoModifier } from '../helpers'
import { designerSweatpantsSkills } from './2022/designerSweatpants'
import { cinchoDeMayoSkills } from './2023/cinchoDeMayo'

export type SkillListEntry = [string, SkillInfoModifier]

const skillList: SkillListEntry[] = [
	// 2022
	...designerSweatpantsSkills,

	// 2023
	...cinchoDeMayoSkills,
]

export default skillList
