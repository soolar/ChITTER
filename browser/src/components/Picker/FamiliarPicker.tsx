import { Flex, Spacer, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import * as React from 'react'
import FamIcon from '../Icons/FamIcon'
import ChitterIcon from '../Icons/ChitterIcon'
import Picker from './Picker'
import { useExtraFamInfo } from '../../familiarHelpers'
import useToggle from '../../hooks/useToggle'
import SettingToggle from '../SettingToggle'
import MainLink from '../Link/MainLink'
import {
	bjornifyFamiliar,
	canEquip,
	enthroneFamiliar,
	Familiar,
	favoriteFamiliars,
	haveFamiliar,
	myBjornedFamiliar,
	myEnthronedFamiliar,
	myFamiliar,
	toFamiliar,
	toInt,
	useFamiliar,
} from 'kolmafia'
import CallbackLink from '../Link/CallbackLink'
import { $familiar, $familiars } from 'libram'

export type FamiliarPickerType = 'default' | 'bjorn' | 'crown'

interface FamiliarPickerFamArgs {
	fam: Familiar
	cmd: (fam: Familiar) => boolean
	type?: FamiliarPickerType
}

function FamiliarPickerFam({ fam, cmd, type }: FamiliarPickerFamArgs) {
	const famNum = toInt(fam)
	return famNum !== 0 ? (
		<WrapItem key={famNum}>
			<CallbackLink callback={() => cmd(fam)}>
				<FamIcon fam={fam} isBjorn={type !== 'default'} />
			</CallbackLink>
		</WrapItem>
	) : (
		<div>L bozo</div>
	)
}

interface FamiliarPickerArgs {
	type?: FamiliarPickerType
}

export default function FamiliarPicker({
	type = 'default',
}: FamiliarPickerArgs) {
	const toggleSubtype = type === 'default' ? 'normal' : 'rider'
	const [favoritesOnly, setFavoritesOnly] = useToggle(
		`famFavsOnly.${toggleSubtype}`,
		true,
	)
	const [dropsOnly, setDropsOnly] = useToggle(
		`famDropsOnly.${toggleSubtype}`,
		false,
	)
	const activeFam =
		type === 'default'
			? myFamiliar()
			: type === 'bjorn'
			? myBjornedFamiliar()
			: myEnthronedFamiliar()
	const famsToShow = (
		favoritesOnly
			? Object.keys(favoriteFamiliars()).map((famName) => toFamiliar(famName))
			: $familiars``.filter((fam) => haveFamiliar(fam as Familiar))
	).filter((fam) => {
		if (toInt(fam as Familiar) === 0) {
			return false
		}
		if (!canEquip(fam as Familiar) && type === 'default') {
			return false
		}
		if (fam === activeFam) {
			return false
		}
		if (!dropsOnly) {
			return true
		}
		const extraInfo = useExtraFamInfo(
			fam as Familiar,
			false,
			type !== 'default',
		)
		return (
			extraInfo.dropInfo &&
			(extraInfo.dropInfo.left === undefined || extraInfo.dropInfo.left > 0)
		)
	})
	const cmd =
		type === 'crown'
			? enthroneFamiliar
			: type === 'bjorn'
			? bjornifyFamiliar
			: useFamiliar

	return (
		<Picker
			header="Change Familiar"
			footer={
				<Flex>
					<MainLink href="/familiar.php">
						<ChitterIcon image="terrarium.gif" tooltip="Visit your terrarium" />
					</MainLink>
					<Spacer />
					<VStack>
						<SettingToggle
							displayText="Favorites Only"
							value={favoritesOnly}
							setValue={setFavoritesOnly}
						/>
						<SettingToggle
							displayText="Drops Only"
							value={dropsOnly}
							setValue={setDropsOnly}
						/>
					</VStack>
					<Spacer />
					<CallbackLink callback={() => useFamiliar($familiar.none)}>
						<ChitterIcon image="antianti.gif" tooltip="Use no familiar" />
					</CallbackLink>
				</Flex>
			}
		>
			<Wrap spacing={0}>
				{famsToShow.map((fam) => (
					<FamiliarPickerFam
						key={toInt(fam as Familiar)}
						fam={fam as Familiar}
						cmd={cmd}
						type={type}
					/>
				))}
				{!favoritesOnly && (
					<>
						<WrapItem>$familiars`` machine broke</WrapItem>
						<WrapItem>Understandable, have a nice day</WrapItem>
					</>
				)}
				{dropsOnly && <WrapItem>Gimme a bit.</WrapItem>}
			</Wrap>
		</Picker>
	)
}
