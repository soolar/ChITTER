import { FamInfoModifier } from '../helpers'
import temporalRiftlet from './2005/temporalRiftlet'
import reagnimatedGnome from './2012/reagnimatedGnome'
import steamPoweredCheerleader from './2013/steamPoweredCheerleader'
import crimboShrub from './2014/crimboShrub'
import fistTurkey from './2014/fistTurkey'
import melodramedary from './2020/melodramedary'
import gelatinousCubeling from './evergreen/gelatinousCubeling'
import slimeling from './evergreen/slimeling'

export type FamListEntry = [string, FamInfoModifier]

const famList: FamListEntry[] = [
	// evergreen
	gelatinousCubeling,
	slimeling,

	// 2005
	temporalRiftlet,

	// 2012
	reagnimatedGnome,

	// 2013
	steamPoweredCheerleader,

	// 2014
	fistTurkey,
	crimboShrub,

	// 2020
	melodramedary,
]

export default famList
