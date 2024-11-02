import { Text } from '@chakra-ui/react'
import {
	hpCost,
	lightningCost,
	mpCost,
	myHp,
	myLightning,
	myMp,
	myRain,
	myThunder,
	rainCost,
	Skill,
	thunderCost,
} from 'kolmafia'
import { $skill, clamp, get } from 'libram'
import React from 'react'

interface SkillInfo {
	desc: React.ReactNode[]
	append?: string
	usable: boolean
}

export function getSkillInfo(skill: Skill): SkillInfo {
	const res: SkillInfo = {
		desc: [],
		usable: true,
	}

	function unusableReason(unusable: boolean, reason: string) {
		if (unusable) {
			res.usable = false
			res.desc.push(<Text>{reason}</Text>)
			return true
		}
		return false
	}

	function unusableResource(current: number, cost: number, name: string) {
		if (
			!unusableReason(
				current < cost,
				`Costs ${cost.toLocaleString()} / ${current.toLocaleString()} ${name} (not enough!)`,
			) &&
			cost > 0
		) {
			res.desc.push(
				<Text>
					Costs {cost.toLocaleString()} / {current.toLocaleString()} {name}
				</Text>,
			)
		}
	}

	unusableReason(skill.combat, 'Combat only')
	unusableResource(myMp(), mpCost(skill), 'MP')
	unusableResource(myHp(), hpCost(skill), 'HP')
	unusableResource(myLightning(), lightningCost(skill), 'lightning')
	unusableResource(myThunder(), thunderCost(skill), 'thunder')
	unusableResource(myRain(), rainCost(skill), 'rain')

	function handleSweat(cost: number) {
		unusableResource(clamp(get('sweat'), 0, 100), cost, 'sweat')
	}

	function handleCinch(cost: number) {
		unusableResource(100 - clamp(get('_cinchUsed'), 0, 100), cost, 'cinch')
	}

	switch (skill.identifierString) {
		case $skill`Sip Some Sweat`.identifierString: {
			res.desc.push(<Text>Restore 50 MP</Text>)
			handleSweat(5)
			break
		}
		case $skill`Drench Yourself in Sweat`.identifierString: {
			res.desc.push(<Text>+100% Init for 5 turns</Text>)
			handleSweat(15)
			break
		}
		case $skill`Sweat Out Some Booze`.identifierString: {
			const usesLeft = clamp(3 - get('_sweatOutSomeBoozeUsed'), 0, 3)
			res.desc.push(<Text>Cleans 1 liver</Text>)
			if (usesLeft > 0) {
				res.desc.push(<Text>{usesLeft} left today</Text>)
			} else {
				res.desc.push(<Text>All used for the day</Text>)
				res.usable = false
			}
			handleSweat(25)
			break
		}
		case $skill`Make Sweat-Ade`.identifierString: {
			res.desc.push(
				<Text>Makes a 4 spleen consumable that grants 5 PvP fights</Text>,
			)
			handleSweat(50)
			break
		}
		case $skill`Sweat Flick`.identifierString: {
			res.desc.push(<Text>Deal sleaze damage equal to sweat</Text>)
			handleSweat(1)
			break
		}
		case $skill`Sweat Spray`.identifierString: {
			res.desc.push(
				<Text>Deal minor sleaze damage for the rest of combat</Text>,
			)
			handleSweat(3)
			break
		}
		case $skill`Sweat Flood`.identifierString: {
			res.desc.push(<Text>Stun for 5 rounds (reusable)</Text>)
			handleSweat(5)
			break
		}
		case $skill`Sweat Sip`.identifierString: {
			res.desc.push(<Text>Restore 50 MP... in combat</Text>)
			handleSweat(5)
			break
		}
		case $skill`Cincho: Confetti Extravaganza`.identifierString: {
			res.desc.push(
				<Text>Double substats from this fight, but get smacked</Text>,
			)
			handleCinch(5)
			break
		}
		case $skill`Cincho: Dispense Salt and Lime`.identifierString: {
			res.desc.push(<Text>Triples stat gain from next drink</Text>)
			handleCinch(25)
			break
		}
		case $skill`Cincho: Fiesta Exit`.identifierString: {
			res.desc.push(<Text>Force a noncom</Text>)
			handleCinch(60)
			break
		}
		case $skill`Cincho: Party Foul`.identifierString: {
			res.desc.push(<Text>Damage, weaken, and stun</Text>)
			handleCinch(5)
			break
		}
		case $skill`Cincho: Party Soundtrack`.identifierString: {
			res.desc.push(<Text>30 adv +5lbs fam weight</Text>)
			handleCinch(25)
			break
		}
		case $skill`Cincho: Projectile Piñata`.identifierString: {
			res.desc.push(<Text>Damage, stun, and get candy</Text>)
			handleCinch(5)
			break
		}
	}

	return res
}
