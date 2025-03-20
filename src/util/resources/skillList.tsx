import { SkillInfoModifier } from '../helpers'
import { designerSweatpantsSkills } from './2022/designerSweatpants'
import { cinchoDeMayoSkills } from './2023/cinchoDeMayo'
import { batWingsSkills } from './2024/batWings'

export type SkillListEntry = [string, SkillInfoModifier]

const skillList: SkillListEntry[] = [
	// 2022
	...designerSweatpantsSkills,

	// 2023
	...cinchoDeMayoSkills,

	// 2024
	...batWingsSkills,
]

export default skillList
