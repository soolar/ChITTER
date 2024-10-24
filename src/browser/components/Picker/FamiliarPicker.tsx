import React from 'react'
import FamIcon, { FamiliarVerb } from '../Icons/FamIcon'
import {
	bjornifyFamiliar,
	enthroneFamiliar,
	Familiar,
	favoriteFamiliars,
	haveFamiliar,
	isUnrestricted,
	myBjornedFamiliar,
	myEnthronedFamiliar,
	myFamiliar,
	toFamiliar,
	useFamiliar,
} from 'kolmafia'
import { $familiar, $familiars } from 'libram'
import Picker from './Picker'
import {
	Box,
	Flex,
	Spacer,
	Text,
	VStack,
	Wrap,
	WrapItem,
} from '@chakra-ui/react'
import MainLink from '../Link/MainLink'
import ActionLink from '../Link/ActionLink'
import ChitterIcon from '../Icons/ChitterIcon'
import useToggle from '../../hooks/useToggle'
import SettingToggle from '../SettingToggle'

interface FamiliarPickerArgs {
	type?: FamiliarVerb
}

export default function FamiliarPicker({
	type = 'familiar',
}: FamiliarPickerArgs) {
	const [favoritesOnly, setFavoritesOnly] = useToggle(
		`famFavsOnly.${type}`,
		true,
	)
	const [dropsOnly, setDropsOnly] = useToggle(`famDropsOnly.${type}`, false)

	const activeFam =
		type === 'familiar'
			? myFamiliar()
			: type === 'bjornify'
				? myBjornedFamiliar()
				: type === 'enthrone'
					? myEnthronedFamiliar()
					: $familiar`none` // maybe this should trigger a warning of some kind?

	const famsToShow = (
		favoritesOnly
			? Object.keys(favoriteFamiliars()).map((famName) => toFamiliar(famName))
			: $familiars``
	).filter((fam) => {
		return haveFamiliar(fam) && isUnrestricted(fam) && fam !== activeFam
	})

	const changeFunc =
		type === 'familiar'
			? useFamiliar
			: type === 'bjornify'
				? bjornifyFamiliar
				: type === 'enthrone'
					? enthroneFamiliar
					: () => {}

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
					<ActionLink callback={() => changeFunc($familiar`none`)}>
						<ChitterIcon image="antianti.gif" tooltip="Use no familiar" />
					</ActionLink>
				</Flex>
			}
		>
			<Wrap spacing={0}>
				{famsToShow.map((fam) => (
					<WrapItem key={fam.id}>
						<ActionLink callback={() => changeFunc(fam)}>
							<FamIcon fam={fam} style={type} />
						</ActionLink>
					</WrapItem>
				))}
			</Wrap>
		</Picker>
	)
}
