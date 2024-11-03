import React from 'react'
import { BorderType } from '../browser/components/Icons/ChitterIcon'
import {
	availableAmount,
	closetAmount,
	creatableAmount,
	Effect,
	equippedItem,
	getRelated,
	haveEffect,
	Item,
	itemAmount,
	Modifier,
	myBjornedFamiliar,
	myClass,
	myEnthronedFamiliar,
	myPath,
	pullsRemaining,
	storageAmount,
	toItem,
	totalFreeRests,
	weaponHands,
} from 'kolmafia'
import {
	$effects,
	$familiar,
	$item,
	$modifiers,
	$path,
	$skills,
	$slot,
	$slots,
	clamp,
	get,
	have,
} from 'libram'
import { evaluatedModifiers, parseMods } from '.'
import { getFamInfo } from './familiarHelpers'
import PickerOption from '../browser/components/Option/PickerOption'
import ItemIcon from '../browser/components/Icons/ItemIcon'
import FamiliarPicker from '../browser/components/Picker/FamiliarPicker'
import { Text } from '@chakra-ui/react'
import MainLinkOption from '../browser/components/Option/MainLinkOption'
import SkillPicker from '../browser/components/Picker/SkillPicker'
import GAPPicker from '../browser/components/Picker/GAPPicker'
import EffectListPseudoPicker from '../browser/components/Picker/EffectListPseudoPicker'
import { getEffectInfo } from './effectHelpers'

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
	const mods = isSomething ? evaluatedModifiers(item) : ''
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
		case $item`scratch 'n' sniff sword`.identifierString:
		case $item`scratch 'n' sniff crossbow`.identifierString: {
			function stickerAmount(sticker: Item) {
				return $slots`sticker1, sticker2, sticker3`.reduce(
					(acc, slot) => acc + (equippedItem(slot) === sticker ? 1 : 0),
					0,
				)
			}
			function addSticker(sticker: Item, value: number, modifiers: Modifier[]) {
				const sa = stickerAmount(sticker)
				if (sa > 0) {
					modifiers.forEach((modifier) => {
						res.mods += `, ${modifier.identifierString}: +${sa * value}`
					})
				}
			}
			addSticker(
				$item`scratch 'n' sniff unicorn sticker`,
				25,
				$modifiers`Item Drop`,
			)
			addSticker(
				$item`scratch 'n' sniff apple sticker`,
				2,
				$modifiers`Experience`,
			)
			addSticker(
				$item`scratch 'n' sniff UPC sticker`,
				25,
				$modifiers`Meat Drop`,
			)
			addSticker(
				$item`scratch 'n' sniff wrestler sticker`,
				10,
				$modifiers`Muscle Percent, Mysticality Percent, Moxie Percent`,
			)
			addSticker(
				$item`scratch 'n' sniff dragon sticker`,
				3,
				$modifiers`Hot Damage, Cold Damage, Stench Damage, Spooky Damage, Sleaze Damage`,
			)
			addSticker(
				$item`scratch 'n' sniff rock band sticker`,
				20,
				$modifiers`Weapon Damage, Spell Damage`,
			)
			res.mods += ', Breakable'
			break
		}
		case $item`The Crown of Ed the Undying`.identifierString: {
			res.mods += `, ${evaluatedModifiers(`Edpiece:${get('edPiece')}`)}`
			break
		}
		case $item`over-the-shoulder Folder Holder`.identifierString: {
			$slots`folder1, folder2, folder3, folder4, folder5`.forEach((folder) => {
				res.mods += `, ${evaluatedModifiers(equippedItem(folder))}`
			})
			break
		}
		case $item`card sleeve`.identifierString: {
			res.mods += `, ${evaluatedModifiers(equippedItem($slot`card-sleeve`))}`
			break
		}
		case $item`your cowboy boots`.identifierString: {
			$slots`bootskin, bootspur`.forEach(
				(slot) => (res.mods += `, ${evaluatedModifiers(equippedItem(slot))}`),
			)
			break
		}
		case $item`mafia thumb ring`.identifierString: {
			const thumbAdvs = get('_mafiaThumbRingAdvs')
			res.desc.push(<Text>{thumbAdvs} adv gained</Text>)
			break
		}
		case $item`bone abacus`.identifierString: {
			const victories = get('boneAbacusVictories')
			if (victories < 1000) {
				res.desc.push(<Text>{victories} / 1000 wins</Text>)
				res.borderType = 'has-drops'
			} else {
				res.desc.push(<Text>You did it!</Text>)
			}
			break
		}
		// @ts-expect-error intentional fallthrough
		case $item`Greatest American Pants`.identifierString: {
			const buffsLeft = 5 - clamp(get('_gapBuffs'), 0, 5)
			if (buffsLeft > 0) {
				res.desc.push(<Text>{buffsLeft} super powers</Text>)
				res.borderType = 'has-drops'
				res.extraOptions.push(
					<PickerOption
						icon={<ItemIcon item={item} />}
						verb="activate"
						subject="super power"
						WrappedPicker={GAPPicker}
						pickerProps={{ usesRemaining: buffsLeft }}
					/>,
				)
			}
			// intentional lack of break
		}
		// eslint-disable-next-line no-fallthrough
		case $item`navel ring of navel gazing`.identifierString: {
			const runsUsed = get('_navelRunaways')
			const freeChance =
				runsUsed < 3 ? 100 : runsUsed < 6 ? 80 : runsUsed < 9 ? 50 : 20
			res.desc.push(<Text>{freeChance}% free run chance</Text>)
			if (freeChance >= 100) {
				res.borderType = 'all-drops'
			}
			break
		}
		case $item`Daylight Shavings Helmet`.identifierString: {
			const beards = $effects`Spectacle Moustache, Toiletbrush Moustache, Barbell Moustache, Grizzly Beard, Surrealist's Moustache, Musician's Musician's Moustache, Gull-Wing Moustache, Space Warlord's Beard, Pointy Wizard Beard, Cowboy Stache, Friendly Chops`
			const beardOrder: Effect[] = []
			const classId = myClass().id
			const classIdMod = classId <= 6 ? classId : (classId + 1) % 6
			const lastBeardId = get('lastBeardBuff')
			const lastBeard = beards.find((beard) => beard.id === lastBeardId)
			const currBeard = beards.find((beard) => have(beard))
			for (let i = 0; i < 11; ++i) {
				beardOrder[i] = beards[(classIdMod * i) % 11]
			}
			const lastBeardPos = beardOrder.indexOf(
				currBeard ?? lastBeard ?? beardOrder[0],
			)
			const nextBeard = beardOrder[(lastBeardPos + 1) % 11]
			const offsetBeardOrder: Effect[] = []
			const beardOffset = currBeard ? lastBeardPos : lastBeardPos + 1
			for (let i = 0; i < 11; ++i) {
				offsetBeardOrder[i] = beardOrder[(i + beardOffset) % 11]
			}
			res.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={item} />}
					WrappedPicker={EffectListPseudoPicker}
					pickerProps={{
						header: 'Beard schedule',
						effects: offsetBeardOrder,
						enabled: (eff: Effect) => eff !== currBeard,
					}}
					verb="check"
					subject="upcoming beards"
				/>,
			)
			res.extraOptions.push(
				<MainLinkOption
					icon={<ItemIcon item={item} />}
					verb="adjust"
					subject="your facial hair"
					href="/account_facialhair.php"
				/>,
			)
			const nextBeardInfo = getEffectInfo(nextBeard)
			res.desc.push(
				<Text
					dangerouslySetInnerHTML={{
						__html: `${nextBeard.name} [${nextBeardInfo.mods}] due ${currBeard ? `in ${haveEffect(currBeard)} turns` : 'now'}`,
					}}
				/>,
			)
			if (!currBeard) {
				res.borderType = 'good'
			}
			break
		}
		case $item`Pantsgiving`.identifierString: {
			const turnsUsed = get('_pantsgivingCount')
			const fullnessGained = get('_pantsgivingFullness')
			let turnsNeeded = 5
			for (let i = 0; i < fullnessGained; ++i) {
				turnsNeeded *= 10
			}
			if (turnsUsed < turnsNeeded) {
				res.desc.push(
					<Text>
						{turnsUsed} / {turnsNeeded} towards next fullness
					</Text>,
				)
			} else {
				res.desc.push(<Text>Fullness ready!</Text>)
				res.borderType = 'good'
			}
			const crumbs = 10 - clamp(get('_pantsgivingCrumbs'), 0, 10)
			const banishes = 5 - clamp(get('_pantsgivingBanish'), 0, 5)
			if (crumbs > 0) {
				res.desc.push(<Text>{crumbs} crumbs left</Text>)
			}
			if (banishes > 0) {
				res.desc.push(<Text>{banishes} banishes left</Text>)
			}
			break
		}
		case $item`V for Vivala mask`.identifierString: {
			const advGained = get('_vmaskAdv')
			res.desc.push(<Text>{advGained} / 10 adv gained</Text>)
			if (advGained < 10) {
				res.borderType = 'has-drops'
			}
			break
		}
		case $item`mayfly bait necklace`.identifierString: {
			const fliesSummoned = clamp(get('_mayflySummons'), 0, 30)
			if (fliesSummoned < 30) {
				res.borderType = 'has-drops'
			}
			res.desc.push(<Text>{fliesSummoned} / 30 swarms summoned</Text>)
			break
		}
		// @ts-expect-error intentional fallthrough
		case $item`stinky cheese eye`.identifierString: {
			if (!get('_stinkyCheeseBanisherUsed')) {
				res.desc.push(<Text>Stink eye (banish) available</Text>)
			}
			// intentional fallthrough to get stinkiness
		}
		case $item`stinky cheese sword`.identifierString:
		case $item`stinky cheese diaper`.identifierString:
		case $item`stinky cheese wheel`.identifierString:
		case $item`Staff of Queso Escusado`.identifierString: {
			const stinkiness = get('_stinkyCheeseCount')
			if (stinkiness < 100) {
				res.desc.push(<Text>{stinkiness} / 100 stinkiness</Text>)
				res.borderType = 'has-drops'
			} else {
				res.desc.push(<Text>All stunk up</Text>)
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
