import * as React from 'react'
import { BrowserFamiliar, BrowserItem, BrowserList } from '../guidelines'
import { HStack, Image, Text, Tooltip, VStack } from '@chakra-ui/react'
import { BrowserMafiaProperties } from '../properties'
import { pluralize, showFam } from '../utils'
import ProgressBar from './components/ProgressBar'
import { BorderType } from './components/Icons/ChitterIcon'
import { $effect, $familiar, $item } from './fakeLibram'

declare const mafiaProperties: BrowserMafiaProperties
declare const items: BrowserList<BrowserItem>

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
					className={`chit-icon chit-icon-weird ${
						getExtraFamInfo(fam, true, false)?.extraClass
					}`}
					spacing="0"
					onContextMenu={(ev) => {
						showFam(fam.id)
						ev.preventDefault()
					}}
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
	drop: string | BrowserItem // can be an item name or a general descriptor
}

const bjornDrops: { [fam: number]: BjornInfo } = {
	[$familiar`Grimstone Golem`.id]: {
		limit: 1,
		prop: '_grimstoneMaskDropsCrown',
		drop: $item`grimstone mask`,
	},
	[$familiar`Grim Brother`.id]: {
		limit: 2,
		prop: '_grimFairyTaleDropsCrown',
		drop: $item`grim fairy tale`,
	},
	[$familiar`Trick-or-Treating Tot`.id]: {
		limit: 3,
		prop: '_hoardedCandyDropsCrown',
		drop: $item`hoarded candy wad`,
	},
	[$familiar`Optimistic Candle`.id]: {
		limit: 3,
		prop: '_optimisticCandleDropsCrown',
		drop: $item`glob of melted wax`,
	},
	[$familiar`Garbage Fire`.id]: {
		limit: 3,
		prop: '_garbageFireDropsCrown',
		drop: $item`burning newspaper`,
	},
	[$familiar`Twitching Space Critter`.id]: {
		limit: 1,
		prop: '_spaceFurDropsCrown',
		drop: $item`space beast fur`,
	},
	[$familiar`Machine Elf`.id]: {
		limit: 25,
		prop: '_abstractionDropsCrown',
		drop: 'abstractions',
	},
	[$familiar`Adventurous Spelunker`.id]: {
		limit: 6,
		prop: '_oreDropsCrown',
		drop: 'non-quest ore',
	},
	[$familiar`Puck Man`.id]: {
		limit: 25,
		prop: '_yellowPixelDropsCrown',
		drop: $item`yellow pixel`,
	},
	[$familiar`Warbear Drone`.id]: {
		drop: $item`warbear whosit`,
	},
	[$familiar`Li'l Xenomorph`.id]: {
		drop: $item`lunar isotope`,
	},
	[$familiar`Pottery Barn Owl`.id]: {
		drop: $item`volcanic ash`,
	},
	[$familiar`Party Mouse`.id]: {
		drop: 'decent-good booze',
	},
	[$familiar`Yule Hound`.id]: {
		drop: $item`candy cane`,
	},
	[$familiar`Gluttonous Green Ghost`.id]: {
		drop: 'burritos',
	},
	[$familiar`Reassembled Blackbird`.id]: {
		drop: $item`blackberry`,
	},
	[$familiar`Reconstituted Crow`.id]: {
		drop: $item`blackberry`,
	},
	[$familiar`Hunchbacked Minion`.id]: {
		drop: 'brain or bone',
	},
	[$familiar`Reanimated Reanimator`.id]: {
		drop: 'hot wings or skulls',
	},
	[$familiar`Attention-Deficit Demon`.id]: {
		drop: 'some bad food',
	},
	[$familiar`Piano Cat`.id]: {
		drop: 'some bad booze',
	},
	[$familiar`Golden Monkey`.id]: {
		drop: $item`gold nuggets`,
	},
	[$familiar`Robot Reindeer`.id]: {
		drop: 'holiday snacks',
	},
	[$familiar`Ancient Yuletide Troll`.id]: {
		drop: 'holiday snacks',
	},
	[$familiar`Sweet Nutcracker`.id]: {
		drop: 'holiday snacks',
	},
	[$familiar`Stocking Mimic`.id]: {
		drop: 'some simple candy',
	},
	[$familiar`BRICKO chick`.id]: {
		drop: $item`BRICKO brick`,
	},
	[$familiar`Cotton Candy Carnie`.id]: {
		drop: $item`cotton candy pinch`,
	},
	[$familiar`Untamed Turtle`.id]: {
		drop: 'turtle bits',
	},
	[$familiar`Astral Badger`.id]: {
		drop: 'shrooms',
	},
	[$familiar`Green Pixie`.id]: {
		drop: $item`bottle of tequila`,
	},
	[$familiar`Angry Goat`.id]: {
		drop: $item`goat cheese pizza`,
	},
	[$familiar`Adorable Seal Larva`.id]: {
		drop: 'elemental nuggets',
	},
	[$familiar`Frozen Gravy Fairy`.id]: {
		drop: $item`cold nuggets`,
	},
	[$familiar`Stinky Gravy Fairy`.id]: {
		drop: $item`stench nuggets`,
	},
	[$familiar`Sleazy Gravy Fairy`.id]: {
		drop: $item`sleaze nuggets`,
	},
	[$familiar`Spooky Gravy Fairy`.id]: {
		drop: $item`spooky nuggets`,
	},
	[$familiar`Flaming Gravy Fairy`.id]: {
		drop: $item`hot nuggets`,
	},
}

interface DropInfo {
	drop: BrowserItem | string
	left?: number
}

interface ExtraFamInfo {
	desc: React.ReactNode[]
	extraClass?: string
	borderType: BorderType
	dropInfo?: DropInfo
}

export function getExtraFamInfo(
	fam: BrowserFamiliar,
	isTooltip: boolean,
	isBjorn: boolean
): ExtraFamInfo {
	const res: ExtraFamInfo = { borderType: 'normal', desc: [] }

	if (!isBjorn) {
		switch (fam.id) {
			case $familiar`Fist Turkey`.id: {
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
			case $familiar`Melodramedary`.id: {
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
			case $familiar`Steam-Powered Cheerleader`.id: {
				const steamPercent = Math.ceil(
					(mafiaProperties._cheerleaderSteam as number) / 2
				)
				if (steamPercent > 0) {
					res.desc.push(<Text>{steamPercent}% steam</Text>)
					res.extraClass = steamPercent > 50 ? 'all-drops' : 'has-drops'
				}
				break
			}
			case $familiar`Slimeling`.id: {
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
			case $familiar`Gelatinous Cubeling`.id: {
				res.desc.push(
					<Text>{mafiaProperties.cubelingProgress as number}/12 to drop</Text>
				)
				const needs = [
					{ name: 'Pole', item: $item`eleven-foot pole` },
					{ name: 'Ring', item: $item`ring of Detect Boring Doors` },
					{ name: 'Pick', item: $item`Pick-O-Matic lockpicks` },
				].filter((need) => need.item.available < 1)
				if (needs.length > 0) {
					res.desc.push(
						<Text>Need {needs.map((need) => need.name).join(', ')}</Text>
					)
					res.extraClass = 'all-drops'
				}
				break
			}
			case $familiar`Crimbo Shrub`.id: {
				const gifts = mafiaProperties.shrubGifts
				const readyToFire =
					gifts === 'yellow'
						? $effect`Everything Looks Yellow`.turnsActive === 0
						: gifts === 'meat' &&
						  $effect`Everything Looks Red`.turnsActive === 0
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
			case $familiar`Reagnimated Gnome`.id: {
				res.desc.push(
					<Text>{mafiaProperties._gnomeAdv as number} adv gained</Text>
				)
				break
			}
			case $familiar`Temporal Riftlet`.id: {
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
		res.dropInfo = { drop: fam.drop ?? dropName, left: dropsLeft }
		res.desc.unshift(
			<Text>
				{dropsLeft} {dropName}
			</Text>
		)
	}

	if (isBjorn) {
		const info = bjornDrops[fam.id]
		if (info) {
			if (info.limit && info.prop) {
				const left = info.limit - (mafiaProperties[info.prop] as number)
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
						<Text>
							{left} {name}
						</Text>
					)
				}
			} else {
				const name = typeof info.drop === 'string' ? info.drop : info.drop.name
				res.dropInfo = { drop: info.drop }
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
