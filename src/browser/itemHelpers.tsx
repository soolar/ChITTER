import * as React from 'react'
import { BrowserItem } from '../guidelines'
import { BrowserMafiaProperties } from '../properties'
import { Text } from '@chakra-ui/react'
import PickerLauncher from './components/Picker/PickerLauncher'
import SweatpantsPicker from './components/Picker/SweatpantsPicker'

declare const mafiaProperties: BrowserMafiaProperties

type DescItem = string | React.ReactNode

interface ExtraItemInfo {
	desc: DescItem[]
	extraOptions: React.ReactNode[]
	extraClass?: string
	borderType: 'normal' | 'caution' | 'danger' | 'good'
}

export function getExtraItemInfo(item: BrowserItem): ExtraItemInfo {
	const res: ExtraItemInfo = {
		desc: [],
		extraOptions: [],
		borderType: 'normal',
	}

	switch (item.name.toLowerCase()) {
		case 'june cleaver': {
			const fightsLeft = mafiaProperties._juneCleaverFightsLeft as number
			if (fightsLeft === 0) {
				res.desc.push('noncom now!')
				res.borderType = 'good'
			} else {
				res.desc.push(`${fightsLeft} to noncom`)
			}
			break
		}
		case 'designer sweatpants': {
			const sweat = Math.max(Math.min(100, mafiaProperties.sweat as number), 0)
			const sweatBoozeLeft =
				3 - (mafiaProperties._sweatOutSomeBoozeUsed as number)
			res.desc.push(`${sweat}% sweaty`)
			if (sweatBoozeLeft > 0) {
				res.desc.push(`${sweatBoozeLeft} booze sweats`)
			}
			res.extraOptions.push(
				<PickerLauncher WrappedPicker={SweatpantsPicker} pickerProps={{}}>
					<Text>
						<Text as="span">Use</Text> some sweat
					</Text>
				</PickerLauncher>
			)
			break
		}
		case 'pantsgiving': {
			const crumbs = 10 - (mafiaProperties._pantsgivingCrumbs as number)
			const banishes = 5 - (mafiaProperties._pantsgivingBanish as number)
			console.log(`butts ${crumbs} ${banishes}`)
			if (crumbs > 0) {
				res.desc.push(<Text>{crumbs} crumbs left</Text>)
			}
			if (banishes > 0) {
				res.desc.push(<Text>{banishes} banishes</Text>)
			}
			break
		}
	}

	return res
}
