import React from 'react'
import Brick from './Brick'
import { myLevel, myName, myPath } from 'kolmafia'
import { Flex, HStack, Spacer, Text, Tooltip, VStack } from '@chakra-ui/react'
import { $item, $path } from 'libram'
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
				<VStack>
					{/* Character title here... */}
					{/* Restrictions here... */}
					{onPath && <Text>{path.identifierString}</Text>}
					<HStack>
						{['meat' as const, $item`11-leaf clover`].map((it) => (
							<CurrencyReadout item={it} />
						))}
					</HStack>
				</VStack>
				<Spacer />
				<VStack>
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
