import * as React from 'react'
import { BrowserList, BrowserSkill } from '../../../guidelines'
import { BrowserMafiaProperties } from '../../../properties'
import SkillPicker from './SkillPicker'

declare const mafiaProperties: BrowserMafiaProperties
declare const skills: BrowserList<BrowserSkill>

export default function PickerSweatpants() {
	const sweat = mafiaProperties.sweat as number
	return (
		<SkillPicker
			header={`Sweat Magic (${sweat}% sweaty)`}
			skills={[
				skills.byName['sip some sweat'],
				skills.byName['drench yourself in sweat'],
				skills.byName['sweat out some booze'],
				skills.byName['make sweat-ade'],
				skills.byName['sweat flick'],
				skills.byName['sweat spray'],
				skills.byName['sweat flood'],
				skills.byName['sweat sip'],
			]}
		/>
	)
}
