import React from 'react'
import { HStack, Text } from '@chakra-ui/react'
import {
	Item,
	itemAmount,
	myAdventures,
	myMeat,
	pvpAttacksLeft,
} from 'kolmafia'
import ChitterIcon from './Icons/ChitterIcon'
import ItemIcon from './Icons/ItemIcon'

const SpecialCurrencyDetails = {
	meat: {
		image: 'meat.gif',
		getter: myMeat,
		suffix: 'Meat',
	},
	advs: {
		image: 'slimhourglass.gif',
		getter: myAdventures,
		suffix: 'Adventures remaining',
	},
	fites: {
		image: 'slimpvp.gif',
		getter: pvpAttacksLeft,
		suffix: 'PvP Fights remaining',
	},
} as const

type SpecialCurrency = keyof typeof SpecialCurrencyDetails

interface CurrencyReadoutArgs {
	item: Item | SpecialCurrency
}

export default function CurrencyReadout({ item }: CurrencyReadoutArgs) {
	if (typeof item === 'string') {
		const details = SpecialCurrencyDetails[item]
		const amount = details.getter().toLocaleString()
		return (
			<HStack>
				<Text>{amount}</Text>
				<ChitterIcon
					image={details.image}
					tooltip={
						<Text>
							{amount} {details.suffix}
						</Text>
					}
					borderType="none"
					small
				/>
			</HStack>
		)
	}
	const amount = itemAmount(item)
	return (
		<HStack>
			<Text>{amount.toLocaleString()}</Text>
			<ItemIcon item={item} small />
		</HStack>
	)
}
