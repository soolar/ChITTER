import * as React from 'react'
import { Text } from '@chakra-ui/react'
//import { $skill, get } from 'libram'
import { getProperty, Skill, toSkill } from 'kolmafia'

interface ExtraSkillInfo {
	desc: React.ReactNode[]
	append?: string
	usable: boolean
}

export function getExtraSkillInfo(sk: Skill): ExtraSkillInfo {
	const res: ExtraSkillInfo = { desc: [], usable: true }

	const handleSweat = (sweatCost: number) => {
		const sweat = Number(getProperty('sweat'))
		if (sweat < sweatCost) {
			res.usable = false
		}
		res.append = `${sweatCost} sweat`
	}

	switch (sk) {
		case toSkill(`Sip Some Sweat`): {
			res.desc.push(<Text>Restore 50 MP</Text>)
			handleSweat(5)
			break
		}
		case toSkill(`Drench Yourself in Sweat`): {
			res.desc.push(<Text>+100% Init for 5 turns</Text>)
			handleSweat(15)
			break
		}
		case toSkill(`Sweat Out Some Booze`): {
			const usesLeft = 3 - Number(getProperty('_sweatOutSomeBoozeUsed'))
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
		case toSkill(`Make Sweat-Ade`): {
			res.desc.push(
				<Text>Makes a 4 spleen consumable that grants 5 PvP fights</Text>
			)
			handleSweat(50)
			break
		}
		case toSkill(`Sweat Flick`): {
			res.desc.push(<Text>Deal sweat sleaze damage</Text>)
			handleSweat(1)
			break
		}
		case toSkill(`Sweat Spray`): {
			res.desc.push(
				<Text>Deal minor sleaze damage for the rest of combat</Text>
			)
			handleSweat(3)
			break
		}
		case toSkill(`Sweat Flood`): {
			res.desc.push(<Text>Stun for 5 rounds (reusable)</Text>)
			handleSweat(5)
			break
		}
		case toSkill(`Sweat Sip`): {
			res.desc.push(<Text>Restore 50 MP... in combat</Text>)
			handleSweat(5)
			break
		}
	}

	return res
}
