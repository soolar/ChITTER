import React from 'react'
import { HStack, Text } from '@chakra-ui/react'
import {
	Item,
	itemAmount,
	myAdventures,
	myMeat,
	pvpAttacksLeft,
	urlEncode,
} from 'kolmafia'
import ChitterIcon from './Icons/ChitterIcon'
import ItemIcon from './Icons/ItemIcon'
import MainLink from './Link/MainLink'
import { getItemInfo } from '../../util/itemHelpers'

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
	const info = getItemInfo(item)
	const link = info.currencyLink ?? {
		href: `/inventory.php?ftext=${urlEncode(item.identifierString)}`,
		desc: undefined,
	}
	return (
		<HStack>
			<Text>{amount.toLocaleString()}</Text>
			<MainLink href={link.href}>
				<ItemIcon
					item={item}
					small
					tooltipDesc={link.desc && `Click to ${link.desc}`}
				/>
			</MainLink>
		</HStack>
	)
}
