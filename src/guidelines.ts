import {
	advCost,
	canEquip,
	closetAmount,
	equippedAmount,
	equippedItem,
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
	myFamiliar,
	myThrall,
	rainCost,
	soulsauceCost,
	storageAmount,
	thunderCost,
	toInt,
	toSlot,
} from 'kolmafia';
import {
	$effects,
	$familiars,
	$items,
	$skills,
	$slots,
	$thralls,
} from 'libram';
import { FieldData, FieldValue, fieldValueToJSString } from './utils';

interface Guidelines<T extends MafiaClass> {
	name: string;
	all: T[];
	fields: FieldData<T>[];
	favorites: T[];
	active: T[];
}

// maybe some day I'll figure out a way to do this without any, maybe not...
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildStringFromGuidelines = <T extends { [key: string]: any }>(
	guidelines: Guidelines<T>
) => {
	const res = [`\t\t\tvar ${guidelines.name} = {\n\t\t\t\tbyName: {\n`];
	res.push(
		...guidelines.all.map((thing) => {
			const res = [`\t\t\t\t\t"${thing.toString()}": {`];
			res.push(
				guidelines.fields
					.map((fieldData) => {
						const fieldName =
							typeof fieldData === 'string' ? fieldData : fieldData[0];
						const fieldValue: FieldValue =
							typeof fieldData === 'string'
								? thing[fieldData]
								: fieldData[1](thing);
						return `${fieldName}: ${fieldValueToJSString(fieldValue)}`;
					})
					.join(', ')
			);
			res.push('},\n');
			return res.join('');
		})
	);
	res.push('\t\t\t\t}\n\t\t\t};\n');
	const addList = (list: T[], listName: string) => {
		res.push(
			`\t\t\t${guidelines.name}.${listName} = [\n${list
				.map(
					(thing) => `\t\t\t\t${guidelines.name}.byName["${thing.toString()}"]`
				)
				.join(',\n')}\n\t\t\t];\n`
		);
	};
	addList(guidelines.all, 'all');
	if (guidelines.favorites) {
		addList(guidelines.favorites, 'favorites');
	}
	if (guidelines.active) {
		addList(guidelines.active, 'active');
	}
	return res.join('');
};

export interface BrowserList<T> {
	all: T[];
	favorites: T[];
	active: T[];
	byName: { [key: string]: T };
}

// BEGIN ACTUAL GUIDELINES

// Begin Effects
export interface BrowserEffect {
	name: string;
	default: string;
	image: string;
	id: number;
	descid: string;
	quality: string;
	song: boolean;
	turnsActive: number;
}

export declare const effects: BrowserList<BrowserEffect>;

export const effectGuidelines: Guidelines<Effect> = {
	name: 'effects',
	all: $effects``,
	fields: [
		'name',
		['default', (eff) => encodeURI(eff.default)],
		'image',
		['id', (eff) => toInt(eff)],
		'descid',
		'quality',
		'song',
		['turnsActive', (eff) => haveEffect(eff)],
	],
	active: $effects``.filter((eff) => haveEffect(eff) !== 0),
	favorites: [],
};
// End Effects

// Begin Items
export interface BrowserItem {
	name: string;
	image: string;
	id: number;
	plural: string;
	inInventory: number;
	inCloset: number;
	inStorage: number;
	equippedAmount: number;
	unrestricted: boolean;
	canEquip: boolean;
	slotStr: string;
}

export declare const items: BrowserList<BrowserItem>;

export const itemGuidelines: Guidelines<Item> = {
	name: 'items',
	all: $items``,
	fields: [
		['name', (it) => it.toString()],
		'image',
		['id', (it) => toInt(it)],
		'plural',
		['inInventory', (it) => itemAmount(it)],
		['inCloset', (it) => closetAmount(it)],
		['inStorage', (it) => storageAmount(it)],
		['equippedAmount', (it) => equippedAmount(it)],
		['unrestricted', (it) => isUnrestricted(it)],
		['canEquip', (it) => canEquip(it)],
		['slotStr', (it) => toSlot(it).toString()],
	],
	favorites: getProperty('chit.gear.favorites')
		.split('|')
		.map((itemName) => Item.get(itemName))
		.sort((a, b) => toInt(a) - toInt(b)),
	active: [],
};
// End Items

// Begin Familiars
export interface BrowserFamiliar {
	type: string;
	image: string;
	id: number;
	name: string;
	experience: number;
	weight: number;
	drop: BrowserItem | undefined;
	dropsLimit: number;
	dropsToday: number;
	dropName: string;
	owned: boolean;
	unrestricted: boolean;
	canEquip: boolean;
}

export declare const familiars: BrowserList<BrowserFamiliar>;

export const familiarGuidelines: Guidelines<Familiar> = {
	name: 'familiars',
	all: $familiars``,
	fields: [
		['type', (fam) => fam.toString()],
		'image',
		['id', (fam) => toInt(fam)],
		'name',
		'experience',
		['weight', (fam) => familiarWeight(fam)],
		['drop', (fam) => fam.dropItem],
		'dropsLimit',
		'dropsToday',
		'dropName',
		['owned', (fam) => haveFamiliar(fam)],
		['unrestricted', (fam) => isUnrestricted(fam)],
		['canEquip', (fam) => canEquip(fam)],
	],
	favorites: Object.keys(favoriteFamiliars())
		.map((famName) => Familiar.get(famName))
		.sort((a, b) => toInt(a) - toInt(b)),
	active: [myFamiliar()],
};
// End Familiars

// Begin Skills
export interface BrowserSkill {
	name: string;
	image: string;
	id: number;
	have: boolean;
	dailylimit: number;
	timescast: number;
	advCost: number;
	fuelCost: number;
	mpCost: number;
	hpCost: number;
	lightningCost: number;
	rainCost: number;
	thunderCost: number;
	soulsauceCost: number;
	unrestricted: boolean;
}

export declare const skills: BrowserList<BrowserSkill>;

export const skillGuidelines: Guidelines<Skill> = {
	name: 'skills',
	all: $skills``,
	fields: [
		'name',
		'image',
		['id', (skill) => toInt(skill)],
		['have', (skill) => haveSkill(skill)],
		'dailylimit',
		'timescast',
		['advCost', (skill) => advCost(skill)],
		['fuelCost', (skill) => fuelCost(skill)],
		['mpCost', (skill) => mpCost(skill)],
		['hpCost', (skill) => hpCost(skill)],
		['lightningCost', (skill) => lightningCost(skill)],
		['rainCost', (skill) => rainCost(skill)],
		['thunderCost', (skill) => thunderCost(skill)],
		['soulsauceCost', (skill) => soulsauceCost(skill)],
		['unrestricted', (skill) => isUnrestricted(skill)],
	],
	active: [],
	favorites: [],
};
// End Skills

// Begin Slots
export interface BrowserSlot {
	name: string;
	equipped: BrowserItem;
}

export declare const slots: BrowserList<BrowserSlot>;

export const slotGuidelines: Guidelines<Slot> = {
	name: 'slots',
	all: $slots``,
	fields: [
		['name', (slot) => slot.toString()],
		['equipped', (slot) => equippedItem(slot)],
	],
	active: [], // TODO: Put relevant slots here
	favorites: $slots`hat, back, shirt, weapon, off-hand, pants, acc1, acc2, acc3`,
};
// End Slots

// Begin Thralls
export interface BrowserThrall {
	type: string;
	name: string;
	id: number;
	level: number;
	image: string;
	tinyimage: string;
	skill: BrowserSkill;
}

export declare const thralls: BrowserList<BrowserThrall>;

export const thrallGuidelines: Guidelines<Thrall> = {
	name: 'thralls',
	all: $thralls``,
	fields: [
		['type', (thrall) => thrall.toString()],
		'name',
		'id',
		'level',
		'image',
		'tinyimage',
		'skill',
	],
	favorites: [],
	active: [myThrall()],
};
// End Thralls
