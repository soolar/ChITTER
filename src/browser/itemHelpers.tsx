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
import FamiliarPicker from './components/Picker/FamiliarPicker'
import { getExtraFamInfo } from './familiarHelpers'
import GAPPicker from './components/Picker/GAPPicker'
import { $effect, $item } from './fakeLibram'

declare const mafiaProperties: BrowserMafiaProperties
declare const my: BrowserCharacter

type EquipVerb =
	| 'equip'
	| 'uncloset'
	| 'fold'
	| 'create'
	| 'pull'
	| 'somehow equip'

interface ExtraItemInfo {
	displayName: string
	desc: React.ReactNode[]
	mods: string
	extraOptions: React.ReactNode[]
	image: string
	extraClass?: string
	borderType: BorderType
	equipVerb: EquipVerb
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
		equipVerb: 'equip',
	}

	if (item === undefined) {
		return res
	}

	if (item.hands > 1) {
		res.displayName = `${res.displayName} (${item.hands}h)`
	}

	switch (item.id) {
		case $item`June cleaver`.id: {
			const fightsLeft = mafiaProperties._juneCleaverFightsLeft as number
			if (fightsLeft === 0) {
				res.desc.push(<Text>noncom now!</Text>)
				res.borderType = 'good'
			} else {
				res.desc.push(<Text>{fightsLeft} to noncom</Text>)
			}
			break
		}
		case $item`designer sweatpants`.id: {
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
		case $item`Pantsgiving`.id: {
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
		case $item`V for Vivala mask`.id: {
			const advsGainable = 10 - (mafiaProperties._vmaskAdv as number)
			if (advsGainable > 0) {
				res.desc.push(<Text>{advsGainable} adv gainable</Text>)
				res.borderType = 'has-drops'
			}
			break
		}
		case $item`mayfly bait necklace`.id: {
			const fliesLeft = 30 - (mafiaProperties._mayflySummons as number)
			if (fliesLeft > 0) {
				res.desc.push(<Text>{fliesLeft} summons left</Text>)
				res.borderType = 'has-drops'
			}
			break
		}
		// @ts-expect-error intentional fallthrough
		case $item`stinky cheese eye`.id: {
			if (!(mafiaProperties._stinkyCheeseBanisherUsed as boolean)) {
				res.desc.push(<Text>banish available</Text>)
			}
			// intentional fallthrough to automatically get stinkiness
		}
		// eslint-disable-next-line no-fallthrough
		case $item`stinky cheese sword`.id:
		case $item`stinky cheese diaper`.id:
		case $item`stinky cheese wheel`.id:
		case $item`Staff of Queso Escusado`.id: {
			const stinkiness = mafiaProperties._stinkyCheeseCount as number
			if (stinkiness < 100) {
				res.desc.push(<Text>{stinkiness}/100 stinkiness</Text>)
				res.borderType = 'has-drops'
			} else {
				res.desc.push(<Text>fully stinky</Text>)
			}
			break
		}
		case $item`Buddy Bjorn`.id: {
			if (my.bjornFam) {
				res.image = my.bjornFam.image
				res.mods += `, ${my.bjornMods}`
				const bjornInfo = getExtraFamInfo(my.bjornFam, true, true)
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
		case $item`Crown of Thrones`.id: {
			if (my.crownFam) {
				res.image = my.crownFam.image
				res.mods += `, ${my.crownMods}`
				const crownInfo = getExtraFamInfo(my.crownFam, true, true)
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
		case $item`scratch 'n' sniff sword`.id:
		case $item`scratch 'n' sniff crossbow`.id: {
			res.mods = `${my.stickerMods}, Breakable`
			break
		}
		case $item`The Crown of Ed the Undying`.id: {
			res.mods += `, ${my.edpieceMods}`
			break
		}
		case $item`card sleeve`.id: {
			res.mods += `, ${my.cardMods}`
			break
		}
		case $item`over-the-shoulder Folder Holder`.id: {
			res.mods += `, ${my.folderMods}`
			break
		}
		case $item`your cowboy boots`.id: {
			res.mods += `, ${my.bootMods}`
			break
		}
		case $item`mafia thumb ring`.id: {
			const thumbAdvs = mafiaProperties._mafiaThumbRingAdvs as number
			res.desc.push(<Text>{thumbAdvs} adv gained</Text>)
			break
		}
		case $item`Daylight Shavings Helmet`.id: {
			const beards = [
				$effect`Spectacle Moustache`,
				$effect`Toiletbrush Moustache`,
				$effect`Barbell Moustache`,
				$effect`Grizzly Beard`,
				$effect`Surrealist's Moustache`,
				$effect`Musician's Musician's Moustache`,
				$effect`Gull-Wing Moustache`,
				$effect`Space Warlord's Beard`,
				$effect`Pointy Wizard Beard`,
				$effect`Cowboy Stache`,
				$effect`Friendly Chops`,
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
		case $item`bone abacus`.id: {
			const victories = mafiaProperties.boneAbacusVictories as number
			if (victories < 1000) {
				res.desc.push(<Text>{victories}/1000 wins</Text>)
				res.borderType = 'has-drops'
			} else {
				res.desc.push(<Text>You did it!</Text>)
			}
			break
		}
		// @ts-expect-error intentional fallthrough
		case $item`navel ring of navel gazing`.id: {
			res.displayName = 'navel ring'
			// intentional fallthrough to automatically get stinkiness
		}
		// eslint-disable-next-line no-fallthrough
		case $item`Greatest American Pants`.id: {
			const runsUsed = mafiaProperties._navelRunaways as number
			const freeChance =
				runsUsed < 3 ? 100 : runsUsed < 6 ? 80 : runsUsed < 9 ? 50 : 20
			res.desc.push(<Text>{freeChance}% free run</Text>)
			if (runsUsed < 3) {
				res.borderType = 'has-drops'
			}
			if (item.name.toLowerCase() === 'greatest american pants') {
				const buffsUsed = mafiaProperties._gapBuffs as number
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

	if (item.inInventory === 0) {
		if (item.inCloset > 0) {
			res.equipVerb = 'uncloset'
		} else if (item.foldable > 0) {
			res.equipVerb = 'fold'
		} else if (item.inStorage > 0 && my.pulls === -1) {
			res.equipVerb = 'pull'
		} else if (item.creatable > 0) {
			res.equipVerb = 'create'
			res.borderType = 'warning'
		} else if (item.inStorage > 0 && my.pulls > 0) {
			res.equipVerb = 'pull'
			res.borderType = 'danger'
		} else {
			res.equipVerb = 'somehow equip'
		}
	}

	res.mods = parseMods(res.mods)

	return res
}
