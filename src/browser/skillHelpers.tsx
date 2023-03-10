import * as React from 'react'
import { Text } from '@chakra-ui/react'
import { BrowserSkill } from '../guidelines'
import { BrowserMafiaProperties } from '../properties'
import {$skill} from './fakeLibram'

declare const mafiaProperties: BrowserMafiaProperties

interface ExtraSkillInfo {
	desc: React.ReactNode[]
	append?: string
	usable: boolean
}

export function getExtraSkillInfo(sk: BrowserSkill): ExtraSkillInfo {
	const res: ExtraSkillInfo = { desc: [], usable: true }

	const handleSweat = (sweatCost: number) => {
		const sweat = mafiaProperties.sweat as number
		if (sweat < sweatCost) {
			res.usable = false
		}
		res.append = `${sweatCost} sweat`
	}

	switch (sk.id) {
		case $skill`Sip Some Sweat`.id: {
			res.desc.push(<Text>Restore 50 MP</Text>)
			handleSweat(5)
			break
		}
		case $skill`Drench Yourself in Sweat`.id: {
			res.desc.push(<Text>+100% Init for 5 turns</Text>)
			handleSweat(15)
			break
		}
		case $skill`Sweat Out Some Booze`.id: {
			const usesLeft = 3 - (mafiaProperties._sweatOutSomeBoozeUsed as number)
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
		case $skill`Make Sweat-Ade`.id: {
			res.desc.push(
				<Text>Makes a 4 spleen consumable that grants 5 PvP fights</Text>
			)
			handleSweat(50)
			break
		}
		case $skill`Sweat Flick`.id: {
			res.desc.push(<Text>Deal sweat sleaze damage</Text>)
			handleSweat(1)
			break
		}
		case $skill`Sweat Spray`.id: {
			res.desc.push(
				<Text>Deal minor sleaze damage for the rest of combat</Text>
			)
			handleSweat(3)
			break
		}
		case $skill`Sweat Flood`.id: {
			res.desc.push(<Text>Stun for 5 rounds (reusable)</Text>)
			handleSweat(5)
			break
		}
		case $skill`Sweat Sip`.id: {
			res.desc.push(<Text>Restore 50 MP... in combat</Text>)
			handleSweat(5)
			break
		}
	}

	return res
}
