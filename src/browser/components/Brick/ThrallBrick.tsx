import { Flex, HStack, Spacer, Text, VStack } from '@chakra-ui/react'
import {
	haveSkill,
	mpCost,
	myClass,
	myId,
	myThrall,
	Thrall,
	useSkill,
} from 'kolmafia'
import { $class, $skill, $thrall } from 'libram'
import Brick from './Brick'
import ChitterIcon from '../Icons/ChitterIcon'
import Picker from '../Picker/Picker'
import PickerLauncher from '../Picker/PickerLauncher'
import MainLink from '../Link/MainLink'
import ActionLink from '../Link/ActionLink'

interface ThrallInfo {
	thrall: Thrall
	base: (lv: number) => string
	level5: (lv: number) => string
	level10: string
}

interface ThrallDetailsArgs {
	info?: ThrallInfo
	inPicker?: boolean
}

function ThrallDetails({ info, inPicker }: ThrallDetailsArgs) {
	if (!info) {
		return <Text>Conspicuous lack of thrall</Text>
	}

	return (
		<HStack>
			<ChitterIcon image={info.thrall.image} tooltip={info.thrall.name} />
			<VStack spacing={0}>
				<Text color="blue">{info.base(Math.max(info.thrall.level, 1))}</Text>
				<Text color={info.thrall.level >= 5 ? 'blue' : 'gray'}>
					{info.level5(Math.max(info.thrall.level, 5))}
				</Text>
				<Text color={info.thrall.level >= 10 ? 'blue' : 'gray'}>
					{info.level10}
				</Text>
			</VStack>
			{inPicker && <Text>level {info.thrall.level}</Text>}
			{inPicker && <Text>{mpCost(info.thrall.skill)}mp</Text>}
		</HStack>
	)
}

interface ThrallPickerArgs {
	active: Thrall
	info: ThrallInfo[]
}

function ThrallPicker({ active, info }: ThrallPickerArgs) {
	return (
		<Picker header="Bind thy Thrall">
			<VStack>
				{info
					.filter((thrallInfo) => thrallInfo.thrall !== active)
					.map((thrallInfo) => {
						const details = (
							<ThrallDetails
								info={thrallInfo}
								key={`thrallpicker${thrallInfo.thrall.identifierString}`}
								inPicker
							/>
						)
						return thrallInfo.thrall.level === 0 ? (
							<MainLink
								href={`/runskillz.php?action=Skillz&whichskill=${
									thrallInfo.thrall.skill.identifierNumber
								}&pwd&quantity=1&targetplayer=${myId()}`}
							>
								{details}
							</MainLink>
						) : (
							<ActionLink callback={() => useSkill(thrallInfo.thrall.skill)}>
								{details}
							</ActionLink>
						)
					})}
				{active !== $thrall.none && (
					<ActionLink callback={() => useSkill($skill`Dismiss Pasta Thrall`)}>
						<HStack>
							<ChitterIcon image={active.image} tooltip={active.name} />
							<VStack>
								<Text>Dismiss {active.identifierString}</Text>
								<Text>Goodbye, {active.name}</Text>
							</VStack>
						</HStack>
					</ActionLink>
				)}
			</VStack>
		</Picker>
	)
}

export default function ThrallBrick() {
	if (myClass() !== $class`Pastamancer`) {
		return undefined
	}

	const thrallInfo: ThrallInfo[] = [
		{
			thrall: $thrall`Vampieroghi`,
			base: (lv) => `Deals 1-${2 * lv} dmg and heals`,
			level5: () => 'Dispels bad effects after combat',
			level10: 'Max HP +60',
		},
		{
			thrall: $thrall`Vermincelli`,
			base: (lv) => `Restores ${lv}-${2 * lv} MP after combat`,
			level5: (lv) =>
				`Attacks for ${Math.ceil(lv / 2)}-${lv}, poisoning first hit`,
			level10: 'Max MP +30',
		},
		{
			thrall: $thrall`Angel Hair Wisp`,
			base: (lv) => `Init +${5 * lv}`,
			level5: () => 'Prevents enemy crits',
			level10: 'Blocks enemy attacks',
		},
		{
			thrall: $thrall`Elbow Macaroni`,
			base: () => 'Mus matches Mys',
			level5: (lv) => `Wpn Dmg +${2 * lv}`,
			level10: 'Crit Hit +10%',
		},
		{
			thrall: $thrall`Penne Dreadful`,
			base: () => 'Mox matches Mys',
			level5: (lv) => `Delevels for ${lv} at combat start`,
			level10: 'DR +10',
		},
		{
			thrall: $thrall`Spaghetti Elemental`,
			base: (lv) => `Exp +${lv > 3 ? '1-' : ''}${Math.ceil(lv / 3)}`,
			level5: () => 'Blocks first hit',
			level10: 'Spell Dmg +5',
		},
		{
			thrall: $thrall`Lasagmbie`,
			base: (lv) => `Meat +${20 + 2 * lv}%`,
			level5: (lv) => `Deals ${lv}-${2 * lv} Spooky Dmg`,
			level10: 'Spooky Spell Dmg +10',
		},
		{
			thrall: $thrall`Spice Ghost`,
			base: (lv) => `Item +${10 + lv}%`,
			level5: () => 'Drops spices up to 10x per day',
			level10: '+1 Entangling Noodles turn',
		},
	]

	const relevantThralls = thrallInfo.filter((info) =>
		haveSkill(info.thrall.skill),
	)

	if (relevantThralls.length === 0) {
		return undefined
	}

	const currThrall = myThrall()
	const currThrallInfo = relevantThralls.find(
		(info) => info.thrall === currThrall,
	)

	return (
		<Brick
			name="thrall"
			header={
				currThrallInfo ? (
					<Flex>
						Lvl. {currThrall.level}
						<Spacer />
						{currThrall.name}
						<Spacer />
					</Flex>
				) : (
					'Thralls'
				)
			}
		>
			<PickerLauncher
				WrappedPicker={ThrallPicker}
				pickerProps={{ active: currThrall, info: relevantThralls }}
			>
				<ThrallDetails info={currThrallInfo} />
			</PickerLauncher>
		</Brick>
	)
}
