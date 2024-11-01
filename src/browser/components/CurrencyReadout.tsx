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
import MainLink from './Link/MainLink'

const SpecialCurrencyDetails = {
	meat: {
		image: 'meat.gif',
		getter: myMeat,
		suffix: 'Meat',
		link: undefined,
	},
	advs: {
		image: 'slimhourglass.gif',
		getter: myAdventures,
		suffix: 'Adventures remaining',
		link: undefined,
	},
	fites: {
		image: 'slimpvp.gif',
		getter: pvpAttacksLeft,
		suffix: 'PvP Fights remaining',
		link: { href: '/peevpee.php', desc: 'visit Huggler Memorial Colosseum' },
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
		const icon = (
			<ChitterIcon
				image={details.image}
				tooltip={
					<Text>
						{amount} {details.suffix}{' '}
						{details.link && `(Click to ${details.link.desc})`}
					</Text>
				}
				borderType="none"
				small
			/>
		)
		return (
			<HStack>
				<Text>{amount}</Text>
				{details.link ? (
					<MainLink href={details.link.href}>{icon}</MainLink>
				) : (
					icon
				)}
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
