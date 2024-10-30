import React from 'react'
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
import { Flex, HStack, Spacer, Text, Tooltip, VStack } from '@chakra-ui/react'
import { $item, $path, get } from 'libram'
import CurrencyReadout from '../CurrencyReadout'
import MainLink from '../Link/MainLink'

export default function CharacterBrick() {
	const path = myPath()
	const onPath = path !== $path.none
	const level = myLevel()
	return (
		<Brick name="character" header={myName()}>
			<Flex>
				{/* Character avatar here... */}
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
						{['meat' as const, $item`11-leaf clover`].map((it) => (
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
