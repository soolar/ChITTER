import {
	myHp,
	myMaxhp,
	myMaxmp,
	myMp,
} from "kolmafia";
import {
	FieldValue,
	fieldValueToJSString,
} from './utils';

export interface BrowserCharacter {
	hp: number;
	maxhp: number;
	mp: number;
	maxmp: number;
}

const characterValues: [string, FieldValue][] = [
	["hp", myHp()],
	["maxhp", myMaxhp()],
	["mp", myMp()],
	["maxmp", myMaxmp()],
];

export const buildCharacter = () => {
	return `\t\t\tvar me = {
${characterValues.map((pair) => `\t\t\t\t${pair[0]}: ${fieldValueToJSString(pair[1])},`).join('\n')}
\t\t\t}`;
}
