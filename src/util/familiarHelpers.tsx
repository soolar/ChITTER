import React from 'react'
import {
	availableAmount,
	Familiar,
	familiarWeight,
	Item,
	stringModifier,
} from 'kolmafia'
import { $effect, $familiar, $item, CrownOfThrones, get, have } from 'libram'
import { HStack, Image, Text, Tooltip, VStack } from '@chakra-ui/react'
import { parseMods, pluralize, showFam } from './index'
import { BorderType } from '../browser/components/Icons/ChitterIcon'
import { FamiliarVerb } from '../browser/components/Icons/FamIcon'
import ProgressBar from '../browser/components/ProgressBar'
import MainLink from '../browser/components/Link/MainLink'

export function nextLevelInfo(fam: Familiar) {
	for (let i = 2; i <= 20; ++i) {
		const nextGoal = i * i
		if (nextGoal > fam.experience) {
			const prevGoal = i === 2 ? 0 : (i - 1) * (i - 1)
			return { progress: fam.experience - prevGoal, goal: nextGoal - prevGoal }
		}
	}
	return { progress: 1, goal: 1 }
}

export function getWeirdoDivContents(fam: Familiar) {
	switch (fam.identifierString) {
		case $familiar`Melodramedary`.identifierString:
			// TODO: Add extraClass for melodramedary from getFamInfo
			const weight = familiarWeight(fam)
			return (
				<HStack
					className={'chit-icon chit-icon-weird'}
					spacing="0"
					onContextMenu={(ev) => {
						showFam(fam.id)
						ev.preventDefault()
					}}
				>
					<Image src="/images/otherimages/camelfam_left.gif" border={0} />
					{Array(Math.floor(weight / 5)).fill(
						<Image src="/images/otherimages/camelfam_middle.gif" border={0} />,
					)}
					<Image src="/images/otherimages/camelfam_right.gif" border={0} />
				</HStack>
			)
	}

	return null
}

interface DropInfo {
	drop: Item | string
	dropped?: number
	limit?: number
}

interface FamInfo {
	desc: React.ReactNode[]
	extraClass?: string
	borderType: BorderType
	dropInfo?: DropInfo
}

export function getFamInfo(
	fam: Familiar,
	isTooltip: boolean,
	type: FamiliarVerb,
): FamInfo {
	const res: FamInfo = { borderType: 'normal', desc: [] }

	if (type === 'familiar') {
		switch (fam.identifierString) {
			case $familiar`Fist Turkey`.identifierString: {
				const musLeft = 5 - get('_turkeyMuscle')
				const mysLeft = 5 - get('_turkeyMyst')
				const moxLeft = 5 - get('_turkeyMoxie')
				const statsLeft = musLeft + mysLeft + moxLeft
				if (statsLeft > 0) {
					const statsLeftStr = (
						[
							[musLeft, 'mus'],
							[mysLeft, 'mys'],
							[moxLeft, 'mox'],
						] as [number, string][]
					)
						.filter((entry) => entry[0] > 0)
						.map((entry) => `${entry[0]} ${entry[1]}`)
						.join(', ')
					if (isTooltip) {
						res.desc.push(<Text>{statsLeftStr} left</Text>)
					} else {
						res.desc.push(
							<Tooltip label={<Text>{statsLeftStr}</Text>}>
								<Text>{statsLeft} stats left</Text>
							</Tooltip>,
						)
					}
				}
				break
			}
			case $familiar`Melodramedary`.identifierString: {
				const spit = get('camelSpit')
				if (spit >= 100) {
					res.desc.push(<Text>Ready to spit!</Text>)
					res.extraClass = 'has-drops'
				} else {
					res.desc.push(
						<VStack spacing="none">
							<Text>{spit}% charged</Text>
							<ProgressBar value={spit} max={100} desc="camel spit" />
						</VStack>,
					)
				}
				break
			}
			case $familiar`Steam-Powered Cheerleader`.identifierString: {
				const steamPercent = Math.ceil(get('_cheerleaderSteam') / 2)
				if (steamPercent > 0) {
					res.desc.push(
						<VStack spacing="none">
							<Text>{steamPercent}% steam</Text>
							<ProgressBar value={steamPercent} max={100} desc="% steam" />
						</VStack>,
					)
					res.extraClass = steamPercent > 50 ? 'all-drops' : 'has-drops'
				}
				break
			}
			case $familiar`Slimeling`.identifierString: {
				const fullness = get('slimelingFullness')
				const stacksDue = get('slimelingStacksDue')
				const stacksDropped = get('slimelingStacksDropped')
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
						</>,
					)
				}
				if (hasStacksToDrop) {
					res.extraClass = stacksDropped === 0 ? 'all-drops' : 'has-drops'
				}
				break
			}
			case $familiar`Gelatinous Cubeling`.identifierString: {
				const progress = get('cubelingProgress')
				res.desc.push(
					<VStack spacing="none">
						<Text>{progress}/12 to drop</Text>
						<ProgressBar value={progress} max={12} desc="progress" />
					</VStack>,
				)
				const needs = [
					{ name: 'Pole', item: $item`eleven-foot pole` },
					{ name: 'Ring', item: $item`ring of Detect Boring Doors` },
					{ name: 'Pick', item: $item`Pick-O-Matic lockpicks` },
				].filter((need) => availableAmount(need.item) < 1)
				if (needs.length > 0) {
					res.desc.push(
						<Text>Need {needs.map((need) => need.name).join(', ')}</Text>,
					)
					res.extraClass = 'all-drops'
				}
				break
			}
			case $familiar`Crimbo Shrub`.identifierString: {
				const gifts = get('shrubGifts')
				const readyToFire =
					gifts === 'yellow'
						? !have($effect`Everything Looks Yellow`)
						: gifts === 'meat' && !have($effect`Everything Looks Red`)
				res.extraClass = 'all-drops'
				if (readyToFire) {
					res.desc.push(<Text>Ready to fire!</Text>)
				} else if (gifts === '') {
					res.desc.push(
						<Text>
							<MainLink href="/inv_use.php?pwd&which=3&whichitem=7958">
								Decorate
							</MainLink>{' '}
							your shrub!
						</Text>,
					)
				} else {
					res.extraClass = undefined
				}
				break
			}
			case $familiar`Reagnimated Gnome`.identifierString: {
				const advsGained = get('_gnomeAdv')
				res.desc.push(<Text>{advsGained} adv gained</Text>)
				break
			}
			case $familiar`Temporal Riftlet`.identifierString: {
				const advsGained = get('_riftletAdv')
				res.desc.push(<Text>{advsGained} adv gained</Text>)
				break
			}
		}
	}

	const dropsLeft = fam.dropsLimit - fam.dropsToday
	let hasDrops = type === 'familiar' && dropsLeft > 0
	let allDrops = hasDrops && fam.dropsToday === 0
	const drop =
		fam.dropItem.identifierString !== 'none' ? fam.dropItem : fam.dropName
	const dropName = pluralize(drop, fam.dropsLimit)

	if (dropName) {
		console.log(`${fam.identifierString}: ${dropName}`)
		if (hasDrops) {
			res.dropInfo = { drop, dropped: fam.dropsToday, limit: fam.dropsLimit }
			res.desc.unshift(
				<Text>
					{fam.dropsToday}/{fam.dropsLimit} {dropName}
				</Text>,
			)
		} else {
			res.dropInfo = { drop }
			res.desc.unshift(<Text>drops {dropName}</Text>)
		}
	}

	if (type !== 'familiar') {
		const modifiers = stringModifier(
			`Throne:${fam.identifierString}`,
			'Modifiers',
		)
		const parsedModifiers = parseMods(modifiers)
		res.desc.push(<Text>{parsedModifiers}</Text>)
		const riderInfo = CrownOfThrones.ridingFamiliars.find(
			(value) => value.familiar === fam,
		)
		if (riderInfo && (!riderInfo.dropPredicate || riderInfo.dropPredicate())) {
			// TODO: Stuff
		}
	}

	if (allDrops) {
		res.borderType = 'all-drops'
	} else if (hasDrops) {
		res.borderType = 'has-drops'
	}

	return res
}
