import { HStack, Text } from '@chakra-ui/react'
import * as React from 'react'
import { BrowserCharacter } from '../../character'
import { BrowserItem } from '../../guidelines'
import ChitterIcon from './Icons/ChitterIcon'
import ItemIcon from './Icons/ItemIcon'

declare const my: BrowserCharacter

const SpecialCurrencies = ['meat', 'advs', 'fites'] as const

type SpecialCurrency = typeof SpecialCurrencies[number]

const SpecialCurrencyDetails = {
	meat: {
		image: 'meat.gif',
		tooltip: <Text>{my.meat.toLocaleString()} Meat</Text>,
	},
	advs: {
		image: 'slimhourglass.gif',
		tooltip: <Text>{my.advs.toLocaleString()} Adventures remaining</Text>,
	},
	fites: {
		image: 'slimpvp.gif',
		tooltip: <Text>{my.fites.toLocaleString()} PvP Fights remaining</Text>,
	},
}

interface CurrencyReadoutArgs {
	item: BrowserItem | SpecialCurrency
}

export default function CurrencyReadout({ item }: CurrencyReadoutArgs) {
	if (typeof item === 'string') {
		return (
			<HStack>
				<Text>{my[item].toLocaleString()}</Text>
				<ChitterIcon
					image={SpecialCurrencyDetails[item].image}
					tooltip={SpecialCurrencyDetails[item].tooltip}
					borderType="none"
					small
				/>
			</HStack>
		)
	}
	return (
		<HStack>
			<Text>{item.inInventory.toLocaleString()}</Text>
			<ItemIcon item={item} small />
		</HStack>
	)
}
