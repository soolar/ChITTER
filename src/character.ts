import { myBuffedstat } from 'kolmafia';
import { myLevel } from 'kolmafia';
import { myBasestat } from 'kolmafia';
import { myMeat } from 'kolmafia';
import { pvpAttacksLeft } from 'kolmafia';
import { myAdventures } from 'kolmafia';
import {
	fullnessLimit,
	getClanName,
	getWorkshed,
	inebrietyLimit,
	myBjornedFamiliar,
	myClass,
	myEnthronedFamiliar,
	myFullness,
	myFury,
	myHp,
	myInebriety,
	myLightning,
	myMaxfury,
	myMaxhp,
	myMaxmp,
	myMp,
	myName,
	myPath,
	myPathId,
	myRain,
	mySoulsauce,
	mySpleenUse,
	myThunder,
	spleenLimit,
} from 'kolmafia';
import { $stat } from 'libram';
import { $class, $skill, $skills, have } from 'libram';
import { BrowserClass, BrowserFamiliar, BrowserItem } from './guidelines';
import { CurrMax, FieldValue, fieldValueToJSString, StatValues } from './utils';

export interface BrowserCharacter {
	name: string;
	class: BrowserClass;
	level: number;
	clan: string;
	pathName: string;
	pathId: number;
	muscle: StatValues;
	mysticality: StatValues;
	moxie: StatValues;
	hp: CurrMax;
	mp: CurrMax;
	soulsauce: CurrMax;
	lightning: CurrMax;
	rain: CurrMax;
	thunder: CurrMax;
	fury: CurrMax;
	fullness: CurrMax;
	inebriety: CurrMax;
	spleenUse: CurrMax;
	workshedItem: BrowserItem;
	bjornFam: BrowserFamiliar;
	crownFam: BrowserFamiliar;
	meat: number;
	advs: number;
	fites: number;
}

const characterValues: [string, FieldValue][] = [
	['name', myName()],
	['class', myClass()],
	['level', myLevel()],
	['clan', getClanName()],
	['pathName', myPath()],
	['pathId', myPathId()],
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
];

export const buildCharacter = () => {
	return `\t\t\tvar my = {
${characterValues
	.filter((pair) => pair[1] !== undefined)
	.map((pair) => `\t\t\t\t${pair[0]}: ${fieldValueToJSString(pair[1])},`)
	.join('\n')}
\t\t\t}`;
};
