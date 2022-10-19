import { BrowserItem } from './guidelines'

export interface CurrMax {
	curr: number
	max: number
}

export interface StatValues {
	base: number
	buffed: number
	substats: number
}

export function pluralize(thing: string | BrowserItem, amount: number) {
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
	return amount === 1 ? thing.name : thing.plural
}

interface ModCombinationInfo {
	mods: string[]
	fuseName: string
}

const modCombinations: ModCombinationInfo[] = [
	{
		mods: ['Muscle', 'Mysticality', 'Moxie'],
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
		mods: ['Weapon Damage', 'Spell Damage'],
		fuseName: 'All Damage',
	},
]

type ModShorthand = [RegExp, string]

const modShorthands: ModShorthand[] = [
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
	[/Smithsness/g, 'Smith'],
	[/Critical/g, 'Crit'],
	// Make it so that pickpocket will get a +X% later
	[/Pickpocket Chance:/g, 'PP %:'],
	[/Fishing Skill/g, 'Fishing'],
	[/Adventures/g, 'Adv'],
	[/PvP Fights/g, 'Fites'],
	// Combine regen min and max in to a range
	[/((HP|MP|HP\/MP) Regen )Min: (\d+), \1Max: (\d+)/g, '$1$3-$4'],
	// simplify regen ranges that are identical
	[/(\d+)-\1/g, '$1'],
	// Exp%: +5 -> Exp +5% (there is sometimes no : for some reason)
	[/%:? ((\+|-)?\d+)/g, ' $1%'],
	// Wpn +5% looks too weird, extend it back to Weapon +5% for the drops case
	[/Wpn Drop/g, 'Weapon Drop'],
	// Item Drop: +5 -> Item +5% and such
	[/Drop: ((\+|-)\d+)/g, ' $1%'],
	// Decorate non-prismatic elements simply (prismatic below)
	[
		/([^,]*(Hot|Cold|Spooky|Stench|Sleaze)[^,]*)(,|$)/g,
		'<span class="mod$2">$1</span>$3',
	],
	// remove colons
	[/:/g, ''],
	// Add missing + for some positives, but not ranges
	[/ (\d+)([^-\d]|$)/g, ' +$1$2'],
	// Reformat rollover effects. Hopefully this really is always at the end, and in this order
	[
		/Rollover Effect "([^"]+)", Rollover Effect Duration \+(\d+)/,
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
]

export const parseMods = (mods: string) => {
	// Capitalize all words
	mods = mods.replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
	// Move parenthesized segments to start
	// ie "Experience (Moxie): +5" -> "Moxie Experience: +5"
	mods = mods.replace(/(, ?|^)([^,(]*?) \(([^)]+)\)/g, (match, ...groups) => {
		void match
		return `${groups[0]}${groups[2]} ${groups[1]}`
	})

	const fiddle = (modComboInfo: ModCombinationInfo) => {
		const initialPattern = `\\b[^,]*${modComboInfo.mods[0]}[^:]*: (\\+|-)\\d+`
		const regexp = new RegExp(initialPattern, 'g')
		let matchInfo
		while ((matchInfo = regexp.exec(mods)) !== null) {
			const initialMatch = matchInfo[0]
			const confirmMatch = () => {
				for (let i = 1; i < modComboInfo.mods.length; ++i) {
					const thisFind = initialMatch.replace(
						modComboInfo.mods[0],
						modComboInfo.mods[i]
					)
					if (mods.indexOf(thisFind) < 0) {
						return false
					}
				}
				return true
			}
			if (confirmMatch()) {
				// replace the first and strip the rest
				const replacement = initialMatch.replace(
					modComboInfo.mods[0],
					modComboInfo.fuseName
				)
				mods = mods.replace(initialMatch, replacement)
				for (let i = 1; i < modComboInfo.mods.length; ++i) {
					const thisRemoval = initialMatch.replace(
						modComboInfo.mods[0],
						modComboInfo.mods[i]
					)
					mods = mods.replace(`, ${thisRemoval}`, '')
					// in case it was at the beginning
					const beginningRemoval = new RegExp(
						`^${thisRemoval.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(, |$)`
					)
					mods = mods.replace(beginningRemoval, '')
				}
			}
		}
	}

	modCombinations.forEach((modComboInfo) => fiddle(modComboInfo))

	modShorthands.forEach((modShorthand) => {
		mods = mods.replace(modShorthand[0], modShorthand[1])
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
		}
	)

	return mods
}

export function showFam(famNum: number) {
	const wind = window.open(
		`desc_familiar.php?which=${famNum}`,
		'familiar',
		'height=200,width=400'
	)
	wind?.focus()
}

export function showItem(descId: number) {
	const wind = window.open(
		`desc_item.php?whichitem=${descId}`,
		'item',
		'height=200,width=400'
	)
	wind?.focus()
}
