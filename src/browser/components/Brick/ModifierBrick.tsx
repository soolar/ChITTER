import React from 'react'
import Brick from './Brick'
import { Flex, Spacer, Text, Tooltip } from '@chakra-ui/react'
import {
	damageAbsorptionPercent,
	elementalResistance,
	Modifier,
	numericModifier,
	toElement,
} from 'kolmafia'
import { $modifier, $modifiers } from 'libram'

interface RawModLineArgs {
	name: string
	value: React.ReactNode
	isSecondary?: boolean
}

function RawModLine({ name, value, isSecondary }: RawModLineArgs) {
	return (
		<Flex className="alternating-row">
			{isSecondary && <>&nbsp;&nbsp;</>}
			<Text>{name}</Text>
			<Spacer />
			<Text>
				{isSecondary && '('}
				{value}
				{isSecondary && ')'}
			</Text>
		</Flex>
	)
}

interface ModLineArgs {
	mod: Modifier | Modifier[] | RawModLineArgs
	percentile?: boolean
	isSecondary?: boolean
	hideIfZero?: boolean
	elemental?: boolean
}

function handleMod(
	mod: Modifier,
	percentile?: boolean,
	hideIfZero?: boolean,
	elemental?: boolean,
) {
	const value = numericModifier(mod)
	if (value === 0 && hideIfZero) {
		return undefined
	}
	const elementStr = elemental ? mod.identifierString.split(' ')[0] : undefined
	const isEleRes = elementStr
		? mod.identifierString.split(' ')[1] === 'Resistance'
		: undefined
	const text = (
		<Text as="span" className={elemental ? `mod${elementStr}` : undefined}>
			{value > 0 && '+'}
			{value.toLocaleString()}
			{(percentile || mod.identifierString.endsWith('Percent')) && '%'}
		</Text>
	)
	return (
		<Tooltip
			label={
				<Text>
					{mod.identifierString}
					{isEleRes &&
						`: ${elementalResistance(toElement(elementStr as string)).toLocaleString()}% reduction to incoming ${(elementStr as string).toLowerCase()} damage`}
				</Text>
			}
		>
			{text}
		</Tooltip>
	)
}

function ModLine({
	mod,
	percentile,
	isSecondary,
	hideIfZero,
	elemental,
}: ModLineArgs) {
	if ('value' in mod) {
		return mod.value && <RawModLine {...mod} />
	}
	const value = Array.isArray(mod)
		? mod
				.map((m) => handleMod(m, percentile, hideIfZero, elemental))
				.filter((m) => m)
				.map((m, i) => (
					<>
						{i > 0 && ' / '}
						{m}
					</>
				))
		: handleMod(mod, percentile, hideIfZero, elemental)
	if ((Array.isArray(value) && value.length === 0) || !value) {
		return undefined
	}
	const firstModName = (Array.isArray(mod) ? mod[0] : mod).identifierString
	const modName = elemental
		? `Elemental ${firstModName.substring(firstModName.indexOf(' ') + 1, firstModName.length)}`
		: firstModName
	return <RawModLine name={modName} value={value} isSecondary={isSecondary} />
}

interface DropLineArgs {
	mod: Modifier
	isSecondary?: boolean
}

function DropLine({ mod, isSecondary }: DropLineArgs) {
	if (isSecondary && numericModifier(mod) === 0) {
		return undefined
	}
	const lineText =
		mod === $modifier`Item Drop`
			? 'Forced Drop @'
			: `Forced ${mod.identifierString}`
	const forcedAt = Math.ceil(
		100 *
			(100.0 /
				(100 +
					numericModifier(mod) +
					(isSecondary ? numericModifier($modifier`Item Drop`) : 0))),
	)
	return (
		<RawModLine
			name={lineText}
			value={
				<Tooltip
					label={
						<Text>
							{mod.identifierString}s with at least {forcedAt}% chance are
							guaranteed to drop
						</Text>
					}
				>
					<Text as="span">{forcedAt.toLocaleString()}%</Text>
				</Tooltip>
			}
			isSecondary={isSecondary}
		/>
	)
}

function modifiedInit() {
	const ml = numericModifier($modifier`Monster Level`)
	const init = numericModifier($modifier`Initiative`)
	if (ml < 21) return init
	if (ml < 41) return init - (ml - 20)
	if (ml < 61) return init - 2 * (ml - 40) - 20
	if (ml < 81) return init - 3 * (ml - 60) - 60
	if (ml < 101) return init - 4 * (ml - 80) - 120
	return init - 5 * (ml - 100) - 200
}

interface ModDesc {
	primary: ModLineArgs
	secondary?: ModLineArgs[]
}

function arg(
	mod: Modifier | Modifier[],
	percentile?: boolean,
	hideIfZero?: boolean,
	elemental?: boolean,
): ModLineArgs {
	return { mod, percentile, hideIfZero, elemental }
}

function args(mods: Modifier[], percentile?: boolean): ModLineArgs[] {
	return mods.map((mod) => {
		return { mod, percentile, isSecondary: true, hideIfZero: true }
	})
}

export default function ModifierBrick() {
	const mods: ModDesc[] = [
		{ primary: arg($modifier`Meat Drop`, true) },
		{
			primary: arg($modifier`Item Drop`, true),
			secondary: args(
				$modifiers`Food Drop, Booze Drop, Candy Drop, Hat Drop, Weapon Drop, Offhand Drop, Shirt Drop, Pants Drop, Accessory Drop`,
				true,
			),
		},
		{ primary: arg($modifiers`Mana Cost, Stackable Mana Cost`, false, true) },
		{ primary: arg($modifier`Monster Level`) },
		{ primary: arg($modifier`Initiative`, true) },
		{
			primary: {
				mod: {
					name: 'Modified Init',
					value: numericModifier($modifier`Monster Level`) > 20 && (
						<Tooltip
							label={
								<Text>
									This is your effective initiative after accounting for ML
									adjustment
								</Text>
							}
						>
							<Text>{modifiedInit()}%</Text>
						</Tooltip>
					),
				},
				hideIfZero: true,
			},
		},
		{ primary: arg($modifier`Combat Rate`, true) },
		{
			primary: {
				mod: {
					name: 'Damage Absorb',
					value: numericModifier($modifier`Damage Absorption`) > 0 && (
						<Tooltip
							label={
								<Text>
									Thanks to your{' '}
									{numericModifier(
										$modifier`Damage Absorption`,
									).toLocaleString()}{' '}
									Damage Absorption, you are reducing incoming damage by{' '}
									{damageAbsorptionPercent().toLocaleString()}%
								</Text>
							}
						>
							<Text>
								{damageAbsorptionPercent().toLocaleString()}% (
								{numericModifier($modifier`Damage Absorption`).toLocaleString()}
								)
							</Text>
						</Tooltip>
					),
				},
			},
		},
		{ primary: arg($modifier`Damage Reduction`, false, true) },
		{
			primary: arg(
				$modifiers`Weapon Damage, Weapon Damage Percent`,
				false,
				true,
			),
		},
		{
			primary: arg($modifiers`Spell Damage, Spell Damage Percent`, false, true),
		},
		{
			primary: arg(
				$modifiers`Ranged Damage, Ranged Damage Percent`,
				false,
				true,
			),
		},
		{
			primary: arg(
				$modifiers`Hot Resistance, Cold Resistance, Spooky Resistance, Stench Resistance, Sleaze Resistance`,
				false,
				true,
				true,
			),
		},
		{
			primary: arg(
				$modifiers`Hot Damage, Cold Damage, Spooky Damage, Stench Damage, Sleaze Damage`,
				false,
				true,
				true,
			),
		},
		{
			primary: arg(
				$modifiers`Hot Spell Damage, Cold Spell Damage, Spooky Spell Damage, Stench Spell Damage, Sleaze Spell Damage`,
				false,
				true,
				true,
			),
		},
	]
	return (
		<Brick name="modifiers" header="Modifiers">
			{mods.map((mods) => (
				<>
					<ModLine {...mods.primary} />
					{mods.secondary &&
						mods.secondary.map((mod) => (
							<ModLine
								key={`mod${(Array.isArray(mod) ? mod[0] : mod).identifierString}`}
								{...mod}
							/>
						))}
					{mods.primary.mod === $modifier`Item Drop` && (
						<DropLine mod={mods.primary.mod as Modifier} />
					)}
					{mods.primary.mod === $modifier`Item Drop` &&
						mods.secondary &&
						mods.secondary.map((mod) => (
							<DropLine
								key={`drop${(mod.mod as Modifier).identifierString}`}
								mod={mod.mod as Modifier}
								isSecondary
							/>
						))}
				</>
			))}
		</Brick>
	)
}
