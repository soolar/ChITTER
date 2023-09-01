import { HStack, Image } from '@chakra-ui/react'
import * as React from 'react'
import {
	Class,
	Familiar,
	familiarWeight,
	Item,
	Skill,
	stringModifier,
	toEffect,
	toItem,
} from 'kolmafia'
import { $familiar, $items, get } from 'libram'

export function getWeirdoDivContents(fam: Familiar) {
	switch (fam) {
		case $familiar`Melodramedary`:
			return (
				<HStack className="chit-icon" spacing="0">
					<Image src="/images/otherimages/camelfam_left.gif" border={0} />
					{Array(Math.floor(familiarWeight(fam) / 5)).fill(
						<Image src="/images/otherimages/camelfam_middle.gif" border={0} />,
					)}
					<Image src="/images/otherimages/camelfam_right.gif" border={0} />
				</HStack>
			)
	}

	return null
}

export interface CurrMax {
	curr: number
	max: number
}

export interface StatValues {
	base: number
	buffed: number
	substats: number
}

export function pluralize(thing: string | Item | undefined, amount: number) {
	if (typeof thing === 'string') {
		if (thing.slice(-1) === 's') {
			return amount === 1 ? thing.slice(0, -1) : thing
		}
		if (amount === 1) {
			return thing
		}
		if (thing.slice(-1) === 'y') {
			return `${thing.slice(0, -1)}ies`
		}
		return `${thing}s`
	}
	if (thing === undefined) {
		return amount === 1 ? 'none' : 'nones'
	}
	return amount === 1 ? thing.name : thing.plural
}

type ModShorthand = [RegExp, string]

const modShorthands: ModShorthand[] = [
	// remove "Familiar Effects" (info about what they do on pants/shirt fams
	[/Familiar Effect: "[^"]+"/, ''],
	// remove softcore only because it's not relevant here
	[/Softcore Only/, ''],
	// remove 0 modifiers (from things that are conditional when the condition isn't met)
	[/[^,]+ \+?0(?:,|$)/g, ''],
	// same with free pull
	[/Free Pull/, ''],
	[/Lasts Until Rollover(: true)?/, 'Melts'],
	[/ Percent/g, '%'],
	[/Muscle/g, 'Mus'],
	[/Mysticality/g, 'Mys'],
	[/Moxie/g, 'Mox'],
	[/Monster Level/g, 'ML'],
	[/Maximum/g, 'Max'],
	[/Damage Absorption/g, 'DA'],
	[/Damage Reduction/g, 'DR'],
	[/Damage/g, 'Dmg'],
	[/Resistance/g, 'Res'],
	[/Experience/g, 'Exp'],
	[/Familiar/g, 'Fam'],
	[/Weapon/g, 'Wpn'],
	[/Initiative/g, 'Init'],
	[/Hobo Power/g, 'Hobo'],
	[/Pool Skill/g, 'Pool'],
	[/Smithsness/g, 'Smith'],
	[/Critical/g, 'Crit'],
	// Make it so that pickpocket will get a +X% later
	[/Pickpocket Chance:/g, 'PP %:'],
	[/Fishing Skill/g, 'Fishing'],
	[/Adventures/g, 'Adv'],
	[/PvP Fights/g, 'Fites'],
	// Combine regen min and max in to a range
	[
		/((HP|MP|HP\/MP) Regen )Min: ([+-]?[\d.]+), \1Max: \+?(-?[\d.]+)/g,
		'$1$3-$4',
	],
	// simplify regen ranges that are identical
	[/\b([\d.]+)-\1\b/g, '$1'],
	// Exp%: +5 -> Exp +5% (there is sometimes no : for some reason)
	[/%:? ([+-]?[\d.]+)/g, ' $1%'],
	// Wpn +5% looks too weird, extend it back to Weapon +5% for the drops case
	[/Wpn Drop/g, 'Weapon Drop'],
	// Item Drop: +5 -> Item +5% and such
	[/Drop: ([+-]?[\d.]+)/g, ' $1%'],
	// remove colons
	[/:/g, ''],
	// Add missing + for some positives, but not ranges
	[/ ([\d.]+)([^-\d.]|$)/g, ' +$1$2'],
	// Reformat rollover effects. Hopefully this really is always in this order
	[
		/Rollover Effect "([^"]+)", Rollover Effect Duration \+(\d+)/g,
		'$2 Rollover Turns $1',
	],
	// class name shorthands
	[/Seal Clubber/g, 'SC'],
	[/Turtle Tamer/g, 'TT'],
	[/Sauceror/g, 'S'],
	[/Pastamancer/g, 'PM'],
	[/Disco Bandit/g, 'DB'],
	[/Accordion Thief/g, 'AT'],
	// Rearrange class restriction
	[/Class "([^"]+)"/g, '$1 Only'],
	// shorthand watches
	[/Nonstackable Watch/, 'Watch'],
	// sometimes there's a True after boolean properties
	[/ True(,|$)/g, '$1'],
	// rephrase familiar weight
	[/Fam Weight ([+-]?\d+)(,|$)/g, 'Fam $1lbs$2'],
]

// these shorthands are called repeatedly until nothing changes
const cleanupShorthands: ModShorthand[] = [
	[/, *,/g, ','],
	[/^ *, */, ''],
	[/, *$/, ''],
]

interface ModCombinationInfo {
	mods: string[]
	fuseName: string
}

const modCombinations: ModCombinationInfo[] = [
	{
		mods: ['Mus', 'Mys', 'Mox'],
		fuseName: 'Stats',
	},
	{
		mods: ['Hot', 'Cold', 'Spooky', 'Stench', 'Sleaze'],
		fuseName: 'Prismatic',
	},
	{
		mods: ['HP', 'MP'],
		fuseName: 'HP/MP',
	},
	{
		mods: ['Wpn Dmg', 'Spell Dmg'],
		fuseName: 'All Dmg',
	},
	...['Hot', 'Cold', 'Spooky', 'Stench', 'Sleaze', 'Prismatic'].map(
		(name): ModCombinationInfo => {
			return {
				mods: [`${name} Dmg`, `${name} Spell Dmg`],
				fuseName: `All ${name} Dmg`,
			}
		},
	),
	{
		mods: ['Adv', 'Fites'],
		fuseName: 'Adv/Fites',
	},
]

export function parseMods(mods: string, verbose = false) {
	const verbosePrint = verbose
		? (msg: string) => console.log(msg)
		: (msg: string) => void msg

	verbosePrint(`Pre-parsed: ${mods}`)

	const originalValue = mods

	// Capitalize all words
	mods = mods.replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
	verbosePrint(`Capitalized: ${mods}`)
	// Uncapitalize after apostrophes
	mods = mods.replace(/'[A-Z]/g, (letter) => letter.toLowerCase())
	verbosePrint(`Uncapped after apostrophes: ${mods}`)
	// Move parenthesized segments to start
	// ie "Experience (Moxie): +5" -> "Moxie Experience: +5"
	mods = mods.replace(/(, ?|^)([^,(]*?) \(([^)]+)\)/g, (match, ...groups) => {
		void match
		return `${groups[0]}${groups[2]} ${groups[1]}`
	})
	verbosePrint(`Rearranged: ${mods}`)

	const handleShorthand = (modShorthand: ModShorthand) => {
		mods = mods.replace(modShorthand[0], modShorthand[1])
		verbosePrint(
			`After shorthanding ${modShorthand[0]} to ${modShorthand[1]}: ${mods}`,
		)
	}

	modShorthands.forEach(handleShorthand)

	modCombinations.forEach((modComboInfo) => {
		verbosePrint(`Checking mod combo starting with ${modComboInfo.mods[0]}`)
		const initialPattern = `\\b[^,]*${modComboInfo.mods[0]}[^+-\\d]* (\\+|-)?\\d+(-\\d+)?%?`
		const regexp = new RegExp(initialPattern, 'g')
		let matchInfo
		while ((matchInfo = regexp.exec(mods)) !== null) {
			const initialMatch = matchInfo[0]
			verbosePrint(`Found ${initialMatch}`)
			const confirmMatch = () => {
				for (let i = 1; i < modComboInfo.mods.length; ++i) {
					const thisFind = initialMatch.replace(
						modComboInfo.mods[0],
						modComboInfo.mods[i],
					)
					if (mods.indexOf(thisFind) < 0) {
						verbosePrint(`Did not find ${thisFind}`)
						return false
					}
					verbosePrint(`Found ${thisFind}`)
				}
				return true
			}
			if (confirmMatch()) {
				verbosePrint('Confirmed combination presence')
				// replace the first and strip the rest
				const replacement = initialMatch.replace(
					modComboInfo.mods[0],
					modComboInfo.fuseName,
				)
				mods = mods.replace(initialMatch, replacement)
				verbosePrint(`After initial combo replace: ${mods}`)
				for (let i = 1; i < modComboInfo.mods.length; ++i) {
					const thisRemoval = initialMatch.replace(
						modComboInfo.mods[0],
						modComboInfo.mods[i],
					)
					mods = mods.replace(`, ${thisRemoval}`, '')
					verbosePrint(`After removal of ${thisRemoval}: ${mods}`)
					// in case it was at the beginning
					const beginningRemoval = new RegExp(
						`^${thisRemoval.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(, |$)`,
					)
					mods = mods.replace(beginningRemoval, '')
					verbosePrint(`After beginning removal: ${mods}`)
				}
			}
		}
	})

	// Prismatize
	mods = mods.replace(
		/( |^)([^,]*Prismatic[^,]*)(,|$)/g,
		(sub: string, ...args: string[]) => {
			void sub
			const elementOrder = ['Hot', 'Sleaze', 'Stench', 'Cold', 'Spooky']
			let currElement = -1
			return `${args[0]}${args[1].replace(/..?/g, (chars: string) => {
				currElement = (currElement + 1) % elementOrder.length
				return `<span class="mod${elementOrder[currElement]}">${chars}</span>`
			})}${args[2]}`
		},
	)
	verbosePrint(`After prismatizing: ${mods}`)

	// Decorate non-prismatic elements simply (prismatic below)
	handleShorthand([
		/([^,]*(Hot|Cold|Spooky|Stench|Sleaze)[^,]*)(,|$)/g,
		'<span class="mod$2">$1</span>$3',
	])

	// strip excess commas (repeatedly in case of multiple in a row)
	cleanupShorthands.forEach((shorthand) => {
		let keepGoing
		do {
			keepGoing = false
			const oldMods = mods
			handleShorthand(shorthand)
			if (mods !== oldMods) {
				keepGoing = true
			}
		} while (keepGoing)
	})

	// Add details of Rollover effects
	mods = mods.replace(
		/(\d+ Rollover Turns )([^,]+)(,|$)/g,
		(match, beginning, effName, ending) => {
			verbosePrint(`Found rollover effect ${effName}`)
			const effNameMatch = originalValue.match(
				new RegExp(`Rollover Effect: "(${effName})"`, 'i'),
			)
			const trueEffName = effNameMatch ? effNameMatch[1] : effName
			const eff = toEffect(trueEffName)
			if (eff) {
				const parsedEffMods = parseMods(
					stringModifier(eff, 'Evaluated Modifiers'),
				)
				if (parsedEffMods !== '') {
					return `${beginning}${effName} [${parsedEffMods}]${ending}`
				}
			} else {
				console.log(`WTF: ${trueEffName}`)
			}
			return match
		},
	)
	verbosePrint(`After adding rollover effect details: ${mods}`)

	return mods
}

export function showFam(famNum: number) {
	const wind = window.open(
		`desc_familiar.php?which=${famNum}`,
		'familiar',
		'height=200,width=400',
	)
	wind?.focus()
}

export function showItem(descId: number) {
	const wind = window.open(
		`desc_item.php?whichitem=${descId}`,
		'item',
		'height=200,width=400',
	)
	wind?.focus()
}

export type FieldValueBase =
	| string
	| number
	| boolean
	| null
	| undefined
	| Item
	| Skill
	| Class
	| Familiar
export type FieldValue = FieldValueBase | FieldValueBase[]

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
		if (typeof defaultValue[0] === 'string') {
			return propStr.split(/, ?/)
		}
		return propStr.split('|').map((itemName) => toItem(itemName))
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
		const strVal = get(`chit.${propName}`, '')
		const propDefault = propInfo[1]
		return interpretPropVal(strVal, propDefault)
	}
	return undefined
}
