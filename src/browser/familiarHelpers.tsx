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

interface ExtraFamInfo {
	desc?: React.ReactNode
	extraClass?: string
	borderType: BorderType
}

export function getExtraFamInfo(
	fam: BrowserFamiliar,
	isTooltip: boolean,
	isBjorn: boolean
): ExtraFamInfo {
	const res: ExtraFamInfo = { borderType: 'normal' }

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
					res.desc = <Text>{statsLeftStr} left</Text>
				} else {
					res.desc = (
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
				res.desc = 'Ready to spit!'
				res.extraClass = 'has-drops'
			} else {
				res.desc = (
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
				res.desc = <Text>{steamPercent}% steam</Text>
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
				res.desc = (
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
			res.desc = (
				<Text>{mafiaProperties.cubelingProgress as number}/12 to drop</Text>
			)
			const needs = [
				{ name: 'Pole', item: items.byName['eleven-foot pole'] },
				{ name: 'Ring', item: items.byName['ring of detect boring doors'] },
				{ name: 'Pick', item: items.byName['pick-o-matic lockpicks'] },
			].filter((need) => need.item.available < 1)
			if (needs.length > 0) {
				res.desc = (
					<>
						{res.desc}
						<Text>Need {needs.map((need) => need.name).join(', ')}</Text>
					</>
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
				res.desc = <Text>Ready to fire!</Text>
			} else if (gifts === '') {
				res.desc = <Text>Needs to be decorated!</Text>
			} else {
				res.extraClass = undefined
			}
			break
		}
	}

	const dropsLeft = fam.dropsLimit - fam.dropsToday
	const hasDrops = !isBjorn && dropsLeft > 0
	const allDrops = hasDrops && fam.dropsToday === 0
	const dropName = fam.drop
		? pluralize(fam.drop, dropsLeft)
		: pluralize(fam.dropName, dropsLeft)

	if (hasDrops && dropName) {
		const dropText = `${dropsLeft} ${dropName}`
		if (res.desc) {
			res.desc = (
				<>
					<Text>{dropText}</Text>
					{res.desc}
				</>
			)
		} else {
			res.desc = <Text>{dropText}</Text>
		}
	}

	if (allDrops) {
		res.borderType = 'all-drops'
	} else if (hasDrops) {
		res.borderType = 'has-drops'
	}

	return res
}
