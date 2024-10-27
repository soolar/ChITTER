import React from 'react'
import Brick from './Brick'
import { myLevel, myName, myPath } from 'kolmafia'
import { HStack, Text, VStack } from '@chakra-ui/react'
import { $item, $path } from 'libram'
import CurrencyReadout from '../CurrencyReadout'

export default function CharacterBrick() {
	const path = myPath()
	const onPath = path !== $path.none
	const level = myLevel()
	return (
		<Brick name="character" header={myName()}>
			<HStack>
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
				<VStack>
					<Text>{level}</Text>
					<CurrencyReadout item="fites" />
					<CurrencyReadout item="advs" />
				</VStack>
			</HStack>
		</Brick>
	)
}
