import React from 'react'
import { BorderType } from '../browser/components/Icons/ChitterIcon'
import {
	availableAmount,
	closetAmount,
	creatableAmount,
	getRelated,
	Item,
	itemAmount,
	myBjornedFamiliar,
	myEnthronedFamiliar,
	myPath,
	pullsRemaining,
	storageAmount,
	stringModifier,
	toItem,
	totalFreeRests,
	weaponHands,
} from 'kolmafia'
import { $familiar, $item, $path, $skills, clamp, get } from 'libram'
import { parseMods } from '.'
import { getFamInfo } from './familiarHelpers'
import PickerOption from '../browser/components/Option/PickerOption'
import ItemIcon from '../browser/components/Icons/ItemIcon'
import FamiliarPicker from '../browser/components/Picker/FamiliarPicker'
import { Text } from '@chakra-ui/react'
import MainLinkOption from '../browser/components/Option/MainLinkOption'
import SkillPicker from '../browser/components/Picker/SkillPicker'

type EquipVerb =
	| 'equip'
	| 'uncloset'
	| 'fold'
	| 'create'
	| 'pull'
	| 'somehow equip'

export function foldableAmount(item: Item) {
	return Object.keys(getRelated(item, 'fold'))
		.filter((foldableName) => foldableName !== item.identifierString)
		.map((foldableName) => toItem(foldableName))
		.reduce((partial, foldable) => partial + availableAmount(foldable), 0)
}

interface ItemInfo {
	displayName: string
	desc: React.ReactNode[]
	mods: string
	extraOptions: React.ReactNode[]
	image: string
	extraClass?: string
	borderType: BorderType
	equipVerb: EquipVerb
	currencyLink?: { href: string; desc: string }
}

interface GetItemInfoOptionalArgs {
	namePrefix?: string
	iconOverride?: string
	forEquipping?: boolean
}

export function getItemInfo(
	item?: Item,
	optionals: GetItemInfoOptionalArgs = {},
): ItemInfo {
	const isSomething = item && item !== $item.none
	const name = isSomething ? item.name : 'empty'
	const mods = isSomething ? stringModifier(item, 'Evaluated Modifiers') : ''
	const res: ItemInfo = {
		displayName: optionals.namePrefix ? `${optionals.namePrefix}${name}` : name,
		desc: [],
		mods,
		extraOptions: [],
		image: optionals.iconOverride || (isSomething ? item.image : 'blank.gif'),
		borderType: 'normal',
		equipVerb: 'equip',
	}

	if (!isSomething) {
		return res
	}

	const hands = weaponHands(item)
	if (hands > 1) {
		res.displayName = `${res.displayName} (${hands}h)`
	}

	switch (item.identifierString) {
		case $item`Crown of Thrones`.identifierString: {
			const throneFam = myEnthronedFamiliar()
			if (throneFam !== $familiar.none) {
				res.image = throneFam.image
				const throneInfo = getFamInfo(throneFam, true, 'enthrone')
				res.desc.push(...throneInfo.desc)
				res.borderType = throneInfo.borderType
			}
			res.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={item} />}
					WrappedPicker={FamiliarPicker}
					pickerProps={{ type: 'enthrone' as const }}
					verb="pick"
					subject="a rider"
				/>,
			)
			break
		}
		case $item`Buddy Bjorn`.identifierString: {
			const bjornFam = myBjornedFamiliar()
			if (bjornFam !== $familiar.none) {
				res.image = bjornFam.image
				const bjornInfo = getFamInfo(bjornFam, true, 'bjornify')
				res.desc.push(...bjornInfo.desc)
				res.borderType = bjornInfo.borderType
			}
			res.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={item} />}
					WrappedPicker={FamiliarPicker}
					pickerProps={{ type: 'bjornify' as const }}
					verb="pick"
					subject="a rider"
				/>,
			)
			break
		}
		case $item`June cleaver`.identifierString: {
			const fightsLeft = get('_juneCleaverFightsLeft')
			if (fightsLeft === 0) {
				res.desc.push(<Text>noncom now!</Text>)
				res.borderType = 'good'
			} else {
				res.desc.push(<Text>{fightsLeft} to noncom</Text>)
			}
			break
		}
		case $item`designer sweatpants`.identifierString: {
			const sweat = clamp(get('sweat'), 0, 100)
			const sweatBoozeLeft = clamp(3 - get('_sweatOutSomeBoozeUsed'), 0, 3)
			res.desc.push(<Text>{sweat}% sweaty</Text>)
			if (sweatBoozeLeft > 0) {
				res.desc.push(<Text>{sweatBoozeLeft} booze sweats</Text>)
			}
			res.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={item} />}
					WrappedPicker={SkillPicker}
					pickerProps={{
						skills: $skills`Sip Some Sweat, Drench Yourself in Sweat, Sweat Out Some Booze, Make Sweat-Ade, Sweat Flick, Sweat Spray, Sweat Flood, Sweat Sip`,
						header: `Use some sweat (${sweat} left)`,
					}}
					verb="use"
					subject="some sweat"
				/>,
			)
			break
		}
		case $item`cursed monkey's paw`.identifierString: {
			// sorted such that index = wishes used to unlock that skill
			const pawSkills = $skills`Monkey Slap, Monkey Tickle, Evil Monkey Eye, Monkey Peace Sign, Monkey Point, Monkey Punch`
			const pawSkillDescs = [
				'Batter up-like',
				'Delevel',
				<>
					<Text className="modSpooky">Spooky damage</Text> + delevel
				</>,
				'Heal',
				'Olfaction-like',
				'Physical damage',
			]
			const wishesUsed = clamp(get('_monkeyPawWishesUsed'), 0, 5)
			res.desc.push(<Text>{wishesUsed} / 5 wishes used</Text>)
			if (wishesUsed < 5) {
				res.borderType = 'has-drops'
			}
			res.image = `monkeypaw${wishesUsed}.gif`
			res.desc.push(
				<Text>
					Current skill: {pawSkills[wishesUsed].identifierString} (
					{pawSkillDescs[wishesUsed]})
				</Text>,
			)
			if (wishesUsed < 5) {
				res.desc.push(
					<Text>
						Next skill: {pawSkills[wishesUsed + 1].identifierString} (
						{pawSkillDescs[wishesUsed + 1]})
					</Text>,
				)
				res.extraOptions.push(
					<MainLinkOption
						icon={<ItemIcon item={item} />}
						href="/main.php?pwd&action=cmonk"
						verb="wish"
						subject="for an item or effect"
					/>,
				)
			}
			break
		}
		case $item`Cincho de Mayo`.identifierString:
		case $item`replica Cincho de Mayo`.identifierString: {
			const cinch = 100 - clamp(get('_cinchUsed'), 0, 100)
			const restsTaken = get('_cinchoRests')
			const cinchToGain = clamp(30 - 5 * (restsTaken - 4), 5, 30)
			const freeRestsLeft = totalFreeRests() - get('timesRested')
			const cinchWasted = cinchToGain + cinch - 100
			res.desc.push(<Text>{cinch} cinch available</Text>)
			res.desc.push(
				<Text>
					{restsTaken} rests taken, will gain {cinchToGain} cinch{' '}
					{cinchWasted > 0 && `(wasting ${cinchWasted})`}
				</Text>,
			)
			res.desc.push(
				<Text>{freeRestsLeft > 0 ? freeRestsLeft : 'no'} free rests left</Text>,
			)
			res.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={item} />}
					WrappedPicker={SkillPicker}
					pickerProps={{
						skills: $skills`Cincho: Confetti Extravaganza, Cincho: Dispense Salt and Lime, Cincho: Fiesta Exit, Cincho: Party Foul, Cincho: Party Soundtrack, Cincho: Projectile Piñata`,
						header: `Use some cinch (${cinch} available)`,
					}}
					verb="use"
					subject="some cinch"
				/>,
			)
			break
		}
		case $item`Shore Inc. Ship Trip Scrip`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=shore',
				desc: "Click to drop by The Shore's Gift Shop",
			}
			break
		}
		case $item`hobo nickel`.identifierString: {
			res.currencyLink = {
				href: '/clan_hobopolis.php',
				desc: 'Click to wander on over to hobopolis',
			}
			break
		}
		case $item`Freddy Kruegerand`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=dv',
				desc: 'Click to visit The Terrified Eagle Inn',
			}
			break
		}
		case $item`Beach Buck`.identifierString: {
			res.currencyLink = {
				href: '/place.php?whichplace=airport_sleaze',
				desc: 'Click to take a trip to Spring Break Beach',
			}
			break
		}
		case $item`Coinspiracy`.identifierString: {
			res.currencyLink = {
				href: '/place.php?whichplace=airport_spooky_bunker',
				desc: 'Click to hop down the hatch to the Conspiracy Island bunker',
			}
			break
		}
		case $item`FunFunds&trade;`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=landfillstore',
				desc: 'Click to shop for some souvenirs at the Dinsey Company Store',
			}
			break
		}
		case $item`Volcoino`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=infernodisco',
				desc: 'Click to boogie right on down to Disco GiftCo',
			}
			break
		}
		case $item`Wal-Mart gift certificate`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=glaciest',
				desc: 'Click to browse the goods at Wal-Mart',
			}
			break
		}
		case $item`rad`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=mutate',
				desc: 'Click to fiddle with your genes',
			}
			break
		}
		case $item`BACON`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=bacon',
				desc: 'Born too late to explore the Earth... Born too soon to explore the galaxy... Born just in time to click to BROWSE DANK MEMES',
			}
			break
		}
		case $item`buffalo dime`.identifierString: {
			res.currencyLink = {
				href: '/place.php?whichplace=town_right&action=townright_ltt',
				desc: 'Click to visit your local LT&T Office',
			}
			break
		}
		case $item`Source essence`.identifierString: {
			const inNA = myPath() === $path`Nuclear Autumn`
			res.currencyLink = {
				href: inNA
					? '/place.php?whichplace=falloutshelter&action=vault_term'
					: '/campground.php?action=terminal',
				desc: 'Click to boot up your Source Terminal',
			}
			break
		}
		case $item`cop dollar`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=detective',
				desc: 'Click to visit the quartermaster',
			}
			break
		}
		case $item`cashew`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=thankshop',
				desc: 'Click to cash in your cashews',
			}
			break
		}
		case $item`sprinkles`.identifierString: {
			res.currencyLink = {
				href: '/place.php?whichplace=gingerbreadcity',
				desc: 'Click to take a tour of Gingerbread City',
			}
			break
		}
		case $item`Spacegate Research`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=spacegate',
				desc: 'Click to exchange your research at the Fabrication Facility',
			}
			break
		}
		case $item`X`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=xo',
				desc: 'Click to eXpend some Xes',
			}
			break
		}
		case $item`O`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=xo',
				desc: 'Click to blOw some Os',
			}
			break
		}
		case $item`Rubee&trade;`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=fantasyrealm',
				desc: 'Click to spend some Rubees&trade;',
			}
			break
		}
		case $item`stick of firewood`.identifierString: {
			res.currencyLink = {
				href: '/shop.php?whichshop=campfire',
				desc: 'Click to stop by your campfire',
			}
			break
		}
		case $item`inflammable leaf`.identifierString: {
			res.currencyLink = {
				href: '/campground.php?preaction=leaves',
				desc: 'Click to look at your pile of burning leaves',
			}
			break
		}
	}

	const inv = itemAmount(item)
	if (inv === 0 && optionals.forEquipping) {
		const clos = closetAmount(item)
		const fold = foldableAmount(item)
		const storage = storageAmount(item)
		const pulls = pullsRemaining()
		const make = creatableAmount(item)
		if (clos > 0) {
			res.equipVerb = 'uncloset'
		} else if (fold > 0) {
			res.equipVerb = 'fold'
		} else if (storage > 0 && pulls === -1) {
			res.equipVerb = 'pull'
		} else if (make > 0) {
			res.equipVerb = 'create'
			res.borderType = 'warning'
		} else if (storage > 0 && pulls > 0) {
			res.equipVerb = 'pull'
			res.borderType = 'danger'
		} else {
			res.equipVerb = 'somehow equip'
		}
	}

	res.mods = parseMods(res.mods)

	return res
}
