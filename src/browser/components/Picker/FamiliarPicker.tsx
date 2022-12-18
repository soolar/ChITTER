import {
	Button,
	ButtonGroup,
	Flex,
	Spacer,
	Switch,
	Text,
	Wrap,
	WrapItem,
} from '@chakra-ui/react'
import * as React from 'react'
import { BrowserCharacter } from '../../../character'
import { BrowserFamiliar, BrowserList } from '../../../guidelines'
import FamIcon from '../Icons/FamIcon'
import ChitterIcon from '../Icons/ChitterIcon'
import Picker from './Picker'

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
	const activeFam =
		type === 'default'
			? familiars.active[0]
			: type === 'bjorn'
			? my.bjornFam
			: my.crownFam
	const famsToShow = favoritesOnly ? familiars.favorites : familiars.all

	return (
		<Picker
			header="Change Familiar"
			footer={
				<Flex>
					<Button variant="link">
						<ChitterIcon image="terrarium.gif" tooltip="Visit your terrarium" />
					</Button>
					<Spacer />
					<Switch
						isChecked={favoritesOnly}
						onChange={(e) => setFavoritesOnly(e.target.checked)}
					/>
					<Text>Favorites Only</Text>
					<Spacer />
					<Button variant="link">
						<ChitterIcon image="antianti.gif" tooltip="Use no familiar" />
					</Button>
				</Flex>
			}
		>
			<ButtonGroup variant="link">
				<Wrap spacing={0}>
					{famsToShow
						.filter((fam) => fam !== activeFam && fam.canEquip && fam.owned)
						.map((fam) => (
							<WrapItem>
								<Button>
									<FamIcon fam={fam} isBjorn={type !== 'default'} />
								</Button>
							</WrapItem>
						))}
				</Wrap>
			</ButtonGroup>
		</Picker>
	)
}
