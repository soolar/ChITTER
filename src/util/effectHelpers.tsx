import {
	cliExecute,
	Effect,
	equippedItem,
	haveEffect,
	isRemovable,
	isShruggable,
	itemAmount,
	mpCost,
	myFamiliar,
	myMp,
	stringModifier,
} from 'kolmafia'
import {
	$effect,
	$familiar,
	$item,
	$skill,
	$slot,
	clamp,
	get,
	have,
} from 'libram'
import React from 'react'
import FlavourPicker from '../browser/components/Picker/FlavourPicker'
import { evaluatedModifiers, parseMods } from '.'
import { Text, Tooltip } from '@chakra-ui/react'
import ActionLink from '../browser/components/Link/ActionLink'

interface EffectInfo {
	mods: string
	launches?: React.ComponentType<Record<string, never>>
	displayName: string | React.ReactNode
	displayTurns: number | string | React.ReactNode
}

export function getEffectInfo(eff: Effect): EffectInfo {
	const turnsLeft = haveEffect(eff)
	const res: EffectInfo = {
		mods: stringModifier(eff, 'Evaluated Modifiers'),
		displayName: eff.name,
		displayTurns: turnsLeft === 2147483647 ? <>&infin;</> : turnsLeft,
	}
	let doParse = true
	let doCleanse = true
	let cleanser = ''

	switch (eff.identifierString) {
		case $effect`Beaten Up`.identifierString: {
			if (
				have($skill`Tongue of the Walrus`) &&
				myMp() >= mpCost($skill`Tongue of the Walrus`)
			) {
				cleanser = `${mpCost($skill`Tongue of the Walrus`)} MP to cast Tongue of the Walrus`
			}
			// TODO: Others
			break
		}
		case $effect`Video... Games?`.identifierString: {
			res.mods = 'Basically Everything +5'
			break
		}
		case $effect`Spirit of Bacon Grease`.identifierString: {
			res.displayName = (
				<Text as="span" color="blueviolet">
					{eff.name}
				</Text>
			)
			res.launches = FlavourPicker
			doCleanse = false
			break
		}
		case $effect`Spirit of Peppermint`.identifierString: {
			res.displayName = (
				<Text as="span" color="blue">
					{eff.name}
				</Text>
			)
			res.launches = FlavourPicker
			doCleanse = false
			break
		}
		case $effect`Spirit of Wormwood`.identifierString: {
			res.displayName = (
				<Text as="span" color="grey">
					{eff.name}
				</Text>
			)
			res.launches = FlavourPicker
			doCleanse = false
			break
		}
		case $effect`Spirit of Cayenne`.identifierString: {
			res.displayName = (
				<Text as="span" color="red">
					{eff.name}
				</Text>
			)
			res.launches = FlavourPicker
			doCleanse = false
			break
		}
		case $effect`Spirit of Garlic`.identifierString: {
			res.displayName = (
				<Text as="span" color="green">
					{eff.name}
				</Text>
			)
			res.launches = FlavourPicker
			doCleanse = false
			break
		}
		case $effect`Citizen of a Zone`.identifierString: {
			res.displayName = `Citizen of ${get('_citizenZone')}`
			res.displayTurns = 'Today'
			break
		}
		case $effect`Everything Looks Blue`.identifierString: {
			res.displayName = (
				<Text as="span" color="blue">
					{eff.name}
				</Text>
			)
			break
		}
		case $effect`Everything Looks Red`.identifierString: {
			res.displayName = (
				<Text as="span" color="red">
					{eff.name}
				</Text>
			)
			break
		}
		case $effect`Everything Looks Yellow`.identifierString: {
			res.displayName = (
				<Text as="span" color="olive">
					{eff.name}
				</Text>
			)
			break
		}
		case $effect`Everything Looks Green`.identifierString: {
			res.displayName = (
				<Text as="span" color="green">
					{eff.name}
				</Text>
			)
			break
		}
		case $effect`Everything Looks Purple`.identifierString: {
			res.displayName = (
				<Text as="span" color="purple">
					{eff.name}
				</Text>
			)
			break
		}
		case $effect`On the Trail`.identifierString: {
			res.mods = get('olfactedMonster')?.identifierString ?? ''
			doParse = false
			break
		}
		case $effect`Super Skill`.identifierString: {
			res.mods = 'Combat skills/spells cost 0 MP'
			doParse = false
			break
		}
		case $effect`Offhand Remarkable`.identifierString: {
			const myOffhand = equippedItem($slot`off-hand`)
			const myFamOffhand =
				myFamiliar() === $familiar`Left-Hand Man`
					? equippedItem($slot`familiar`)
					: $item.none
			const myOffhands = [
				...(myOffhand !== $item.none ? [myOffhand] : []),
				...(myFamOffhand !== $item.none ? [myFamOffhand] : []),
			]
			doParse = false
			res.mods = 'Doubles off-hands (Currently: '
			if (myOffhands.length > 0) {
				res.mods += parseMods(
					myOffhands
						.map((offhand) => evaluatedModifiers(offhand))
						.filter((modifier) => modifier.length > 0)
						.join(', '),
				)
			} else {
				res.mods += 'Nothing'
			}
			res.mods += ')'
			break
		}
	}

	if (doParse) {
		res.mods = parseMods(res.mods)
	}

	if (doCleanse) {
		const shruggable = isShruggable(eff)
		const sgeeas = itemAmount($item`soft green echo eyedrop antidote`)
		const hotTubs = have($item`Clan VIP Lounge key`)
			? 5 - clamp(get('_hotTubSoaks'), 0, 5)
			: 0
		const removable =
			isRemovable(eff) && (sgeeas > 0 || (eff.quality === 'bad' && hotTubs > 0))
		if (shruggable || removable || cleanser !== '') {
			res.displayTurns = (
				<ActionLink callback={() => cliExecute(`uneffect ${eff.name}`)} dirty>
					<Tooltip
						label={
							shruggable ? (
								<Text>Shrug {eff.name}</Text>
							) : (
								<Text>
									Use{' '}
									{cleanser !== ''
										? cleanser
										: eff.quality === 'bad' && hotTubs > 0
											? `1 of your ${hotTubs} hot tub soaks`
											: `1 of your ${sgeeas} SGEEAs`}{' '}
									to remove {eff.name}
								</Text>
							)
						}
					>
						<Text>{res.displayTurns}</Text>
					</Tooltip>
				</ActionLink>
			)
		}
	}

	return res
}
