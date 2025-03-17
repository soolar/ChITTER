import { $item, $path } from 'libram'
import { ItemInfo } from '../helpers'
import { myPath } from 'kolmafia'
import { ItemListEntry } from './itemList'

const inNA = myPath() === $path`Nuclear Autumn`

const currenciesBasic: [string, { href: string; desc: string }][] = [
	[
		$item`Shore Inc. Ship Trip Scrip`.identifierString,
		{
			href: '/shop.php?whichshop=shore',
			desc: "Click to drop by The Shore's Gift Shop",
		},
	],
	[
		$item`hobo nickel`.identifierString,
		{
			href: '/clan_hobopolis.php',
			desc: 'Click to wander on over to hobopolis',
		},
	],
	[
		$item`Freddy Kruegerand`.identifierString,
		{
			href: '/shop.php?whichshop=dv',
			desc: 'Click to visit The Terrified Eagle Inn',
		},
	],
	[
		$item`Beach Buck`.identifierString,
		{
			href: '/place.php?whichplace=airport_sleaze',
			desc: 'Click to take a trip to Spring Break Beach',
		},
	],
	[
		$item`Coinspiracy`.identifierString,
		{
			href: '/place.php?whichplace=airport_spooky_bunker',
			desc: 'Click to hop down the hatch to the Conspiracy Island bunker',
		},
	],
	[
		$item`FunFunds™`.identifierString,
		{
			href: '/shop.php?whichshop=landfillstore',
			desc: 'Click to shop for some souvenirs at the Dinsey Company Store',
		},
	],
	[
		$item`Volcoino`.identifierString,
		{
			href: '/shop.php?whichshop=infernodisco',
			desc: 'Click to boogie right on down to Disco GiftCo',
		},
	],
	[
		$item`Wal-Mart gift certificate`.identifierString,
		{
			href: '/shop.php?whichshop=glaciest',
			desc: 'Click to browse the goods at Wal-Mart',
		},
	],
	[
		$item`rad`.identifierString,
		{
			href: '/shop.php?whichshop=mutate',
			desc: 'Click to fiddle with your genes',
		},
	],
	[
		$item`BACON`.identifierString,
		{
			href: '/shop.php?whichshop=bacon',
			desc: 'Born too late to explore the Earth... Born too soon to explore the galaxy... Born just in time to click to BROWSE DANK MEMES',
		},
	],
	[
		$item`buffalo dime`.identifierString,
		{
			href: '/place.php?whichplace=town_right&action=townright_ltt',
			desc: 'Click to visit your local LT&T Office',
		},
	],
	[
		$item`Source essence`.identifierString,
		{
			href: inNA
				? '/place.php?whichplace=falloutshelter&action=vault_term'
				: '/campground.php?action=terminal',
			desc: 'Click to boot up your Source Terminal',
		},
	],
	[
		$item`cop dollar`.identifierString,
		{
			href: '/shop.php?whichshop=detective',
			desc: 'Click to visit the quartermaster',
		},
	],
	[
		$item`cashew`.identifierString,
		{
			href: '/shop.php?whichshop=thankshop',
			desc: 'Click to cash in your cashews',
		},
	],
	[
		$item`sprinkles`.identifierString,
		{
			href: '/place.php?whichplace=gingerbreadcity',
			desc: 'Click to take a tour of Gingerbread City',
		},
	],
	[
		$item`Spacegate Research`.identifierString,
		{
			href: '/shop.php?whichshop=spacegate',
			desc: 'Click to exchange your research at the Fabrication Facility',
		},
	],
	[
		$item`X`.identifierString,
		{
			href: '/shop.php?whichshop=xo',
			desc: 'Click to eXpend some Xes',
		},
	],
	[
		$item`O`.identifierString,
		{
			href: '/shop.php?whichshop=xo',
			desc: 'Click to blOw some Os',
		},
	],
	[
		$item`Rubee™`.identifierString,
		{
			href: '/shop.php?whichshop=fantasyrealm',
			desc: 'Click to spend some Rubees&trade;',
		},
	],
	[
		$item`stick of firewood`.identifierString,
		{
			href: '/shop.php?whichshop=campfire',
			desc: 'Click to stop by your campfire',
		},
	],
	[
		$item`inflammable leaf`.identifierString,
		{
			href: '/campground.php?preaction=leaves',
			desc: 'Click to look at your pile of burning leaves',
		},
	],
]

const currencies: ItemListEntry[] = currenciesBasic.map(([name, info]) => [
	name,
	(itemInfo: ItemInfo) => {
		itemInfo.currencyLink = info
	},
])

export default currencies
