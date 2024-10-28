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
		usable:
			!skill.combat &&
			myMp() >= mpCost(skill) &&
			myHp() >= hpCost(skill) &&
			myLightning() >= lightningCost(skill) &&
			myThunder() >= thunderCost(skill) &&
			myRain() >= rainCost(skill),
	}

	function handleCinch(cost: number) {
		const cinch = 100 - clamp(get('_cinchUsed'), 0, 100)
		if (cinch < cost) {
			res.usable = false
		}
		res.desc.push(<Text>Costs {cost} cinch</Text>)
	}

	switch (skill.identifierString) {
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
