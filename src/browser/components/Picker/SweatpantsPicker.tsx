import * as React from 'react'
import { BrowserMafiaProperties } from '../../../properties'
import { $skill } from '../../fakeLibram'
import SkillPicker from './SkillPicker'

declare const mafiaProperties: BrowserMafiaProperties

export default function PickerSweatpants() {
	const sweat = mafiaProperties.sweat as number
	return (
		<SkillPicker
			header={`Sweat Magic (${sweat}% sweaty)`}
			skills={[
				$skill`Sip Some Sweat`,
				$skill`Drench Yourself in Sweat`,
				$skill`Sweat Out Some Booze`,
				$skill`Make Sweat-Ade`,
				$skill`Sweat Flick`,
				$skill`Sweat Spray`,
				$skill`Sweat Flood`,
				$skill`Sweat Sip`,
			]}
		/>
	)
}
