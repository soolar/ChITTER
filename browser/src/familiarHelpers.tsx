import * as React from 'react'
import { HStack, Image, Text, Tooltip, VStack } from '@chakra-ui/react'
import { pluralize, showFam } from './utils'
import ProgressBar from './components/ProgressBar'
import { BorderType } from './components/Icons/ChitterIcon'
import { $effect, $familiar, $item, get, MummingTrunk } from 'libram'
import {
	availableAmount,
	Familiar,
	familiarWeight,
	haveEffect,
	Item,
	toInt,
} from 'kolmafia'

const mummeryCharacters = [
	'The Captain',
	'Beelzebub',
	'Saint Patrick',
	'Prince George',
	'Oliver Cromwell',
	'The Doctor',
	'Miss Funny',
]
type MummeryCharacter = (typeof mummeryCharacters)[number]

const mummeryMap: { [mod: string]: MummeryCharacter } = {
	['MP Regen Min']: 'Beelzebub',
	['Item Drop']: 'Prince George',
	['HP Regen Min']: 'The Doctor',
	['Experience (Muscle)']: 'Saint Patrick',
	['Experience (Mysticality)']: 'Oliver Cromwell',
	['Experience (Moxie)']: 'Miss Funny',
	['Meat Drop']: 'The Captain',
}

function getMummeryCharacter(fam: Familiar) {
	const modInfo = MummingTrunk.currentCostumes().get(fam)
	if (modInfo) {
		const modType = modInfo[0]
		const character = mummeryMap[modType]
		return character
	}
	return undefined
}

export const nextLevelInfo = (fam: Familiar) => {
	for (let i = 2; i <= 20; ++i) {
		const nextGoal = i * i
		if (nextGoal > fam.experience) {
			const prevGoal = i === 2 ? 0 : (i - 1) * (i - 1)
			return {
				progress: fam.experience - prevGoal,
				goal: nextGoal - prevGoal,
			}
		}
	}
	return { progress: 1, goal: 1 }
}

export function useWeirdoDivContents(fam: Familiar) {
	const extraInfo = useExtraFamInfo(fam, true, false)
	switch (fam) {
		case $familiar`Melodramedary`: {
			const weight = familiarWeight(fam)
			const famNum = toInt(fam)
			return (
				<HStack
					className={`chit-icon chit-icon-weird ${extraInfo?.extraClass}`}
					spacing="0"
					onContextMenu={(ev) => {
						showFam(famNum ?? 0)
						ev.preventDefault()
					}}
				>
					<Image src="/images/otherimages/camelfam_left.gif" border={0} />
					{Array(Math.floor((weight ?? 0) / 5)).fill(
						<Image src="/images/otherimages/camelfam_middle.gif" border={0} />,
					)}
					<Image src="/images/otherimages/camelfam_right.gif" border={0} />
				</HStack>
			)
		}
	}

	return null
}

// I know crown came first, but I had bjorn first so it is ingrained in my mind. Sorry, crown!
interface BjornInfo {
	limit?: number
	prop?: string
	drop: string | Item // can be an item name or a general descriptor
}

const bjornDrops: { [fam: string]: BjornInfo } = {
	[$familiar`Grimstone Golem`.toString()]: {
		limit: 1,
		prop: '_grimstoneMaskDropsCrown',
		drop: $item`grimstone mask`,
	},
	[$familiar`Grim Brother`.toString()]: {
		limit: 2,
		prop: '_grimFairyTaleDropsCrown',
		drop: $item`grim fairy tale`,
	},
	[$familiar`Trick-or-Treating Tot`.toString()]: {
		limit: 3,
		prop: '_hoardedCandyDropsCrown',
		drop: $item`hoarded candy wad`,
	},
	[$familiar`Optimistic Candle`.toString()]: {
		limit: 3,
		prop: '_optimisticCandleDropsCrown',
		drop: $item`glob of melted wax`,
	},
	[$familiar`Garbage Fire`.toString()]: {
		limit: 3,
		prop: '_garbageFireDropsCrown',
		drop: $item`burning newspaper`,
	},
	[$familiar`Twitching Space Critter`.toString()]: {
		limit: 1,
		prop: '_spaceFurDropsCrown',
		drop: $item`space beast fur`,
	},
	[$familiar`Machine Elf`.toString()]: {
		limit: 25,
		prop: '_abstractionDropsCrown',
		drop: 'abstractions',
	},
	[$familiar`Adventurous Spelunker`.toString()]: {
		limit: 6,
		prop: '_oreDropsCrown',
		drop: 'non-quest ore',
	},
	[$familiar`Puck Man`.toString()]: {
		limit: 25,
		prop: '_yellowPixelDropsCrown',
		drop: $item`yellow pixel`,
	},
	[$familiar`Warbear Drone`.toString()]: {
		drop: $item`warbear whosit`,
	},
	[$familiar`Li'l Xenomorph`.toString()]: {
		drop: $item`lunar isotope`,
	},
	[$familiar`Pottery Barn Owl`.toString()]: {
		drop: $item`volcanic ash`,
	},
	[$familiar`Party Mouse`.toString()]: {
		drop: 'decent-good booze',
	},
	[$familiar`Yule Hound`.toString()]: {
		drop: $item`candy cane`,
	},
	[$familiar`Gluttonous Green Ghost`.toString()]: {
		drop: 'burritos',
	},
	[$familiar`Reassembled Blackbird`.toString()]: {
		drop: $item`blackberry`,
	},
	[$familiar`Reconstituted Crow`.toString()]: {
		drop: $item`blackberry`,
	},
	[$familiar`Hunchbacked Minion`.toString()]: {
		drop: 'brain or bone',
	},
	[$familiar`Reanimated Reanimator`.toString()]: {
		drop: 'hot wings or skulls',
	},
	[$familiar`Attention-Deficit Demon`.toString()]: {
		drop: 'some bad food',
	},
	[$familiar`Piano Cat`.toString()]: {
		drop: 'some bad booze',
	},
	[$familiar`Golden Monkey`.toString()]: {
		drop: $item`gold nuggets`,
	},
	[$familiar`Robot Reindeer`.toString()]: {
		drop: 'hoay snacks',
	},
	[$familiar`Ancient Yuletide Troll`.toString()]: {
		drop: 'hoay snacks',
	},
	[$familiar`Sweet Nutcracker`.toString()]: {
		drop: 'hoay snacks',
	},
	[$familiar`Stocking Mimic`.toString()]: {
		drop: 'some simple candy',
	},
	[$familiar`BRICKO chick`.toString()]: {
		drop: $item`BRICKO brick`,
	},
	[$familiar`Cotton Candy Carnie`.toString()]: {
		drop: $item`cotton candy pinch`,
	},
	[$familiar`Untamed Turtle`.toString()]: {
		drop: 'turtle bits',
	},
	[$familiar`Astral Badger`.toString()]: {
		drop: 'shrooms',
	},
	[$familiar`Green Pixie`.toString()]: {
		drop: $item`bottle of tequila`,
	},
	[$familiar`Angry Goat`.toString()]: {
		drop: $item`goat cheese pizza`,
	},
	[$familiar`Adorable Seal Larva`.toString()]: {
		drop: 'elemental nuggets',
	},
	[$familiar`Frozen Gravy Fairy`.toString()]: {
		drop: $item`cold nuggets`,
	},
	[$familiar`Stinky Gravy Fairy`.toString()]: {
		drop: $item`stench nuggets`,
	},
	[$familiar`Sleazy Gravy Fairy`.toString()]: {
		drop: $item`sleaze nuggets`,
	},
	[$familiar`Spooky Gravy Fairy`.toString()]: {
		drop: $item`spooky nuggets`,
	},
	[$familiar`Flaming Gravy Fairy`.toString()]: {
		drop: $item`hot nuggets`,
	},
}

interface DropInfo {
	drop: Item | string
	left?: number
}

interface ExtraFamInfo {
	desc: React.ReactNode[]
	extraClass?: string
	borderType: BorderType
	dropInfo?: DropInfo
	mummeryCharacter?: MummeryCharacter
}

export function useExtraFamInfo(
	fam: Familiar,
	isTooltip: boolean,
	isBjorn: boolean,
): ExtraFamInfo {
	const res: ExtraFamInfo = {
		borderType: 'normal',
		desc: [],
		mummeryCharacter: getMummeryCharacter(fam),
	}
	if (!isBjorn) {
		switch (fam.id) {
			case $familiar`Fist Turkey`.id: {
				const musLeft = 5 - get('_turkeyMuscle')
				const mysLeft = 5 - get('_turkeyMyst')
				const moxLeft = 5 - get('_turkeyMoxie')
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
						res.desc.push(<Text key="turkeystats">{statsLeftStr} left</Text>)
					} else {
						res.desc.push(
							<Tooltip key="turkeystats" label={<Text>{statsLeftStr}</Text>}>
								<Text>{statsLeft} stats left</Text>
							</Tooltip>,
						)
					}
				}
				break
			}
			case $familiar`Melodramedary`.id: {
				const spit = get('camelSpit')
				if (spit >= 100) {
					res.desc.push(<Text key="camelspit">Ready to spit!</Text>)
					res.extraClass = 'has-drops'
				} else {
					res.desc.push(
						<VStack spacing="none" key="camelspit">
							<Text>{spit}% charged</Text>
							<ProgressBar value={spit} max={100} desc="camel spit" />
						</VStack>,
					)
				}
				break
			}
			case $familiar`Steam-Powered Cheerleader`.id: {
				const steamPercent = Math.ceil(get('_cheerleaderSteam') / 2)
				if (steamPercent > 0) {
					res.desc.push(<Text key="cheersteam">{steamPercent}% steam</Text>)
					res.extraClass = steamPercent > 50 ? 'all-drops' : 'has-drops'
				}
				break
			}
			case $familiar`Slimeling`.id: {
				const fullness = get('slimelingFullness')
				const stacksDue = get('slimelingStacksDue')
				const stacksDropped = get('slimelingStacksDropped')
				const hasFullness = fullness > 0
				const hasStacksToDrop = stacksDue > 0 && stacksDue > stacksDropped
				if (hasFullness || hasStacksToDrop) {
					res.desc.push(
						<>
							{hasFullness && <Text key="slimefull">~{fullness} fullness</Text>}
							{hasStacksToDrop && (
								<Text key="slimestacks">
									{stacksDropped}/{stacksDue} stacks dropped
								</Text>
							)}
						</>,
					)
				}
				if (hasStacksToDrop) {
					res.extraClass = stacksDropped === 0 ? 'all-drops' : 'has-drops'
				}
				break
			}
			case $familiar`Gelatinous Cubeling`.id: {
				res.desc.push(
					<Text key="cubelineprog">{get('cubelingProgress')}/12 to drop</Text>,
				)
				const needs = [
					{ name: 'Pole', item: $item`eleven-foot pole` },
					{ name: 'Ring', item: $item`ring of Detect Boring Doors` },
					{ name: 'Pick', item: $item`Pick-O-Matic lockpicks` },
				].filter((need) => availableAmount(need.item) < 1)
				if (needs.length > 0) {
					res.desc.push(
						<Text key="cubelingneeds">
							Need {needs.map((need) => need.name).join(', ')}
						</Text>,
					)
					res.extraClass = 'all-drops'
				}
				break
			}
			case $familiar`Crimbo Shrub`.id: {
				const gifts = get('shrubGifts')
				const readyToFire =
					gifts === 'yellow'
						? haveEffect($effect`Everything Looks Yellow`) === 0
						: gifts === 'meat' &&
						  haveEffect($effect`Everything Looks Red`) === 0
				res.extraClass = 'all-drops'
				if (readyToFire) {
					res.desc.push(<Text key="shrubfire">Ready to fire!</Text>)
				} else if (gifts === '') {
					res.desc.push(<Text key="shrubdeco">Needs to be decorated!</Text>)
				} else {
					res.extraClass = undefined
				}
				break
			}
			case $familiar`Reagnimated Gnome`.id: {
				res.desc.push(<Text key="gnomeadv">{get('_gnomeAdv')} adv gained</Text>)
				break
			}
			case $familiar`Temporal Riftlet`.id: {
				res.desc.push(
					<Text key="riftadv">{get('_riftletAdv')} adv gained</Text>,
				)
				break
			}
		}
	}

	const dropsLeft =
		fam.dropsLimit > 0
			? fam.dropsLimit - fam.dropsToday
			: fam.dropsLimit === 0
			? 0
			: -1
	let hasDrops = !isBjorn && dropsLeft !== 0
	let allDrops = hasDrops && fam.dropsToday === 0
	const dropName =
		fam.dropItem !== $item.none && fam.dropItem
			? pluralize(fam.dropItem, dropsLeft)
			: pluralize(fam.dropName, dropsLeft)

	if (hasDrops && dropName && !isBjorn) {
		res.dropInfo = {
			drop: fam.dropItem === $item.none ? fam.dropItem : fam.dropName,
			left: dropsLeft,
		}
		res.desc.unshift(
			<Text key="dropinfo">
				{dropsLeft >= 0 ? dropsLeft : '∞'} {dropName}
			</Text>,
		)
	}

	if (isBjorn) {
		const info = bjornDrops[fam.id]
		if (info) {
			if (info.limit && info.prop) {
				const left = info.limit - get(info.prop, 0)
				if (left > 0) {
					hasDrops = true
					allDrops = left === info.limit
					const name =
						typeof info.drop !== 'string'
							? left > 1
								? info.drop.plural
								: info.drop.name
							: info.drop
					res.dropInfo = {
						drop: typeof info.drop === 'string' ? info.drop : name,
						left: left,
					}
					res.desc.unshift(
						<Text key="bjorndropinfo">
							{left} {name}
						</Text>,
					)
				}
			} else {
				const name = typeof info.drop === 'string' ? info.drop : info.drop.name
				res.dropInfo = { drop: info.drop }
				res.desc.unshift(<Text key="bjorndropinfo">drops {name}</Text>)
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
