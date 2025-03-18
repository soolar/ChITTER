import { HStack, Text } from '@chakra-ui/react'
import {
	getFuel,
	Item,
	itemAmount,
	myAdventures,
	myMeat,
	pullsRemaining,
	pvpAttacksLeft,
	urlEncode,
} from 'kolmafia'
import ChitterIcon from './Icons/ChitterIcon'
import ItemIcon from './Icons/ItemIcon'
import MainLink from './Link/MainLink'
import { getItemInfo } from '../../util/helpers'
import { clamp, get } from 'libram'

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
	pulls: {
		image: 'wblprom.gif',
		getter: pullsRemaining,
		suffix: 'pulls remaining',
		link: { href: '/storage.php', desc: 'visit Hagnk' },
	},
	timespinnerminutes: {
		image: 'timespinner.gif',
		getter: () => 10 - clamp(get('_timeSpinnerMinutesUsed'), 0, 10),
		suffix: 'Time-Spinner minutes',
		link: {
			href: '/inv_use.php?pwd&whichitem=9104',
			desc: 'spin your Time-Spinner',
		},
	},
	asdonfuel: {
		image: 'tank.gif',
		getter: getFuel,
		suffix: 'Asdon Martin fuel',
		link: {
			href: '/campground.php?action=fuelconvertor',
			desc: 'check your fuel tank',
		},
	},
	embers: {
		image: 'fire.gif',
		getter: () => get('availableSeptEmbers'),
		suffix: 'Sept-Embers',
		link: {
			href: '/shop.php?whichshop=september',
			desc: 'stoke your Sept-Ember Censer',
		},
	},
} as const

export type SpecialCurrency = keyof typeof SpecialCurrencyDetails

interface CurrencyReadoutArgs {
	item: Item | SpecialCurrency
	skipZero?: boolean
}

export default function CurrencyReadout({
	item,
	skipZero,
}: CurrencyReadoutArgs) {
	if (typeof item === 'string') {
		const details = SpecialCurrencyDetails[item]
		const amount = details.getter()
		if (amount <= 0 && skipZero) {
			return undefined
		}
		const amountStr = amount.toLocaleString()
		const icon = (
			<ChitterIcon
				image={details.image}
				tooltip={
					<Text>
						{amountStr} {details.suffix}{' '}
						{details.link && `(Click to ${details.link.desc})`}
					</Text>
				}
				small
			/>
		)
		return (
			<HStack>
				<Text>{amountStr}</Text>
				{details.link ? (
					<MainLink href={details.link.href}>{icon}</MainLink>
				) : (
					icon
				)}
			</HStack>
		)
	}
	const amount = itemAmount(item)
	if (amount <= 0 && skipZero) {
		return undefined
	}
	const info = getItemInfo(item)
	const link = info.currencyLink ?? {
		href: `/inventory.php?ftext=${urlEncode(item.identifierString)}`,
		desc: `Click to contemplate your ${item.plural}`,
	}
	return (
		<HStack>
			<Text>{amount.toLocaleString()}</Text>
			<MainLink href={link.href}>
				<ItemIcon item={item} small tooltipDesc={link.desc} />
			</MainLink>
		</HStack>
	)
}
