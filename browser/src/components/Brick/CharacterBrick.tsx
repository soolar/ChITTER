import * as React from 'react'
import { HStack, Text, VStack } from '@chakra-ui/react'
import CurrencyReadout from '../CurrencyReadout'
import Brick from './Brick'
import { myLevel, myName, myPath } from 'kolmafia'
import { $item } from 'libram'

export default function CharacterBrick() {
	return (
		<Brick name="Character" header={myName()}>
			<HStack>
				{/* Character avatar here */}
				<VStack>
					{/* Character title here */}
					{/* Restrictions here */}
					{<Text>{myPath().name}</Text>}
					<HStack>
						{['meat' as const, $item`11-leaf clover`, $item`Freddy Kruegerand`]
							.filter((it) => typeof it === 'string' || it.id !== 0)
							.map((it) => (
								<CurrencyReadout
									key={it === ('meat' as const) ? 0 : it.id}
									item={it}
								/>
							))}
					</HStack>
				</VStack>
				<VStack>
					<Text>{myLevel()}</Text>
					<CurrencyReadout item="fites" />
					<CurrencyReadout item="advs" />
				</VStack>
			</HStack>
		</Brick>
	)
}
