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
import { BrowserClass, BrowserItem } from './guidelines';
import { FieldValue, fieldValueToJSString } from './utils';

export interface BrowserCharacter {
	name: string;
	class: BrowserClass;
	clan: string;
	pathName: string;
	pathId: number;
	hp: number;
	maxHp: number;
	mp: number;
	maxMp: number;
	soulsauce: number;
	lightning: number;
	rain: number;
	thunder: number;
	fury: number;
	maxFury: number;
	fullness: number;
	maxFullness: number;
	inebriety: number;
	maxInebriety: number;
	spleenUse: number;
	maxSpleenUse: number;
	workshedItem: BrowserItem;
}

const characterValues: [string, FieldValue][] = [
	['name', myName()],
	['class', myClass()],
	['clan', getClanName()],
	['pathName', myPath()],
	['pathId', myPathId()],
	['hp', myHp()],
	['maxHp', myMaxhp()],
	['mp', myMp()],
	['maxMp', myMaxmp()],
	['soulsauce', mySoulsauce()],
	['lightning', myLightning()],
	['rain', myRain()],
	['thunder', myThunder()],
	['fury', myFury()],
	['maxFury', myMaxfury()],
	['fullness', myFullness()],
	['maxFullness', fullnessLimit()],
	['inebriety', myInebriety()],
	['maxInebriety', inebrietyLimit()],
	['spleenUse', mySpleenUse()],
	['maxSpleenUse', spleenLimit()],
	['workshedItem', getWorkshed()],
];

export const buildCharacter = () => {
	return `\t\t\tvar me = {
${characterValues
	.map((pair) => `\t\t\t\t${pair[0]}: ${fieldValueToJSString(pair[1])},`)
	.join('\n')}
\t\t\t}`;
};
