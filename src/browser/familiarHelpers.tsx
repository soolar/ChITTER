import * as React from 'react'
import {
	BrowserEffect,
	BrowserFamiliar,
	BrowserItem,
	BrowserList,
} from '../guidelines'
import { HStack, Image, Text, Tooltip, VStack } from '@chakra-ui/react'
import { BrowserMafiaProperties } from '../properties'
import { pluralize } from '../utils'
import ProgressBar from './components/ProgressBar'
import { BorderType } from './components/Icons/ChitterIcon'

declare const mafiaProperties: BrowserMafiaProperties
declare const items: BrowserList<BrowserItem>
declare const effects: BrowserList<BrowserEffect>

export const nextLevelInfo = (fam: BrowserFamiliar) => {
	for (let i = 2; i <= 20; ++i) {
		const nextGoal = i * i
		if (nextGoal > fam.experience) {
			const prevGoal = i === 2 ? 0 : (i - 1) * (i - 1)
			return { progress: fam.experience - prevGoal, goal: nextGoal - prevGoal }
		}
	}
	return { progress: 1, goal: 1 }
}

export function getWeirdoDivContents(fam: BrowserFamiliar) {
	switch (fam.type) {
		case 'Melodramedary':
			return (
				<HStack
					className={`chit-icon ${
						getExtraFamInfo(fam, true, false)?.extraClass
					}`}
					spacing="0"
				>
					<Image src="/images/otherimages/camelfam_left.gif" border={0} />
					{Array(Math.floor(fam.weight / 5)).fill(
						<Image src="/images/otherimages/camelfam_middle.gif" border={0} />
					)}
					<Image src="/images/otherimages/camelfam_right.gif" border={0} />
				</HStack>
			)
	}

	return null
}

// I know crown came first, but I had bjorn first so it is ingrained in my mind. Sorry, crown!
interface BjornInfo {
	limit?: number
	prop?: string
	drop: string // can be an item name or a general descriptor
}

const bjornDrops: { [fam: string]: BjornInfo } = {
	'grimstone golem': {
		limit: 1,
		prop: '_grimstoneMaskDropsCrown',
		drop: 'grimstone mask',
	},
	'grim brother': {
		limit: 2,
		prop: '_grimFairyTaleDropsCrown',
		drop: 'grim fairy tale',
	},
	'trick-or-treating tot': {
		limit: 3,
		prop: '_hoardedCandyDropsCrown',
		drop: 'hoarded candy wad',
	},
	'optimistic candle': {
		limit: 3,
		prop: '_optimisticCandleDropsCrown',
		drop: 'glob of melted wax',
	},
	'garbage fire': {
		limit: 3,
		prop: '_garbageFireDropsCrown',
		drop: 'burning newspaper',
	},
	'twitching space critter': {
		limit: 1,
		prop: '_spaceFurDropsCrown',
		drop: 'space beast fur',
	},
	'machine elf': {
		limit: 25,
		prop: '_abstractionDropsCrown',
		drop: 'abstractions',
	},
	'adventurous spelunker': {
		limit: 6,
		prop: '_oreDropsCrown',
		drop: 'non-quest ore',
	},
	'puck man': {
		limit: 25,
		prop: '_yellowPixelDropsCrown',
		drop: 'yellow pixel',
	},
	'warbear drone': {
		drop: 'warbear whosit',
	},
	"li'l xenomorph": {
		drop: 'lunar isotope',
	},
	'pottery barn own': {
		drop: 'volcanic ash',
	},
	'party mouse': {
		drop: 'decent-good booze',
	},
	'yule hound': {
		drop: 'candy cane',
	},
	'gluttonous green ghost': {
		drop: 'burritos',
	},
	'reassembled blackbird': {
		drop: 'blackberry',
	},
	'reconstituted crow': {
		drop: 'blackberry',
	},
	'hunchbacked minion': {
		drop: 'brain or bone',
	},
	'reanimated reanimator': {
		drop: 'hot wings or skulls',
	},
	'attention-deficit demon': {
		drop: 'some bad food',
	},
	'piano cat': {
		drop: 'some bad booze',
	},
	'golden monkey': {
		drop: 'gold nuggets',
	},
	'robot reindeer': {
		drop: 'holiday snacks',
	},
	'ancient yuletide troll': {
		drop: 'holiday snacks',
	},
	'sweet nutcracker': {
		drop: 'holiday snacks',
	},
	'stocking mimic': {
		drop: 'some simple candy',
	},
	'bricko chick': {
		drop: 'bricko brick',
	},
	'cotton candy carnie': {
		drop: 'cotton candy pinch',
	},
	'untamed turtle': {
		drop: 'turtle bits',
	},
	'astral badger': {
		drop: 'shrooms',
	},
	'green pixie': {
		drop: 'bottle of tequila',
	},
	'angry goat': {
		drop: 'goat cheese pizza',
	},
	'adorable seal larva': {
		drop: 'elemental nuggets',
	},
	'frozen gravy fairy': {
		drop: 'cold nuggets',
	},
	'stinky gravy fairy': {
		drop: 'stench nuggets',
	},
	'sleazy gravy fairy': {
		drop: 'sleaze nuggets',
	},
	'spooky gravy fairy': {
		drop: 'spooky nuggets',
	},
	'flaming gravy fairy': {
		drop: 'hot nuggets',
	},
}

interface ExtraFamInfo {
	desc: React.ReactNode[]
	extraClass?: string
	borderType: BorderType
}

export function getExtraFamInfo(
	fam: BrowserFamiliar,
	isTooltip: boolean,
	isBjorn: boolean
): ExtraFamInfo {
	const res: ExtraFamInfo = { borderType: 'normal', desc: [] }

	if (!isBjorn) {
		switch (fam.type.toLowerCase()) {
			case 'fist turkey': {
				const musLeft = 5 - (mafiaProperties._turkeyMuscle as number)
				const mysLeft = 5 - (mafiaProperties._turkeyMyst as number)
				const moxLeft = 5 - (mafiaProperties._turkeyMoxie as number)
				const statsLeft = musLeft + mysLeft + moxLeft
				if (statsLeft > 0) {
					const statsLeftStr = [
						[musLeft, 'mus'],
						[mysLeft, 'mys'],
						[moxLeft, 'mox'],
					]
						.filter((entry) => entry[0] > 0)
						.map((entry) => `${entry[0]} ${entry[1]}`)
						.join(', ')
					if (isTooltip) {
						res.desc.push(<Text>{statsLeftStr} left</Text>)
					} else {
						res.desc.push(
							<Tooltip label={<Text>{statsLeftStr}</Text>}>
								<Text>{statsLeft} stats left</Text>
							</Tooltip>
						)
					}
				}
				break
			}
			case 'melodramedary': {
				const spit = mafiaProperties.camelSpit as number
				if (spit >= 100) {
					res.desc.push('Ready to spit!')
					res.extraClass = 'has-drops'
				} else {
					res.desc.push(
						<VStack spacing="none">
							<Text>{spit}% charged</Text>
							<ProgressBar value={spit} max={100} desc="camel spit" />
						</VStack>
					)
				}
				break
			}
			case 'steam-powered cheerleader': {
				const steamPercent = Math.ceil(
					(mafiaProperties._cheerleaderSteam as number) / 2
				)
				if (steamPercent > 0) {
					res.desc.push(<Text>{steamPercent}% steam</Text>)
					res.extraClass = steamPercent > 50 ? 'all-drops' : 'has-drops'
				}
				break
			}
			case 'slimeling': {
				const fullness = mafiaProperties.slimelingFullness as number
				const stacksDue = mafiaProperties.slimelingStacksDue as number
				const stacksDropped = mafiaProperties.slimelingStacksDropped as number
				const hasFullness = fullness > 0
				const hasStacksToDrop = stacksDue > 0 && stacksDue > stacksDropped
				if (hasFullness || hasStacksToDrop) {
					res.desc.push(
						<>
							{hasFullness && <Text>~{fullness} fullness</Text>}
							{hasStacksToDrop && (
								<Text>
									{stacksDropped}/{stacksDue} stacks dropped
								</Text>
							)}
						</>
					)
				}
				if (hasStacksToDrop) {
					res.extraClass = stacksDropped === 0 ? 'all-drops' : 'has-drops'
				}
				break
			}
			case 'gelatinous cubeling': {
				res.desc.push(
					<Text>{mafiaProperties.cubelingProgress as number}/12 to drop</Text>
				)
				const needs = [
					{ name: 'Pole', item: items.byName['eleven-foot pole'] },
					{ name: 'Ring', item: items.byName['ring of detect boring doors'] },
					{ name: 'Pick', item: items.byName['pick-o-matic lockpicks'] },
				].filter((need) => need.item.available < 1)
				if (needs.length > 0) {
					res.desc.push(
						<Text>Need {needs.map((need) => need.name).join(', ')}</Text>
					)
					res.extraClass = 'all-drops'
				}
				break
			}
			case 'crimbo shrub': {
				const gifts = mafiaProperties.shrubGifts
				const readyToFire =
					gifts === 'yellow'
						? effects.byName['everything looks yellow'].turnsActive === 0
						: gifts === 'meat' &&
						  effects.byName['everything looks red'].turnsActive === 0
				res.extraClass = 'all-drops'
				if (readyToFire) {
					res.desc.push(<Text>Ready to fire!</Text>)
				} else if (gifts === '') {
					res.desc.push(<Text>Needs to be decorated!</Text>)
				} else {
					res.extraClass = undefined
				}
				break
			}
			case 'reagnimated gnome': {
				res.desc.push(
					<Text>{mafiaProperties._gnomeAdv as number} adv gained</Text>
				)
				break
			}
			case 'temporal riftlet': {
				res.desc.push(
					<Text>{mafiaProperties._riftletAdv as number} adv gained</Text>
				)
				break
			}
		}
	}

	const dropsLeft = fam.dropsLimit - fam.dropsToday
	let hasDrops = !isBjorn && dropsLeft > 0
	let allDrops = hasDrops && fam.dropsToday === 0
	const dropName = fam.drop
		? pluralize(fam.drop, dropsLeft)
		: pluralize(fam.dropName, dropsLeft)

	if (hasDrops && dropName && !isBjorn) {
		res.desc.unshift(
			<Text>
				{dropsLeft} {dropName}
			</Text>
		)
	}

	if (isBjorn) {
		const info = bjornDrops[fam.type.toLowerCase()]
		if (info) {
			if (info.limit && info.prop) {
				const left = info.limit - (mafiaProperties[info.prop] as number)
				if (left > 0) {
					hasDrops = true
					allDrops = left === info.limit
					const item = items.byName[info.drop]
					const name = item ? (left > 1 ? item.plural : item.name) : info.drop
					res.desc.unshift(
						<Text>
							{left} {name}
						</Text>
					)
				}
			} else {
				const name = items.byName[info.drop]?.name ?? info.drop
				res.desc.unshift(<Text>drops {name}</Text>)
			}
		}
	}

	if (allDrops) {
		res.borderType = 'all-drops'
	} else if (hasDrops) {
		res.borderType = 'has-drops'
	}

	return res
}
