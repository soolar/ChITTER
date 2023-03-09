import { getProperty, Item, propertyExists } from 'kolmafia'
import { $items, get } from 'libram'
import {
	booleanProperties,
	familiarProperties,
	numericOrStringProperties,
	numericProperties,
	stringProperties,
} from 'libram/dist/propertyTypes'
import { FieldValue, fieldValueToJSString } from './fieldValue'
import { BrowserItem } from './guidelines'

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
	// 'gear.favorites' is handled by items.favorites in guidelines.ts
	//['gear.favorites', $items`none`],
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

const getPropVal = (propStr: string, defaultValue: FieldValue) => {
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

type BrowserChitProperty = string | string[] | boolean | BrowserItem[]

export interface BrowserChitProperties {
	[key: string]: BrowserChitProperty
}

export interface BrowserMafiaProperties {
	[key: string]: FieldValue
}

export const buildProperties = () => {
	const res = ['\t\t\tvar chitProperties = {\n']
	res.push(
		...chitProperties.map((propInfo) => {
			const propName = `chit.${propInfo[0]}`
			if (propertyExists(propName)) {
				const propStr = getProperty(propName)
				const propVal = getPropVal(propStr, propInfo[1])
				return `\t\t\t\t"${propInfo[0]}": ${fieldValueToJSString(propVal)},\n`
			}
			return ''
		})
	)
	res.push('\t\t\t}\n\n\t\t\tvar mafiaProperties = {\n')
	function addProps<T>(propList: T) {
		res.push(
			...(propList as string[]).map(
				(propName) =>
					`\t\t\t\t"${propName}": ${fieldValueToJSString(get(propName))},\n`
			)
		)
	}
	// Missing, will require implementation of underlying type:
	// monsterProperties, locationProperties, phylumProperties,
	// statProperties
	addProps(booleanProperties)
	addProps(numericProperties)
	addProps(stringProperties)
	addProps(numericOrStringProperties)
	addProps(familiarProperties)
	res.push('\t\t\t}\n')
	return res.join('')
}
