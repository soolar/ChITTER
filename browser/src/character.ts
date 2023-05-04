import {
	equippedItem,
	fullnessLimit,
	getClanName,
	getWorkshed,
	inebrietyLimit,
	Item,
	myAdventures,
	myBasestat,
	myBjornedFamiliar,
	myBuffedstat,
	myClass,
	myEnthronedFamiliar,
	myFullness,
	myFury,
	myHash,
	myHp,
	myInebriety,
	myLevel,
	myLightning,
	myMaxfury,
	myMaxhp,
	myMaxmp,
	myMeat,
	myMp,
	myName,
	myPath,
	myRain,
	mySoulsauce,
	mySpleenUse,
	myThunder,
	pullsRemaining,
	pvpAttacksLeft,
	spleenLimit,
	stringModifier,
} from 'kolmafia'
import {
	$class,
	$item,
	$skill,
	$skills,
	$slot,
	$slots,
	$stat,
	get,
	have,
} from 'libram'
import { BrowserClass, BrowserFamiliar, BrowserItem } from './guidelines'
import { CurrMax, StatValues } from './utils'
import { FieldValue, fieldValueToJSString } from './fieldValue'

export interface BrowserCharacter {
	name: string
	class: BrowserClass
	level: number
	clan: string
	pathName: string
	pathId: number
	muscle: StatValues
	mysticality: StatValues
	moxie: StatValues
	hp: CurrMax
	mp: CurrMax
	soulsauce: CurrMax
	lightning: CurrMax
	rain: CurrMax
	thunder: CurrMax
	fury: CurrMax
	fullness: CurrMax
	inebriety: CurrMax
	spleenUse: CurrMax
	workshedItem: BrowserItem
	bjornFam: BrowserFamiliar
	crownFam: BrowserFamiliar
	meat: number
	advs: number
	fites: number
	hash: string
	pulls: number

	bjornMods: string
	crownMods: string
	edpieceMods: string
	folderMods: string
	stickerMods: string
	cardMods: string
	bootMods: string
}

function evaluatedModifiers(type: string) {
	return stringModifier(type, 'Evaluated Modifiers')
}

interface StickerDetails {
	amount: number
	value: number
	pre?: string
	post?: string
}

function stickerMods() {
	const stickerAmount = (sticker: Item) =>
		$slots`sticker1, sticker2, sticker3`.reduce(
			(acc, slot) => acc + (equippedItem(slot) === sticker ? 1 : 0),
			0
		)
	const stickers: StickerDetails[] = [
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

	return stickers
		.filter((sticker) => sticker.amount > 0)
		.map(
			(sticker) =>
				`${sticker.pre || ''}${sticker.amount * sticker.value}${
					sticker.post || ''
				}`
		)
		.join(', ')
}

const characterValues: [string, FieldValue][] = [
	['name', myName()],
	['class', myClass()],
	['level', myLevel()],
	['clan', getClanName()],
	['pathName', myPath().name],
	['pathId', myPath().id],
	[
		'muscle',
		{
			base: myBasestat($stat`muscle`),
			buffed: myBuffedstat($stat`muscle`),
			substats: myBasestat($stat`submuscle`),
		},
	],
	[
		'mysticality',
		{
			base: myBasestat($stat`mysticality`),
			buffed: myBuffedstat($stat`mysticality`),
			substats: myBasestat($stat`submysticality`),
		},
	],
	[
		'moxie',
		{
			base: myBasestat($stat`moxie`),
			buffed: myBuffedstat($stat`moxie`),
			substats: myBasestat($stat`submoxie`),
		},
	],
	['hp', { curr: myHp(), max: myMaxhp() }],
	['mp', { curr: myMp(), max: myMaxmp() }],
	[
		'soulsauce',
		{
			curr: mySoulsauce(),
			max:
				myClass() === $class`Sauceror` && have($skill`Soul Saucery`) ? 100 : 0,
		},
	],
	[
		'lightning',
		{
			curr: myLightning(),
			max: $skills`Lightning Strike, Clean-Hair Lightning, Ball Lightning, Sheet Lightning, Lightning Bolt, Lightning Rod, Riding the Lightning`.some(
				have
			)
				? 100
				: 0,
		},
	],
	[
		'rain',
		{
			curr: myRain(),
			max: $skills`Rain Man, Rainy Day, Make it Rain, Rain Dance, Rainbow, Rain Coat, Rain Delay`.some(
				have
			)
				? 100
				: 0,
		},
	],
	[
		'thunder',
		{
			curr: myThunder(),
			max: $skills`Thunder Clap, Thundercloud, Thunder Bird, Thunderheart, Thunderstrike, Thunder Down Underwear, Thunder Thighs`.some(
				have
			)
				? 100
				: 0,
		},
	],
	['fury', { curr: myFury(), max: myMaxfury() }],
	['fullness', { curr: myFullness(), max: fullnessLimit() }],
	['inebriety', { curr: myInebriety(), max: inebrietyLimit() }],
	['spleenUse', { curr: mySpleenUse(), max: spleenLimit() }],
	['workshedItem', getWorkshed()],
	['bjornFam', myBjornedFamiliar()],
	['crownFam', myEnthronedFamiliar()],
	['meat', myMeat()],
	['advs', myAdventures()],
	['fites', pvpAttacksLeft()],
	['hash', myHash()],
	['pulls', pullsRemaining()],

	['bjornMods', evaluatedModifiers(`Throne:${myBjornedFamiliar()}`)],
	['crownMods', evaluatedModifiers(`Throne:${myEnthronedFamiliar()}`)],
	['edpieceMods', evaluatedModifiers(`Edpiece:${get('edPiece')}`)],
	[
		'folderMods',
		`${evaluatedModifiers(
			`Item:${equippedItem($slot`folder1`)}`
		)}, ${evaluatedModifiers(
			`Item:${equippedItem($slot`folder2`)}`
		)}, ${evaluatedModifiers(
			`Item:${equippedItem($slot`folder3`)}`
		)}, ${evaluatedModifiers(
			`Item:${equippedItem($slot`folder4`)}`
		)}, ${evaluatedModifiers(`Item:${equippedItem($slot`folder5`)}`)}`,
	],
	['stickerMods', stickerMods()],
	['cardMods', evaluatedModifiers(`Item:${equippedItem($slot`card-sleeve`)}`)],
	[
		'bootMods',
		`${evaluatedModifiers(
			`Item:${equippedItem($slot`bootskin`)}`
		)}, ${evaluatedModifiers(`Item:${equippedItem($slot`bootspur`)}`)}`,
	],
]

export const buildCharacter = () => {
	return `\t\t\tvar my = {
${characterValues
	.filter((pair) => pair[1] !== undefined)
	.map((pair) => `\t\t\t\t${pair[0]}: ${fieldValueToJSString(pair[1])},`)
	.join('\n')}
\t\t\t}`
}
