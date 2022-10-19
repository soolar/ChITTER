import * as React from 'react'
import { BrowserList, BrowserSkill } from '../../../guidelines'
import { BrowserMafiaProperties } from '../../../properties'
import SkillOption from '../Option/SkillOption'
import Picker from '../Picker/Picker'

declare const mafiaProperties: BrowserMafiaProperties
declare const skills: BrowserList<BrowserSkill>

interface SweatOptionArgs {
	skill: BrowserSkill
	desc: string
	sweatCost: number
}

function SweatOption({ skill, desc, sweatCost }: SweatOptionArgs) {
	const sweat = mafiaProperties.sweat as number
	const canUse = sweat >= sweatCost
	const enabled =
		canUse && (!skill.combat || skill.name.toLowerCase() === 'sweat sip')

	return (
		<SkillOption
			skill={skill}
			desc={desc}
			append={`${sweatCost} sweat`}
			enabled={enabled}
		/>
	)
}

export default function PickerSweatpants() {
	const sweat = mafiaProperties.sweat as number
	const sweatBoozeLeft = 3 - (mafiaProperties._sweatOutSomeBoozeUsed as number)
	return (
		<Picker header={`Sweat Magic (${sweat}% sweaty)`}>
			<SweatOption
				skill={skills.byName['sip some sweat']}
				desc="Restore 50 MP"
				sweatCost={5}
			/>
			<SweatOption
				skill={skills.byName['drench yourself in sweat']}
				desc="+100% Init for 5 turns"
				sweatCost={15}
			/>
			<SweatOption
				skill={skills.byName['sweat out some booze']}
				desc={`Cleanse 1 liver (${sweatBoozeLeft} left today)`}
				sweatCost={25}
			/>
			<SweatOption
				skill={skills.byName['make sweat-ade']}
				desc="Makes a 4 spleen consumable that grants 5 PvP fights"
				sweatCost={50}
			/>
			<SweatOption
				skill={skills.byName['sweat flick']}
				desc="Deals sweat sleaze damage"
				sweatCost={1}
			/>
			<SweatOption
				skill={skills.byName['sweat spray']}
				desc="Deal minor sleaze damage for the rest of combat"
				sweatCost={3}
			/>
			<SweatOption
				skill={skills.byName['sweat flood']}
				desc="Stun for 5 rounds"
				sweatCost={5}
			/>
			<SweatOption
				skill={skills.byName['sweat sip']}
				desc="Restore 50 MP"
				sweatCost={5}
			/>
		</Picker>
	)
}
