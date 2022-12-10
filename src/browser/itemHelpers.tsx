import * as React from 'react'
import { BrowserEffect, BrowserItem, BrowserList } from '../guidelines'
import { BrowserMafiaProperties } from '../properties'
import { Text } from '@chakra-ui/react'
import SweatpantsPicker from './components/Picker/SweatpantsPicker'
import { BorderType } from './components/Icons/ChitterIcon'
import PickerOption from './components/Option/PickerOption'
import ItemIcon from './components/Icons/ItemIcon'
import { BrowserCharacter } from '../character'
import { parseMods } from '../utils'
import EffectListPseudoPicker from './components/Picker/EffectListPseudoPicker'
import LinkOption from './components/Option/LinkOption'

declare const mafiaProperties: BrowserMafiaProperties
declare const my: BrowserCharacter
declare const effects: BrowserList<BrowserEffect>

interface ExtraItemInfo {
	displayName: string
	desc: React.ReactNode[]
	mods: string
	extraOptions: React.ReactNode[]
	image: string
	extraClass?: string
	borderType: BorderType
}

interface GetExtraItemInfoOptionalArgs {
	namePrefix?: string
	iconOverride?: string
}

export function getExtraItemInfo(
	item?: BrowserItem,
	optionals: GetExtraItemInfoOptionalArgs = {}
): ExtraItemInfo {
	const name = item ? item.name : 'empty'
	const res: ExtraItemInfo = {
		displayName: optionals.namePrefix ? `${optionals.namePrefix}${name}` : name,
		desc: [],
		mods: item?.mods || '',
		extraOptions: [],
		image: optionals.iconOverride || (item ? item.image : 'blank.gif'),
		borderType: 'normal',
	}

	if (item === undefined) {
		return res
	}

	switch (item.name.toLowerCase()) {
		case 'june cleaver': {
			const fightsLeft = mafiaProperties._juneCleaverFightsLeft as number
			if (fightsLeft === 0) {
				res.desc.push(<Text>noncom now!</Text>)
				res.borderType = 'good'
			} else {
				res.desc.push(<Text>{fightsLeft} to noncom</Text>)
			}
			break
		}
		case 'designer sweatpants': {
			const sweat = Math.max(Math.min(100, mafiaProperties.sweat as number), 0)
			const sweatBoozeLeft =
				3 - (mafiaProperties._sweatOutSomeBoozeUsed as number)
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
			break
		}
		case 'pantsgiving': {
			const crumbs = 10 - (mafiaProperties._pantsgivingCrumbs as number)
			const banishes = 5 - (mafiaProperties._pantsgivingBanish as number)
			if (crumbs > 0) {
				res.desc.push(<Text>{crumbs} crumbs left</Text>)
			}
			if (banishes > 0) {
				res.desc.push(<Text>{banishes} banishes</Text>)
			}
			break
		}
		case 'v for vivala mask': {
			const advsGainable = 10 - (mafiaProperties._vmaskAdv as number)
			if (advsGainable > 0) {
				res.desc.push(<Text>{advsGainable} adv gainable</Text>)
				res.borderType = 'has-drops'
			}
			break
		}
		case 'mayfly bait necklace': {
			const fliesLeft = 30 - (mafiaProperties._mayflySummons as number)
			if (fliesLeft > 0) {
				res.desc.push(<Text>{fliesLeft} summons left</Text>)
				res.borderType = 'has-drops'
			}
			break
		}
		// @ts-expect-error intentional fallthrough
		case 'stinky cheese eye': {
			if (!(mafiaProperties._stinkyCheeseBanisherUsed as boolean)) {
				res.desc.push(<Text>banish available</Text>)
			}
			// intentional fallthrough to automatically get stinkiness
		}
		// eslint-disable-next-line no-fallthrough
		case 'stinky cheese sword':
		case 'stinky cheese diaper':
		case 'stinky cheese wheel':
		case 'staff of queso escusado': {
			const stinkiness = mafiaProperties._stinkyCheeseCount as number
			if (stinkiness < 100) {
				res.desc.push(<Text>{stinkiness}/100 stinkiness</Text>)
				res.borderType = 'has-drops'
			} else {
				res.desc.push(<Text>fully stinky</Text>)
			}
			break
		}
		case 'buddy bjorn': {
			if (my.bjornFam) {
				res.image = my.bjornFam.image
				res.mods += `, ${my.bjornMods}`
			}
			break
		}
		case 'crown of thrones': {
			if (my.crownFam) {
				res.image = my.crownFam.image
				res.mods += `, ${my.crownMods}`
			}
			break
		}
		case "scratch 'n' sniff sword":
		case "scratch 'n' sniff crossbow": {
			res.mods = `${my.stickerMods}, Breakable`
			break
		}
		case 'the crown of ed the undying': {
			res.mods += `, ${my.edpieceMods}`
			break
		}
		case 'card sleeve': {
			res.mods += `, ${my.cardMods}`
			break
		}
		case 'over-the-shoulder folder holder': {
			res.mods += `, ${my.folderMods}`
			break
		}
		case 'your cowboy boots': {
			res.mods += `, ${my.bootMods}`
			break
		}
		case 'mafia thumb ring': {
			const thumbAdvs = mafiaProperties._mafiaThumbRingAdvs as number
			res.desc.push(<Text>{thumbAdvs} adv gained</Text>)
			break
		}
		case 'daylight shavings helmet': {
			const beards = [
				effects.byName['spectacle moustache'],
				effects.byName['toiletbrush moustache'],
				effects.byName['barbell moustache'],
				effects.byName['grizzly beard'],
				effects.byName["surrealist's moustache"],
				effects.byName["musician's musician's moustache"],
				effects.byName['gull-wing moustache'],
				effects.byName["space warlord's beard"],
				effects.byName['pointy wizard beard'],
				effects.byName['cowboy stache'],
				effects.byName['friendly chops'],
			]
			const beardOrder: BrowserEffect[] = []
			const classId = my.class.id
			const classIdMod = (classId <= 6 ? classId : classId + 1) % 6
			const lastBeardId = mafiaProperties.lastBeardBuff as number
			const lastBeard = beards.find((beard) => beard.id === lastBeardId)
			const currBeard = beards.find((beard) => beard.turnsActive > 0)
			const beardOffset = currBeard
				? beards.indexOf(currBeard)
				: lastBeard
				? beards.indexOf(lastBeard) + 1
				: 1
			for (let i = 0; i < 11; ++i) {
				beardOrder[i] = beards[(classIdMod * i + beardOffset) % 11]
			}
			const nextBeard = beardOrder[currBeard ? 1 : 0]
			res.extraOptions.push(
				<PickerOption
					icon={<ItemIcon item={item} />}
					WrappedPicker={EffectListPseudoPicker}
					pickerProps={{
						effects: beardOrder,
						enabled: (eff: BrowserEffect) => eff !== currBeard,
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
						__html: `${nextBeard.name} [${parseMods(nextBeard.mods)}] due ${
							currBeard ? `in ${currBeard.turnsActive} turns` : 'now'
						}`,
					}}
				/>
			)
			if (!currBeard) {
				res.borderType = 'good'
			}
			break
		}
	}

	res.mods = parseMods(res.mods)

	return res
}
