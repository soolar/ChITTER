import { Flex, Spacer, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import * as React from 'react'
import { BrowserCharacter } from '../../../character'
import { BrowserFamiliar, BrowserList } from '../../../guidelines'
import FamIcon from '../Icons/FamIcon'
import ChitterIcon from '../Icons/ChitterIcon'
import Picker from './Picker'
import { getExtraFamInfo } from '../../familiarHelpers'
import CommandLink from '../Link/CommandLink'
import useToggle from '../../hooks/useToggle'
import SettingToggle from '../SettingToggle'
import MainLink from '../Link/MainLink'

declare const familiars: BrowserList<BrowserFamiliar>
declare const my: BrowserCharacter

export type FamiliarPickerType = 'default' | 'bjorn' | 'crown'

interface FamiliarPickerArgs {
	type?: FamiliarPickerType
}

export default function FamiliarPicker({
	type = 'default',
}: FamiliarPickerArgs) {
	const toggleSubtype = type === 'default' ? 'normal' : 'rider'
	const [favoritesOnly, setFavoritesOnly] = useToggle(
		`famFavsOnly.${toggleSubtype}`,
		true
	)
	const [dropsOnly, setDropsOnly] = useToggle(
		`famDropsOnly.${toggleSubtype}`,
		false
	)
	const activeFam =
		type === 'default'
			? familiars.active[0]
			: type === 'bjorn'
			? my.bjornFam
			: my.crownFam
	const famsToShow = (
		favoritesOnly ? familiars.favorites : familiars.all
	).filter((fam) => {
		if (!dropsOnly) {
			return true
		}
		const extraInfo = getExtraFamInfo(fam, false, type !== 'default')
		return (
			extraInfo.dropInfo &&
			(extraInfo.dropInfo.left === undefined || extraInfo.dropInfo.left > 0)
		)
	})
	const cmd =
		type === 'crown' ? 'enthrone' : type === 'bjorn' ? 'bjornify' : 'familiar'

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
					<CommandLink cmd="familiar none">
						<ChitterIcon image="antianti.gif" tooltip="Use no familiar" />
					</CommandLink>
				</Flex>
			}
		>
			<Wrap spacing={0}>
				{famsToShow
					.filter(
						(fam) =>
							fam !== activeFam &&
							(fam.canEquip || type !== 'default') &&
							fam.owned
					)
					.map((fam) => (
						<WrapItem key={fam.type}>
							<CommandLink cmd={`${cmd} ${fam.type}`}>
								<FamIcon fam={fam} isBjorn={type !== 'default'} />
							</CommandLink>
						</WrapItem>
					))}
			</Wrap>
		</Picker>
	)
}
