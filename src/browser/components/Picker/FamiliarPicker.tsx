import {
	Button,
	Flex,
	Spacer,
	Switch,
	Text,
	VStack,
	Wrap,
	WrapItem,
} from '@chakra-ui/react'
import * as React from 'react'
import { BrowserCharacter } from '../../../character'
import { BrowserFamiliar, BrowserList } from '../../../guidelines'
import FamIcon from '../Icons/FamIcon'
import ChitterIcon from '../Icons/ChitterIcon'
import Picker from './Picker'
import { getExtraFamInfo } from '../../familiarHelpers'
import CommandLink from '../Link/CommandLink'

declare const familiars: BrowserList<BrowserFamiliar>
declare const my: BrowserCharacter

export type FamiliarPickerType = 'default' | 'bjorn' | 'crown'

interface FamiliarPickerArgs {
	type?: FamiliarPickerType
}

export default function FamiliarPicker({
	type = 'default',
}: FamiliarPickerArgs) {
	const [favoritesOnly, setFavoritesOnly] = React.useState(true)
	const [dropsOnly, setDropsOnly] = React.useState(false)
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

	return (
		<Picker
			header="Change Familiar"
			footer={
				<Flex>
					<Button variant="link">
						<ChitterIcon image="terrarium.gif" tooltip="Visit your terrarium" />
					</Button>
					<Spacer />
					<VStack>
						<Flex>
							<Switch
								isChecked={favoritesOnly}
								onChange={(e) => setFavoritesOnly(e.target.checked)}
							/>
							<Text>Favorites Only</Text>
						</Flex>
						<Flex>
							<Switch
								isChecked={dropsOnly}
								onChange={(e) => setDropsOnly(e.target.checked)}
							/>
							<Text>Drops Only</Text>
						</Flex>
					</VStack>
					<Spacer />
					<Button variant="link">
						<ChitterIcon image="antianti.gif" tooltip="Use no familiar" />
					</Button>
				</Flex>
			}
		>
			<Wrap spacing={0}>
				{famsToShow
					.filter((fam) => fam !== activeFam && fam.canEquip && fam.owned)
					.map((fam) => (
						<WrapItem>
							<CommandLink cmd={`familiar ${fam.type}`}>
								<FamIcon fam={fam} isBjorn={type !== 'default'} />
							</CommandLink>
						</WrapItem>
					))}
			</Wrap>
		</Picker>
	)
}
