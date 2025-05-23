import { Effect, Item, stringModifier, toEffect } from 'kolmafia'

export function resolveStr(stringOrGetter: string | (() => string)) {
	return typeof stringOrGetter === 'string' ? stringOrGetter : stringOrGetter()
}

export function strCompare(lhs: string, rhs: string) {
	if (lhs < rhs) {
		return -1
	} else if (lhs > rhs) {
		return 1
	} else {
		return 0
	}
}

export function evaluatedModifiers(modsOf: string | Item | Effect) {
	// This looks silly but it's necessary for typescript's disambiguation
	if (modsOf instanceof Item) {
		return stringModifier(modsOf, 'Evaluated Modifiers')
	}
	if (modsOf instanceof Effect) {
		return stringModifier(modsOf, 'Evaluated Modifiers')
	}
	return stringModifier(modsOf, 'Evaluated Modifiers')
}

export function pluralize(thing: string | Item, amount: number) {
	if (typeof thing === 'string') {
		if (thing === '') {
			return undefined
		}
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
	return amount === 1 ? thing.identifierString : thing.plural
}

export function showFam(famNum: number) {
	const wind = window.open(
		`/desc_familiar.php?which=${famNum}`,
		'familiar',
		'height=200,width=400',
	)
	wind?.focus()
}

export function showItem(descId: number) {
	const wind = window.open(
		`/desc_item.php?whichitem=${descId}`,
		'item',
		'height=200,width=400',
	)
	wind?.focus()
}

type ModShorthand = [RegExp, string]

const modShorthands: ModShorthand[] = [
	// remote info about what they do on pants/shirt fams
	[/Familiar Effect: "[^"]+"/, ''],
	// remove softcore only because it's not relevant here
	[/Softcore Only(?:: \+?\d+)?/, ''],
	// remove 0 modifiers (these show up for conditional values when the condition isn't met)
	[/[^,]+ \+?0(?:,|$)/g, ''],
	// remove free pull too
	[/Free Pull/, ''],
	// Get rid of wiki name
	[/Wiki Name: "[^"]+"/, ''],
	// Hide skills granted
	[/(Inventory|Equipped) Conditional Skill: "[^"]+"/g, ''],
	// Hide Last Available
	[/Last Available: "[^"]+"/, ''],
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
	// Make it so that picpocket will get a +X% later
	[/Pickpocket Chance:/g, 'PP %:'],
	[/Fishing Skill/g, 'Fishing'],
	[/Adventures/g, 'Adv'],
	[/PvP Fights/g, 'Fites'],
	// Combine regen min and max in to a range
	[
		/((HP|MP|HP\/MP) Regen )Min: \+?(-?[\d.]+), \1Max: \+?(-?[\d.]+)/g,
		'$1$3-$4',
	],
	// simplify regen ranges that are identical
	[/\b([\d.]+)-\1\b/g, '$1'],
	// Exp%: +5 -> Exp +5% (there is sometimes no : for some reason)
	[/%:? ([+-]?[\d.]+)/g, ' $1%'],
	// Wpn +5% looks too extend it back to Weapon +5% for the drops case
	[/Wpn Drop/g, 'Weapon Drop'],
	// Item Drop: +5 -> Item +5% and such
	[/Drop: ([+-]?[\d.]+)/g, ' $1%'],
	// remove colons (dang, that sounds hardcore)
	[/:/g, ''],
	// Add missing + for some positives, but not ranges
	[/ ([\d.]+)([^-\d.]|$)/g, ' +$1$2'],
	// Reformat rolover effects and hope this is really always in this order
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

// these shorthjands are called repeatedly until nothing changes
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
	if (mods === '') {
		return mods
	}

	const verbosePrint = verbose
		? (msg: string) => console.log(msg)
		: (msg: string) => void msg

	verbosePrint(`Pre-parsed: ${mods}`)

	const originalValue = mods

	// combine duplicate mods (only for weird cases like combining mods of multiple items)
	mods
		.matchAll(/(^|, )([^:]+): ([^,]+)(?=,|$)/g)
		.forEach(([match, start, modifier, value, end]) => {
			void end
			verbosePrint(`Dupe searching with '${start}${modifier}: ${value}'`)
			if (value.startsWith('"')) {
				let done = false
				mods = mods.replace(RegExp(match, 'g'), (match) => {
					if (!done) {
						done = true
						return match
					}
					return ''
				})
			} else {
				const regex = RegExp(`(^|, )${modifier}: ([^,]+)(?=,|$)`, 'g')
				let score = 0
				let matches = 0
				mods.matchAll(regex).forEach(([innerMatch, ...groups]) => {
					void innerMatch
					const thisValue = groups[1]
					score += Number(thisValue)
					++matches
				})
				if (matches > 1) {
					verbosePrint(
						`Found ${matches} matches for dupe '${modifier}', totaling ${score}`,
					)
					const scoreStr = `${score > 0 ? '+' : ''}${score}`
					mods = mods.replace(match, `${start}${modifier}: ${scoreStr}`)
					verbosePrint(`mods after replacing first score in dupe: '${mods}'`)
					mods = mods.replace(regex, (match, ...groups) =>
						Number(groups[1]) !== score ? '' : match,
					)
				}
			}
		})
	// Capitalize all words
	mods = mods.replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
	verbosePrint(`Capitalized: ${mods}`)
	// Uncapitalize after apostrophes, tbh don't remember why this is necessary but w/e
	mods = mods.replace(/'[A-Z]/g, (letter) => letter.toLowerCase())
	verbosePrint(`Uncapped after apostrophes: ${mods}`)
	// Move parenthesized segments to start
	// ie "Experience (Moxie): +5 -> "Moxie Experience: +5"
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

	// Primatize
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

	// Decorate non-prismatic elements simply
	handleShorthand([
		/([^,]*(Hot|Cold|Spooky|Stench|Sleaze)[^,]*)(,|$)/g,
		'<span class="mod$2">$1</span>$3',
	])

	// string excess commas (repeatedly in case of multiple in a row)
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
				const effMods = evaluatedModifiers(eff)
				const parsedEffMods = parseMods(effMods)
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
