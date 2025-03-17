import { ItemInfoModifier } from '../helpers'
import navelRing from './2007/navelRing'
import vMask from './2007/vMask'
import mayflies from './2008/mayflies'
import scratchNSniff from './2008/scratchNSniff'
import crownOfThrones from './2010/crownOfThrones'
import gap from './2010/gap'
import stinkyCheese from './2010/stinkyCheese'
import alicesArmy from './2011/alicesArmy'
import folderHolder from './2013/folderHolder'
import pantsgiving from './2013/pantsgiving'
import buddyBjorn from './2014/buddyBjorn'
import edpiece from './2015/edpiece'
import ltt from './2016/ltt'
import daylightShavings from './2021/daylightShavings'
import { designerSweatpants } from './2022/designerSweatpants'
import juneCleaver from './2022/juneCleaver'
import { cinchoDeMayo } from './2023/cinchoDeMayo'
import cursedMonkeysPaw from './2023/cursedMonkeysPaw'
import currencies from './currency'
import boneAbacus from './evergreen/boneAbacus'

export type ItemListEntry = [string, ItemInfoModifier]

const itemList: ItemListEntry[] = [
	// Couldn't be bothered to split these apart by year
	...currencies,

	// evergreen
	boneAbacus,

	// 2007
	navelRing,
	vMask,

	// 2008
	mayflies,
	...scratchNSniff,

	// 2010
	...stinkyCheese,
	crownOfThrones,
	gap,

	// 2011
	alicesArmy,

	// 2013
	folderHolder,
	pantsgiving,

	// 2014
	buddyBjorn,

	// 2015
	edpiece,

	// 2016
	ltt,

	// 2021
	daylightShavings,

	// 2022
	juneCleaver,
	designerSweatpants,

	// 2023
	cursedMonkeysPaw,
	...cinchoDeMayo,
]

export default itemList
