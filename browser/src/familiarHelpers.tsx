import * as React from 'react'
import { HStack, Image, Text, Tooltip, VStack } from '@chakra-ui/react'
import { pluralize, showFam } from '../utils'
import ProgressBar from './components/ProgressBar'
import { BorderType } from './components/Icons/ChitterIcon'
//import { $familiar, $item } from 'libram'
import {
	Familiar,
	familiarWeight,
	Item,
	toFamiliar,
	toInt,
	toItem,
} from 'kolmafia'

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
		case toFamiliar(`Melodramedary`): {
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
						<Image src="/images/otherimages/camelfam_middle.gif" border={0} />
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
	[toFamiliar(`Grimstone Golem`).toString()]: {
		limit: 1,
		prop: '_grimstoneMaskDropsCrown',
		drop: toItem(`grimstone mask`),
	},
	[toFamiliar(`Grim Brother`).toString()]: {
		limit: 2,
		prop: '_grimFairyTaleDropsCrown',
		drop: toItem(`grim fairy tale`),
	},
	[toFamiliar(`Trick-or-Treating Tot`).toString()]: {
		limit: 3,
		prop: '_hoardedCandyDropsCrown',
		drop: toItem(`hoarded candy wad`),
	},
	[toFamiliar(`Optimistic Candle`).toString()]: {
		limit: 3,
		prop: '_optimisticCandleDropsCrown',
		drop: toItem(`glob of melted wax`),
	},
	[toFamiliar(`Garbage Fire`).toString()]: {
		limit: 3,
		prop: '_garbageFireDropsCrown',
		drop: toItem(`burning newspaper`),
	},
	[toFamiliar(`Twitching Space Critter`).toString()]: {
		limit: 1,
		prop: '_spaceFurDropsCrown',
		drop: toItem(`space beast fur`),
	},
	[toFamiliar(`Machine Elf`).toString()]: {
		limit: 25,
		prop: '_abstractionDropsCrown',
		drop: 'abstractions',
	},
	[toFamiliar(`Adventurous Spelunker`).toString()]: {
		limit: 6,
		prop: '_oreDropsCrown',
		drop: 'non-quest ore',
	},
	[toFamiliar(`Puck Man`).toString()]: {
		limit: 25,
		prop: '_yellowPixelDropsCrown',
		drop: toItem(`yellow pixel`),
	},
	[toFamiliar(`Warbear Drone`).toString()]: {
		drop: toItem(`warbear whosit`),
	},
	[toFamiliar(`Li'l Xenomorph`).toString()]: {
		drop: toItem(`lunar isotope`),
	},
	[toFamiliar(`Pottery Barn Owl`).toString()]: {
		drop: toItem(`volcanic ash`),
	},
	[toFamiliar(`Party Mouse`).toString()]: {
		drop: 'decent-good booze',
	},
	[toFamiliar(`Yule Hound`).toString()]: {
		drop: toItem(`candy cane`),
	},
	[toFamiliar(`Gluttonous Green Ghost`).toString()]: {
		drop: 'burritos',
	},
	[toFamiliar(`Reassembled Blackbird`).toString()]: {
		drop: toItem(`blackberry`),
	},
	[toFamiliar(`Reconstituted Crow`).toString()]: {
		drop: toItem(`blackberry`),
	},
	[toFamiliar(`Hunchbacked Minion`).toString()]: {
		drop: 'brain or bone',
	},
	[toFamiliar(`Reanimated Reanimator`).toString()]: {
		drop: 'hot wings or skulls',
	},
	[toFamiliar(`Attention-Deficit Demon`).toString()]: {
		drop: 'some bad food',
	},
	[toFamiliar(`Piano Cat`).toString()]: {
		drop: 'some bad booze',
	},
	[toFamiliar(`Golden Monkey`).toString()]: {
		drop: toItem(`gold nuggets`),
	},
	[toFamiliar(`Robot Reindeer`).toString()]: {
		drop: 'hoay snacks',
	},
	[toFamiliar(`Ancient Yuletide Troll`).toString()]: {
		drop: 'hoay snacks',
	},
	[toFamiliar(`Sweet Nutcracker`).toString()]: {
		drop: 'hoay snacks',
	},
	[toFamiliar(`Stocking Mimic`).toString()]: {
		drop: 'some simple candy',
	},
	[toFamiliar(`BRICKO chick`).toString()]: {
		drop: toItem(`BRICKO brick`),
	},
	[toFamiliar(`Cotton Candy Carnie`).toString()]: {
		drop: toItem(`cotton candy pinch`),
	},
	[toFamiliar(`Untamed Turtle`).toString()]: {
		drop: 'turtle bits',
	},
	[toFamiliar(`Astral Badger`).toString()]: {
		drop: 'shrooms',
	},
	[toFamiliar(`Green Pixie`).toString()]: {
		drop: toItem(`bottle of tequila`),
	},
	[toFamiliar(`Angry Goat`).toString()]: {
		drop: toItem(`goat cheese pizza`),
	},
	[toFamiliar(`Adorable Seal Larva`).toString()]: {
		drop: 'elemental nuggets',
	},
	[toFamiliar(`Frozen Gravy Fairy`).toString()]: {
		drop: toItem(`cold nuggets`),
	},
	[toFamiliar(`Stinky Gravy Fairy`).toString()]: {
		drop: toItem(`stench nuggets`),
	},
	[toFamiliar(`Sleazy Gravy Fairy`).toString()]: {
		drop: toItem(`sleaze nuggets`),
	},
	[toFamiliar(`Spooky Gravy Fairy`).toString()]: {
		drop: toItem(`spooky nuggets`),
	},
	[toFamiliar(`Flaming Gravy Fairy`).toString()]: {
		drop: toItem(`hot nuggets`),
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
}

export function useExtraFamInfo(
	fam: Familiar,
	isTooltip: boolean,
	isBjorn: boolean
): ExtraFamInfo {
	void fam
	void isTooltip
	void isBjorn
	const res: ExtraFamInfo = { borderType: 'normal', desc: [] }
	/*
	if (!isBjorn) {
		switch (fam.id) {
			case toFamiliar(`Fist Turkey`).id: {
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
			case toFamiliar(`Melodramedary`).id: {
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
			case toFamiliar(`Steam-Powered Cheerleader`).id: {
				const steamPercent = Math.ceil(
					(mafiaProperties._cheerleaderSteam as number) / 2
				)
				if (steamPercent > 0) {
					res.desc.push(<Text>{steamPercent}% steam</Text>)
					res.extraClass = steamPercent > 50 ? 'all-drops' : 'has-drops'
				}
				break
			}
			case toFamiliar(`Slimeling`).id: {
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
			case toFamiliar(`Gelatinous Cubeling`).id: {
				res.desc.push(
					<Text>{mafiaProperties.cubelingProgress as number}/12 to drop</Text>
				)
				const needs = [
					{ name: 'Pole', item: toItem(`eleven-foot pole`) },
					{ name: 'Ring', item: toItem(`ring of Detect Boring Doors`) },
					{ name: 'Pick', item: toItem(`Pick-O-Matic lockpicks`) },
				].filter((need) => need.item.available < 1)
				if (needs.length > 0) {
					res.desc.push(
						<Text>Need {needs.map((need) => need.name).join(', ')}</Text>
					)
					res.extraClass = 'all-drops'
				}
				break
			}
			case toFamiliar(`Crimbo Shrub`).id: {
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
			case toFamiliar(`Reagnimated Gnome`).id: {
				res.desc.push(
					<Text>{mafiaProperties._gnomeAdv as number} adv gained</Text>
				)
				break
			}
			case toFamiliar(`Temporal Riftlet`).id: {
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
	*/

	return res
}
