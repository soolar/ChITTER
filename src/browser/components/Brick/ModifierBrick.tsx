import React from 'react'
import Brick from './Brick'
import { Flex, Spacer, Text, Tooltip } from '@chakra-ui/react'
import { Modifier, numericModifier } from 'kolmafia'
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
}

function handleMod(
	mod: Modifier,
	percentile?: boolean,
	hideIfZero?: boolean,
	isArray?: boolean,
) {
	const value = numericModifier(mod)
	if (value === 0 && hideIfZero) {
		return undefined
	}
	const text = (
		<Text as="span">
			{value > 0 && '+'}
			{value.toLocaleString()}
			{percentile && '%'}
		</Text>
	)
	if (!isArray) {
		return text
	}
	return <Tooltip label={<Text>{mod.identifierString}</Text>}>{text}</Tooltip>
}

function ModLine({ mod, percentile, isSecondary, hideIfZero }: ModLineArgs) {
	if ('value' in mod) {
		return <RawModLine {...mod} />
	}
	const value = Array.isArray(mod)
		? mod
				.map((m) => handleMod(m, percentile, hideIfZero, true))
				.filter((m) => m)
				.map((m, i) => (
					<>
						{i > 0 && ' / '}
						{m}
					</>
				))
		: handleMod(mod, percentile, hideIfZero, false)
	if (!value) {
		return undefined
	}
	const firstMod = Array.isArray(mod) ? mod[0] : mod
	return (
		<RawModLine
			name={firstMod.identifierString}
			value={value}
			isSecondary={isSecondary}
		/>
	)
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
			value={`${forcedAt}%`}
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
): ModLineArgs {
	return { mod, percentile, hideIfZero }
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
				mod: { name: 'Modified Init', value: <Text>{modifiedInit()}%</Text> },
			},
		},
		{ primary: arg($modifier`Combat Rate`, true) },
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
