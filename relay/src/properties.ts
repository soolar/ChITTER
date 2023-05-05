import {
	canEquip,
	classModifier,
	closetAmount,
	creatableAmount,
	fileToBuffer,
	getProperty,
	hippyStoneBroken,
	inebrietyLimit,
	isUnrestricted,
	Item,
	itemAmount,
	myClass,
	myInebriety,
	myPath,
	myPrimestat,
	numericModifier,
	Path,
	print,
	propertyExists,
	Slot,
	Stat,
	StatType,
	storageAmount,
	toSlot,
	weaponHands,
} from 'kolmafia'
import { $class, $items, $skill, $slot, $slots, get, have } from 'libram'
import {
	booleanProperties,
	familiarProperties,
	numericOrStringProperties,
	numericProperties,
	stringProperties,
} from 'libram/dist/propertyTypes'
import { FieldValue, fieldValueToJSString } from './fieldValue'
import { foldableAmount } from './guidelines'

type ChitPropertyInfo = [string, FieldValue]

const chitProperties: ChitPropertyInfo[] = [
	['autoscroll', true],
	[
		'currencies',
		$items`disassembled clover, rad, hobo nickel, Freddy Kruegerand, Chroner, Beach Buck, Coinspiracy, FunFunds™, Volcoino, Wal-Mart gift certificate, BACON, buffalo dime, Source essence, cop dollar, sprinkles, Spacegate Research, Rubee™`,
	],
	['currencies.special', ['asdonmartinfuel']],
	['currencies.show', ['meat']],
	['character.avatar', true],
	['character.title', true],
	['clan.display', 'away'], // Valid values are on,off,away. Away will only display clan if chit.clan.home is not blank.
	['clan.home', ''],
	['disable', false],
	['familiar.anti-gollywog', true],
	['familiar.hiddengear', $items`none`],
	['familiar.protect', false],
	['familiar.showlock', false],
	[
		'familiar.hats',
		$items`spangly sombrero, sugar chapeau, chef's hat, party hat`,
	],
	[
		'familiar.pants',
		$items`spangly mariachi pants, double-ice britches, BRICKO pants, pin-stripe slacks, studded leather boxer shorts, monster pants, sugar shorts`,
	],
	[
		'familiar.weapons',
		$items`time sword, Hodgman's whackin' stick, astral mace, goatskin umbrella, dreadful glove, Stick-Knife of Loathing, Work is a Four Letter Sword`,
	],
	[
		'familiar.off-hands',
		$items`Kramco Sausage-o-Matic™, latte lovers member's mug, A Light that Never Goes Out, Half a Purse`,
	],
	['familiar.iconize-weirdos', false],
	['effects.classicons', 'none'],
	['effects.describe', true],
	['effects.modicons', true],
	['effects.showicons', true],
	['effects.usermap', false],
	[
		'gear.display.in-run',
		[
			'favorites:pull=true:create=true',
			'astral',
			'item',
			'-combat',
			'+combat',
			'quest:pull=true:create=true',
			'today',
			'ML:amount=2',
			'path',
			'prismatic res',
			'resistance:amount=2',
			'charter',
			'rollover',
			'DRUNK',
			'Wow',
			'exp',
		],
	],
	[
		'gear.display.in-run.defaults',
		['create=false', 'pull=false', 'amount=all'],
	],
	[
		'gear.display.aftercore',
		[
			'favorites:amount=all',
			'quest:amount=all',
			'charter:amount=all',
			'today:amount=all:create=false',
			'rollover',
			'DRUNK:amount=all',
		],
	],
	['gear.display.aftercore.defaults', ['create=true', 'pull=true', 'amount=1']],
	['gear.layout', 'default'],
	['gear.favorites', $items`none`],
	['gear.ignoreG-Lover', false],
	['gear.lattereminder', true],
	['helpers.dancecard', true],
	['helpers.semirare', true],
	['helpers.spookyraven', true],
	['helpers.wormwood', ['stats', 'spleen']],
	['helpers.xiblaxian', true],
	['kol.coolimages', true],
	['effects.layout', 'songs,buffs,intrinsics'],
	['floor.layout', 'update,familiar'],
	['roof.layout', 'character,stats,gear'],
	['stats.layout', 'muscle,myst,moxie|hp,mp,axel|mcd|drip|trail,florist'],
	['toolbar.layout', 'trail,quests,modifiers,elements,organs'],
	['walls.layout', 'helpers,thrall,robo,vykea,effects,horsery,boombox'],
	['quests.hide', false],
	['stats.showbars', true],
	['thrall.showname', false],
	['toolbar.moods', 'true'], // do not change to boolean, 'bonus' is also valid
]

const interpretPropVal = (propStr: string, defaultValue: FieldValue) => {
	if (propStr.startsWith('DEFAULT')) {
		if (Array.isArray(defaultValue) && defaultValue[0]?.toString() === 'none') {
			return []
		}
		return defaultValue
	}
	if (Array.isArray(defaultValue)) {
		if (defaultValue[0] instanceof Item) {
			return propStr.split('|').map((itemName) => Item.get(itemName))
		}
		if (typeof defaultValue[0] === 'string') {
			return propStr.split(/, ?/)
		}
		// probably shouldn't ever get here?
		return []
	}
	switch (typeof defaultValue) {
		case 'string':
			return propStr
		case 'boolean':
			return propStr === 'true'
		case 'number':
			return Number(propStr)
		// this shouldn't happen
		default:
			return null
	}
}

export const getPropVal = (propName: string) => {
	const propInfo = chitProperties.find((prop) => prop[0] === propName)
	if (propInfo) {
		const strVal = getProperty(`chit.${propName}`)
		const propDefault = propInfo[1]
		return interpretPropVal(strVal, propDefault)
	}
	return undefined
}
