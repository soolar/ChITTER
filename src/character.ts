import {
	fullnessLimit,
	getClanName,
	getWorkshed,
	inebrietyLimit,
	myClass,
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
import { $class, $skill, $skills, have } from 'libram';
import { BrowserClass, BrowserItem } from './guidelines';
import { CurrMax, FieldValue, fieldValueToJSString } from './utils';

export interface BrowserCharacter {
	name: string;
	class: BrowserClass;
	clan: string;
	pathName: string;
	pathId: number;
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
}

const characterValues: [string, FieldValue][] = [
	['name', myName()],
	['class', myClass()],
	['clan', getClanName()],
	['pathName', myPath()],
	['pathId', myPathId()],
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
];

export const buildCharacter = () => {
	return `\t\t\tvar my = {
${characterValues
	.map((pair) => `\t\t\t\t${pair[0]}: ${fieldValueToJSString(pair[1])},`)
	.join('\n')}
\t\t\t}`;
};
