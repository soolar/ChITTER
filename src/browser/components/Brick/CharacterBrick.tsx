import Brick from './Brick'
import {
	canInteract,
	getClanName,
	inBadMoon,
	inHardcore,
	myLevel,
	myName,
	myPath,
	turnsPlayed,
} from 'kolmafia'
import {
	Flex,
	HStack,
	IconButton,
	Spacer,
	Text,
	Tooltip,
	VStack,
} from '@chakra-ui/react'
import { $path, get } from 'libram'
import CurrencyReadout from '../CurrencyReadout'
import MainLink from '../Link/MainLink'
import { ChevronDownIcon } from '@chakra-ui/icons'
import PickerLauncher from '../Picker/PickerLauncher'
import CurrencyPicker from '../Picker/CurrencyPicker'

export default function CharacterBrick() {
	const path = myPath()
	const onPath = path !== $path.none
	const level = myLevel()
	return (
		<Brick name="character" header={myName()}>
			<Flex>
				{/* Avatar some day */}
				<VStack spacing={0} align="left">
					{/* Character title here... */}
					<Text>{getClanName()}</Text>
					{onPath && <Text>{path.identifierString}</Text>}
					{get('kingLiberated') ? (
						<Text>Aftercore</Text>
					) : inBadMoon() ? (
						<Text>Bad Moon</Text>
					) : inHardcore() ? (
						<Text>Hardcore</Text>
					) : canInteract() ? (
						<Text>Casual</Text>
					) : (
						<Text>
							<MainLink href="/storage.php">
								<Tooltip label={<Text>Visit Hagnk</Text>}>Ronin</Tooltip>
							</MainLink>
							: {(1000 - turnsPlayed()).toLocaleString()}
						</Text>
					)}
					<HStack>
						<PickerLauncher WrappedPicker={CurrencyPicker} pickerProps={{}}>
							<IconButton
								icon={<ChevronDownIcon />}
								size="xs"
								aria-label="open currency selector"
							/>
						</PickerLauncher>
						{['meat' as const].map((it) => (
							<CurrencyReadout item={it} />
						))}
					</HStack>
				</VStack>
				<Spacer />
				<VStack spacing={0} align="right">
					<MainLink href="/council.php">
						<Tooltip label={<Text>Visit the council</Text>}>
							<Text>Level {level}</Text>
						</Tooltip>
					</MainLink>
					<CurrencyReadout item="fites" />
					<CurrencyReadout item="advs" />
				</VStack>
			</Flex>
		</Brick>
	)
}
