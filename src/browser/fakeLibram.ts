import {
	BrowserClass,
	BrowserEffect,
	BrowserFamiliar,
	BrowserItem,
	BrowserList,
	BrowserSkill,
	BrowserSlot,
	BrowserThrall,
} from '../guidelines'

declare const effects: BrowserList<BrowserEffect>
declare const items: BrowserList<BrowserItem>
declare const familiars: BrowserList<BrowserFamiliar>
declare const skills: BrowserList<BrowserSkill>
declare const slots: BrowserList<BrowserSlot>
declare const thralls: BrowserList<BrowserThrall>
declare const classes: BrowserList<BrowserClass>

function makeSingleConstant<T>(list: BrowserList<T>) {
	const func = (literals: TemplateStringsArray, ...placeholders: string[]) => {
		const input = literals.raw.reduce(
			(acc, literal, i) => acc + literal + (placeholders[i] ?? ''),
			''
		)
		return list.byName[input]
	}
	return func
}

export const $effect = makeSingleConstant(effects)
export const $item = makeSingleConstant(items)
export const $familiar = makeSingleConstant(familiars)
export const $skill = makeSingleConstant(skills)
export const $slot = makeSingleConstant(slots)
export const $thrall = makeSingleConstant(thralls)
export const $class = makeSingleConstant(classes)
