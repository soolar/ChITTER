import { HStack, Text } from '@chakra-ui/react'
import * as React from 'react'
import {
	Item,
	itemAmount,
	myAdventures,
	myMeat,
	pvpAttacksLeft,
} from 'kolmafia'
import ChitterIcon from './Icons/ChitterIcon'
import ItemIcon from './Icons/ItemIcon'

const SpecialCurrencies = ['meat', 'advs', 'fites'] as const
type SpecialCurrency = (typeof SpecialCurrencies)[number]

interface CurrencyReadoutArgs {
	item: Item | SpecialCurrency
}

export default function CurrencyReadout({ item }: CurrencyReadoutArgs) {
	const SpecialCurrencyDetails = {
		meat: {
			image: 'meat.gif',
			tooltip: <Text>{myMeat().toLocaleString()} Meat</Text>,
			amount: myMeat(),
		},
		advs: {
			image: 'slimhourglass.gif',
			tooltip: (
				<Text>{myAdventures().toLocaleString()} Adventures remaining</Text>
			),
			amount: myAdventures(),
		},
		fites: {
			image: 'slimpvp.gif',
			tooltip: <Text>{pvpAttacksLeft()} PvP Fights remaining</Text>,
			amount: pvpAttacksLeft(),
		},
	}
	if (typeof item === 'string') {
		return (
			<HStack>
				<Text>{SpecialCurrencyDetails[item].amount.toLocaleString()}</Text>
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
			<Text>{itemAmount(item).toLocaleString()}</Text>
			<ItemIcon item={item} small />
		</HStack>
	)
}
