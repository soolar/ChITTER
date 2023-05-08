import * as React from 'react'
import { Text } from '@chakra-ui/react'
import SweatpantsPicker from './components/Picker/SweatpantsPicker'
import { BorderType } from './components/Icons/ChitterIcon'
import PickerOption from './components/Option/PickerOption'
import ItemIcon from './components/Icons/ItemIcon'
import { parseMods } from './utils'
import EffectListPseudoPicker from './components/Picker/EffectListPseudoPicker'
import LinkOption from './components/Option/LinkOption'
import FamiliarPicker from './components/Picker/FamiliarPicker'
import { useExtraFamInfo } from './familiarHelpers'
import GAPPicker from './components/Picker/GAPPicker'
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
	myBjornedFamiliar,
	myClass,
	myEnthronedFamiliar,
	pullsRemaining,
	storageAmount,
	stringModifier,
	toEffect,
	toInt,
	toItem,
	toString,
	weaponHands,
} from 'kolmafia'
import { $item, get } from 'libram'

type EquipVerb =
	| 'equip'
	| 'uncloset'
	| 'fold'
	| 'create'
	| 'pull'
	| 'somehow equip'

interface ExtraItemInfo {
	item?: Item
	displayName: string
	desc: React.ReactNode[]
	mods: string
	rawMods: string
	extraOptions: React.ReactNode[]
	image: string
	extraClass?: string
	borderType: BorderType
	equipVerb: EquipVerb
}

interface UseExtraItemInfoOptionalArgs {
	namePrefix?: string
	iconOverride?: string
	forEquipping?: boolean
}

export function useExtraItemInfo(
	item: Item,
	optionals: UseExtraItemInfoOptionalArgs = {}
): ExtraItemInfo {
	const mods = stringModifier(item, 'Evaluated Modifiers')
	const name = toString(item as unknown as string)
	const hands = weaponHands(item)
	const foldableAltNames = Object.keys(getRelated(item, 'fold'))
	const foldableAlts = foldableAltNames
		? foldableAltNames
				.filter((foldableName) => foldableName !== name)
				.map((foldableName) => toItem(foldableName))
		: []
	const foldableAltAmounts = foldableAlts.map((foldable) =>
		availableAmount(foldable)
	)
	const foldableAmount = foldableAltAmounts.reduce((acc, amt) => acc + amt, 0)
	const res: ExtraItemInfo = {
		item,
		displayName: optionals.namePrefix
			? `${optionals.namePrefix}${name}`
			: name.toString(),
		desc: [],
		mods: mods ?? '',
		rawMods: mods ?? '',
		extraOptions: [],
		image: optionals.iconOverride || (item ? item.image : 'blank.gif'),
		borderType: 'normal',
		equipVerb: 'equip',
	}

	if (item === undefined) {
		return res
	}

	if (hands && hands > 1) {
		res.displayName = `${res.displayName} (${hands}h)`
	}

	switch (item) {
		case $item`June cleaver`: {
			/*
			const fightsLeft = get('_juneCleaverFightsLeft')
			if (fightsLeft === 0) {
				res.desc.push(<Text>noncom now!</Text>)
				res.borderType = 'good'
			} else {
				res.desc.push(<Text>{fightsLeft} to noncom</Text>)
			}
			*/
			break
		}
		case $item`designer sweatpants`: {
			/*
			const rawSweat = get('sweat')
			const sweat = Math.max(Math.min(100, rawSweat), 0)
			const sweatBoozeUsed = get('_sweatOutSomeBoozeUsed')
			const sweatBoozeLeft = 3 - sweatBoozeUsed
			res.desc.push(<Text>{sweat}% sweaty</Text>)
			if (sweatBoozeLeft > 0) {
				res.desc.push(<Text>{sweatBoozeLeft} booze sweats</Text>)
			}
			res.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={item} />}
					WrappedPicker={SweatpantsPicker}
					pickerProps={{}}
					verb="use"
					subject="some sweat"
				/>
			)
			*/
			break
		}
		case $item`Pantsgiving`: {
			const crumbsFound = get('_pantsgivingCrumbs')
			const crumbs = 10 - crumbsFound
			const banishesUsed = get('_pantsgivingBanish')
			const banishes = 5 - banishesUsed
			if (crumbs > 0) {
				res.desc.push(<Text>{crumbs} crumbs left</Text>)
			}
			if (banishes > 0) {
				res.desc.push(<Text>{banishes} banishes</Text>)
			}
			break
		}
		case $item`V for Vivala mask`: {
			const advsGained = get('_vmaskAdv')
			const advsGainable = 10 - advsGained
			if (advsGainable > 0) {
				res.desc.push(<Text>{advsGainable} adv gainable</Text>)
				res.borderType = 'has-drops'
			}
			break
		}
		case $item`mayfly bait necklace`: {
			const fliesUsed = get('_mayflySummons')
			const fliesLeft = 30 - fliesUsed
			if (fliesLeft > 0) {
				res.desc.push(<Text>{fliesLeft} summons left</Text>)
				res.borderType = 'has-drops'
			}
			break
		}
		// @ts-expect-error intentional fallthrough
		case $item`stinky cheese eye`: {
			const usedBanish = get('_stinkyCheeseBanisherUsed')
			if (!usedBanish) {
				res.desc.push(<Text>banish available</Text>)
			}
			// intentional fallthrough to automatically get stinkiness
		}
		// eslint-disable-next-line no-fallthrough
		case $item`stinky cheese sword`:
		case $item`stinky cheese diaper`:
		case $item`stinky cheese wheel`:
		case $item`Staff of Queso Escusado`: {
			const stinkiness = get('_stinkyCheeseCount')
			if (stinkiness < 100) {
				res.desc.push(<Text>{stinkiness}/100 stinkiness</Text>)
				res.borderType = 'has-drops'
			} else {
				res.desc.push(<Text>fully stinky</Text>)
			}
			break
		}
		case $item`Buddy Bjorn`: {
			const bjornFam = myBjornedFamiliar()
			const bjornMods = stringModifier(
				`Throne:${bjornFam?.name}`,
				'Evaluated Modifiers'
			)
			const bjornInfo = useExtraFamInfo(bjornFam, true, true)
			if (bjornFam) {
				res.image = bjornFam.image
				res.mods += `, ${parseMods(bjornMods ?? '')}`
				res.desc.push(...bjornInfo.desc)
			}
			res.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={item} />}
					WrappedPicker={FamiliarPicker}
					pickerProps={{ type: 'bjorn' }}
					verb="pick"
					subject="a rider"
				/>
			)
			break
		}
		case $item`Crown of Thrones`: {
			const crownFam = myEnthronedFamiliar()
			const crownMods = stringModifier(
				`Throne:${crownFam?.name}`,
				'Evaluated Modifiers'
			)
			const crownInfo = useExtraFamInfo(crownFam, true, true)
			if (crownFam) {
				res.image = crownFam.image
				res.mods += `, ${parseMods(crownMods ?? '')}`
				res.desc.push(...crownInfo.desc)
			}
			res.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={item} />}
					WrappedPicker={FamiliarPicker}
					pickerProps={{ type: 'crown' }}
					verb="pick"
					subject="a rider"
				/>
			)
			break
		}
		/*
		case $item`scratch 'n' sniff sword`:
		case $item`scratch 'n' sniff crossbow`: {
			const stickers = $slots`sticker1, sticker2, sticker3`.map((slot) =>
				equippedItem(slot)
			)
			const stickerAmount = (checkSticker: Item) =>
				stickers.reduce(
					(acc, eqSticker) => acc + (checkSticker === eqSticker ? 1 : 0),
					0
				)
			const stickerInfo: {
				amount: number
				value: number
				pre?: string
				post?: string
			}[] = [
				{
					amount: stickerAmount($item`scratch 'n' sniff unicorn sticker`),
					value: 25,
					pre: 'Item +',
				},
				{
					amount: stickerAmount($item`scratch 'n' sniff apple sticker`),
					value: 2,
					pre: '+',
					post: ' exp',
				},
				{
					amount: stickerAmount($item`scratch 'n' sniff UPC sticker`),
					value: 25,
					pre: 'Meat +',
				},
				{
					amount: stickerAmount($item`scratch 'n' sniff wrestler sticker`),
					value: 10,
					pre: 'Stats +',
					post: '%',
				},
				{
					amount: stickerAmount($item`scratch 'n' sniff dragon sticker`),
					value: 3,
					pre: 'Prismatic Dmg +',
				},
				{
					amount: stickerAmount($item`scratch 'n' sniff rock band sticker`),
					value: 20,
					pre: 'All Dmg +',
				},
			]
			const stickerMods = stickerInfo
				.filter((sticker) => sticker.amount > 0)
				.map(
					(sticker) =>
						`${sticker.pre ?? ''}${sticker.amount * sticker.value}${
							sticker.post ?? ''
						}`
				)
				.join(', ')
			if (stickerMods !== '') {
				res.mods = `${stickerMods}, Breakable`
			}
			break
		}
		case $item`The Crown of Ed the Undying`: {
			const currDecor = getProperty('edPiece')
			const decorMods = stringModifier(
				`Edpiece:${currDecor}`,
				'Evaluated Modifiers'
			)
			if (decorMods !== '') {
				res.mods += `, ${decorMods}`
			}
			break
		}
		case $item`card sleeve`: {
			const currCard = equippedItem($slot`card-sleeve`)
			const cardMods = stringModifier(
				currCard ?? $item`none`,
				'Evaluated Modifiers'
			)
			res.mods += `, ${cardMods}`
			break
		}
		case $item`over-the-shoulder Folder Holder`: {
			const folderSlots = $slots`folder1, folder2, folder3, folder4, folder5`
			const equippedFolders = folderSlots.map((folderSlot) =>
				equippedItem(folderSlot)
			)
			const folderMods = equippedFolders.map((folder) =>
				stringModifier(folder ?? $item`none`, 'Evaluated Modifiers')
			)
			const nonEmptyMods = folderMods.filter((mod) => mod !== '')
			res.mods = [res.mods, ...nonEmptyMods].join(', ')
			break
		}
		case $item`your cowboy boots`: {
			const bootSlots = $slots`bootskin, bootspur`
			const equippedBootery = bootSlots.map((bootSlot) =>
				equippedItem(bootSlot)
			)
			const booteryMods = equippedBootery.map((bootery) =>
				stringModifier(bootery, 'Evaluated Modifiers')
			)
			const nonEmptyMods = booteryMods.filter((mod) => mod !== '')
			res.mods = [res.mods, ...nonEmptyMods].join(', ')
			break
		}
		*/
		case $item`mafia thumb ring`: {
			const thumbAdvs = get('_mafiaThumbRingAdvs')
			res.desc.push(<Text>{thumbAdvs} adv gained</Text>)
			break
		}
		/*
		case $item`Daylight Shavings Helmet`: {
			const lastBeardId = get('lastBeardBuff')
			const lastBeard = toEffect(lastBeardId)
			const beards = $effects`Spectacle Moustache, Toiletbrush Moustache, Barbell Moustache, Grizzly Beard, Surrealist's Moustache, Musician's Musician's Moustache, Gull-Wing Moustache, Space Warlord's Beard, Pointy Wizard Beard, Cowboy Stache, Friendly Chops`
			const currBeard = beards.find((beard) => have(beard))
			const beardOrder: Effect[] = []
			const classId = toInt(myClass())
			const classIdMod = (classId <= 6 ? classId : classId + 1) % 6
			const turnsOfCurrBeard = haveEffect(currBeard ?? toEffect(`none`))
			const beardOffset = currBeard
				? beards.indexOf(currBeard)
				: lastBeard
				? beards.indexOf(lastBeard) + 1
				: 1
			for (let i = 0; i < 11; ++i) {
				beardOrder[i] = beards[(classIdMod * i + beardOffset) % 11]
			}
			const nextBeard = beardOrder[currBeard ? 1 : 0]
			const nextBeardRawMods = stringModifier(nextBeard, 'Evaluated Modifiers')
			res.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={item} />}
					WrappedPicker={EffectListPseudoPicker}
					pickerProps={{
						effects: beardOrder,
						enabled: (eff: Effect) => eff !== currBeard,
					}}
					verb="check"
					subject="upcoming beards"
				/>
			)
			res.extraOptions.push(
				<LinkOption
					icon={<ItemIcon item={item} />}
					verb="adjust"
					subject="your facial hair"
					link="/account_facialhair.php"
				/>
			)
			res.desc.push(
				<Text
					dangerouslySetInnerHTML={{
						__html: `${nextBeard.toString()} [${parseMods(
							nextBeardRawMods
						)}] due ${currBeard ? `in ${turnsOfCurrBeard ?? 0} turns` : 'now'}`,
					}}
				/>
			)
			if (!currBeard) {
				res.borderType = 'good'
			}
			break
		}
		*/
		case $item`bone abacus`: {
			const victories = get('boneAbacusVictories')
			if (victories < 1000) {
				res.desc.push(<Text>{victories}/1000 wins</Text>)
				res.borderType = 'has-drops'
			} else {
				res.desc.push(<Text>You did it!</Text>)
			}
			break
		}
		// @ts-expect-error intentional fallthrough
		case $item`navel ring of navel gazing`: {
			res.displayName = 'navel ring'
			// intentional fallthrough to automatically get stinkiness
		}
		// eslint-disable-next-line no-fallthrough
		case $item`Greatest American Pants`: {
			const runsUsed = get('_navelRunaways')
			const freeChance =
				runsUsed < 3 ? 100 : runsUsed < 6 ? 80 : runsUsed < 9 ? 50 : 20
			res.desc.push(<Text>{freeChance}% free run</Text>)
			if (runsUsed < 3) {
				res.borderType = 'has-drops'
			}
			if (item.name.toLowerCase() === 'greatest american pants') {
				const buffsUsed = get('_gapBuffs')
				if (buffsUsed < 5) {
					res.desc.push(<Text>{5 - buffsUsed} super powers</Text>)
					res.borderType = 'has-drops'
					res.extraOptions.push(
						<PickerOption
							icon={<ItemIcon item={item} />}
							verb="activate"
							subject="super power"
							WrappedPicker={GAPPicker}
							pickerProps={{ usesRemaining: 5 - buffsUsed }}
						/>
					)
				}
			}
			break
		}
	}

	if (itemAmount(item) === 0 && optionals.forEquipping) {
		if (closetAmount(item) > 0) {
			res.equipVerb = 'uncloset'
		} else if (foldableAmount > 0) {
			res.equipVerb = 'fold'
		} else if (storageAmount(item) > 0 && pullsRemaining() === -1) {
			res.equipVerb = 'pull'
		} else if (creatableAmount(item) > 0) {
			res.equipVerb = 'create'
			res.borderType = 'warning'
		} else if (storageAmount(item) > 0 && pullsRemaining() > 0) {
			res.equipVerb = 'pull'
			res.borderType = 'danger'
		} else {
			res.equipVerb = 'somehow equip'
		}
	}

	res.mods = parseMods(res.mods)

	return res
}
