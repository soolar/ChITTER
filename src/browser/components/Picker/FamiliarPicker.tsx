import {
	Button,
	ButtonGroup,
	Checkbox,
	Flex,
	Spacer,
	Wrap,
	WrapItem,
} from '@chakra-ui/react';
import * as React from 'react';
import { BrowserCharacter } from '../../../character';
import { BrowserFamiliar, BrowserList } from '../../../guidelines';
import FamIcon from '../FamIcon';
import ChitterIcon from '../ChitterIcon';
import Picker from './Picker';

declare const familiars: BrowserList<BrowserFamiliar>;
declare const my: BrowserCharacter;

export type FamiliarPickerType = 'default' | 'bjorn' | 'crown';

interface FamiliarPickerArgs {
	type?: FamiliarPickerType;
}

export default function FamiliarPicker({
	type = 'default',
}: FamiliarPickerArgs) {
	const [favoritesOnly, setFavoritesOnly] = React.useState(true);
	const activeFam =
		type === 'default'
			? familiars.active[0]
			: type === 'bjorn'
			? my.bjornFam
			: my.crownFam;
	const famsToShow = favoritesOnly ? familiars.favorites : familiars.all;

	return (
		<Picker
			header="Change Familiar"
			footer={
				<Flex>
					<ChitterIcon image="terrarium.gif" tooltip="Visit your terrarium" />
					<Spacer />
					<Checkbox
						isChecked={favoritesOnly}
						onChange={(e) => setFavoritesOnly(e.target.checked)}
					>
						Favorites Only
					</Checkbox>
					<Spacer />
					<ChitterIcon image="antianti.gif" tooltip="Use no familiar" />
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
									<FamIcon fam={fam} />
								</Button>
							</WrapItem>
						))}
				</Wrap>
			</ButtonGroup>
		</Picker>
	);
}
