import {
	advCost,
	closetAmount,
	familiarWeight,
	favoriteFamiliars,
	fuelCost,
	getProperty,
	haveEffect,
	haveFamiliar,
	haveSkill,
	hpCost,
	isUnrestricted,
	itemAmount,
	lightningCost,
	MafiaClass,
	mpCost,
	rainCost,
	soulsauceCost,
	storageAmount,
	thunderCost,
	toInt,
} from 'kolmafia';
import {
	$effects,
	$familiars,
	$items,
	$skills,
	$thralls,
} from 'libram';

type FieldValue = string | number | boolean | null | Item | Skill;
type FieldData<T> = ([string, ((thing: T) => FieldValue)]) | string;

export const fieldValueToString = (value: FieldValue) => {
	if(value === null) {
		return 'null';
	}
	if(typeof value === "boolean" || typeof value === "number") {
		return value.toString();
	}
	if(typeof value === "string") {
		return `"${value}"`;
	}
	if(value instanceof Item) {
		return `items["${value.toString()}"]`;
	}
	if(value instanceof Skill) {
		return `skills["${value.toString()}"]`;
	}
	return 'undefined';
}

interface Guidelines<T extends MafiaClass> {
	name: string;
	all: T[];
	fields: FieldData<T>[];
	favorites?: T[];
	active?: T[];
}

// maybe some day I'll figure out a way to do this without any, maybe not...
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildStringFromGuidelines = <T extends { [key: string]: any }>(guidelines: Guidelines<T>) => {
	const res = [`\t\t\tvar ${guidelines.name} = {\n\t\t\t\tbyName: {\n`];
	res.push(...guidelines.all.map((thing) => {
		const res = [`\t\t\t\t\t"${thing.toString()}": {`]
		res.push(guidelines.fields.map((fieldData) => {
			const fieldName = (typeof fieldData === "string") ? fieldData : fieldData[0];
			const fieldValue: FieldValue = (typeof fieldData === "string") ? thing[fieldData] : fieldData[1](thing);
			return `${fieldName}: ${fieldValueToString(fieldValue)}`;
		}).join(', '));
		res.push('},\n');
		return res.join('');
	}));
	res.push('\t\t\t\t}\n\t\t\t};\n');
	const addList = (list: T[], listName: string) => {
		res.push(`\t\t\t${guidelines.name}.${listName} = [\n${list.map((thing) => `\t\t\t\t${guidelines.name}.byName["${thing.toString()}"]`).join(',\n')}\n\t\t\t];\n`);
	}
	addList(guidelines.all, "all");
	if(guidelines.favorites) {
		addList(guidelines.favorites, "favorites");
	}
	if(guidelines.active) {
		addList(guidelines.active, "active");
	}
	return res.join('');
};

interface BrowserList<T> {
	all: T[];
	favorites?: T[];
	active?: T[];
	byName: { [key: string]: T; }
}

// BEGIN ACTUAL GUIDELINES

interface BrowserItem {
	name: string;
	default: string;
	image: string;
	id: number;
	descid: string;
	quality: string;
	song: boolean;
	turnsActive: number;
}

export declare const effects: BrowserList<BrowserItem>;

export const effectGuidelines: Guidelines<Effect> = {
	name: "effects",
	all: $effects``,
	fields: [
		"name",
		["default", (eff) => encodeURI(eff.default)],
		"image",
		["id", (eff) => toInt(eff)],
		"descid",
		"quality",
		"song",
		["turnsActive", (eff) => haveEffect(eff)],
	],
	active: $effects``.filter((eff) => haveEffect(eff) !== 0),
};

export const familiarGuidelines: Guidelines<Familiar> = {
	name: "familiars",
	all: $familiars``,
	fields: [
		["type", (fam) => fam.toString()],
		"image",
		["id", (fam) => toInt(fam)],
		"name",
		"experience",
		["weight", (fam) => familiarWeight(fam)],
		["drop", (fam) => fam.dropItem],
		"dropsLimit",
		"dropsToday",
		["owned", (fam) => haveFamiliar(fam)],
		["unrestricted", (fam) => isUnrestricted(fam)],
	],
	favorites: Object.keys(favoriteFamiliars()).map((famName) => Familiar.get(famName)).sort((a, b) => toInt(a) - toInt(b)),
};

export const itemGuidelines: Guidelines<Item> = {
	name: "items",
	all: $items``,
	fields: [
		["name", (it) => it.toString()],
		"image",
		["id", (it) => toInt(it)],
		"plural",
		["inInventory", (it) => itemAmount(it)],
		["inCloset", (it) => closetAmount(it)],
		["inStorage", (it) => storageAmount(it)],
		["unrestricted", (it) => isUnrestricted(it)],
	],
	favorites: getProperty("chit.gear.favorites").split('|').map((itemName) => Item.get(itemName)).sort((a, b) => toInt(a) - toInt(b)),
};

export const skillGuidelines: Guidelines<Skill> = {
	name: "skills",
	all: $skills``,
	fields: [
		"name",
		"image",
		["id", (skill) => toInt(skill)],
		["have", (skill) => haveSkill(skill)],
		"dailylimit",
		"timescast",
		["advCost", (skill) => advCost(skill)],
		["fuelCost", (skill) => fuelCost(skill)],
		["mpCost", (skill) => mpCost(skill)],
		["hpCost", (skill) => hpCost(skill)],
		["lightningCost", (skill) => lightningCost(skill)],
		["rainCost", (skill) => rainCost(skill)],
		["thunderCost", (skill) => thunderCost(skill)],
		["soulsauceCost", (skill) => soulsauceCost(skill)],
		["unrestricted", (skill) => isUnrestricted(skill)],
	]
};

export const thrallGuidelines: Guidelines<Thrall> = {
	name: "thralls",
	all: $thralls``,
	fields: [
		["type", (thrall) => thrall.toString()],
		"name",
		"id",
		"level",
		"image",
		"tinyimage",
		"skill",
	]
};
