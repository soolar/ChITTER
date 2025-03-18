import { EffectInfoModifier } from '../helpers'
import { videoGames } from './2010/gameGrid'
import { gapEffects } from './2010/gap'
import { augustScepterEffects } from './2023/augustScepter'
import { citizenOfAZone } from './2023/patrioticEagle'
import beatenUp from './evergreen/beatenUp'
import everythingLooksColorful from './evergreen/everythingLooksColorful'
import flavour, { needFlavour } from './evergreen/flavour'
import olfaction from './evergreen/olfaction'

export type EffectListEntry = [string, EffectInfoModifier]

const effectList: EffectListEntry[] = [
	// evergreen
	beatenUp,
	...flavour,
	...everythingLooksColorful,
	olfaction,

	// 2010
	videoGames,
	...gapEffects,

	// 2023
	citizenOfAZone,
	...augustScepterEffects,
]

export default effectList

export interface NeedableEffectInfo {
	condition: () => boolean
	neededDisplay: React.ReactNode
}

export const needableEffects: NeedableEffectInfo[] = [
	// evergreen
	needFlavour,
]
