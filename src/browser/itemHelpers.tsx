import * as React from 'react'
import { BrowserItem } from '../guidelines'
import { BrowserMafiaProperties } from '../properties'
import { Text } from '@chakra-ui/react'
import SweatpantsPicker from './components/Picker/SweatpantsPicker'
import { BorderType } from './components/Icons/ChitterIcon'
import PickerOption from './components/Option/PickerOption'
import ItemIcon from './components/Icons/ItemIcon'

declare const mafiaProperties: BrowserMafiaProperties

interface ExtraItemInfo {
	displayName: string
	desc: React.ReactNode[]
	extraOptions: React.ReactNode[]
	image: string
	extraClass?: string
	borderType: BorderType
}

interface GetExtraItemInfoOptionalArgs {
	namePrefix?: string
	iconOverride?: string
}

export function getExtraItemInfo(
	item?: BrowserItem,
	optionals: GetExtraItemInfoOptionalArgs = {}
): ExtraItemInfo {
	const name = item ? item.name : 'empty'
	const res: ExtraItemInfo = {
		displayName: optionals.namePrefix ? `${optionals.namePrefix}${name}` : name,
		desc: [],
		extraOptions: [],
		image: optionals.iconOverride || (item ? item.image : 'blank.gif'),
		borderType: 'normal',
	}

	if (item === undefined) {
		return res
	}

	switch (item.name.toLowerCase()) {
		case 'june cleaver': {
			const fightsLeft = mafiaProperties._juneCleaverFightsLeft as number
			if (fightsLeft === 0) {
				res.desc.push(<Text>noncom now!</Text>)
				res.borderType = 'good'
			} else {
				res.desc.push(<Text>{fightsLeft} to noncom</Text>)
			}
			break
		}
		case 'designer sweatpants': {
			const sweat = Math.max(Math.min(100, mafiaProperties.sweat as number), 0)
			const sweatBoozeLeft =
				3 - (mafiaProperties._sweatOutSomeBoozeUsed as number)
			res.desc.push(<Text>{sweat}% sweaty</Text>)
			if (sweatBoozeLeft > 0) {
				res.desc.push(<Text>{sweatBoozeLeft} booze sweats</Text>)
			}
			res.extraOptions.push(
				<PickerOption icon={<ItemIcon item={item} />} WrappedPicker={SweatpantsPicker} pickerProps={{}} verb="use" subject="some sweat"/>
			)
			break
		}
		case 'pantsgiving': {
			const crumbs = 10 - (mafiaProperties._pantsgivingCrumbs as number)
			const banishes = 5 - (mafiaProperties._pantsgivingBanish as number)
			if (crumbs > 0) {
				res.desc.push(<Text>{crumbs} crumbs left</Text>)
			}
			if (banishes > 0) {
				res.desc.push(<Text>{banishes} banishes</Text>)
			}
			break
		}
		case 'v for vivala mask': {
			const advsGainable = 10 - (mafiaProperties._vmaskAdv as number)
			if (advsGainable > 0) {
				res.desc.push(<Text>{advsGainable} adv gainable</Text>)
				res.borderType = 'has-drops'
			}
			break
		}
		case 'mayfly bait necklace': {
			const fliesLeft = 30 - (mafiaProperties._mayflySummons as number)
			if (fliesLeft > 0) {
				res.desc.push(<Text>{fliesLeft} summons left</Text>)
				res.borderType = 'has-drops'
			}
			break
		}
		// @ts-expect-error intentional fallthrough
		case 'stinky cheese eye': {
			if (!(mafiaProperties._stinkyCheeseBanisherUsed as boolean)) {
				res.desc.push(<Text>banish available</Text>)
			}
			// intentional fallthrough to automatically get stinkiness
		}
		// eslint-disable-next-line no-fallthrough
		case 'stinky cheese sword':
		case 'stinky cheese diaper':
		case 'stinky cheese wheel':
		case 'staff of queso escusado': {
			const stinkiness = mafiaProperties._stinkyCheeseCount as number
			if (stinkiness < 100) {
				res.desc.push(
					<Text>
						{mafiaProperties._stinkyCheeseCount as number}/100 stinkiness
					</Text>
				)
				res.borderType = 'has-drops'
			} else {
				res.desc.push(<Text>fully stinky</Text>)
			}
			break
		}
	}

	return res
}
