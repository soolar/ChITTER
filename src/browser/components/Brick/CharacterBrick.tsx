import * as React from 'react'
import { HStack, Text, VStack } from '@chakra-ui/react'
import { BrowserCharacter } from '../../../character'
import { $item } from '../../fakeLibram'
import CurrencyReadout from '../CurrencyReadout'
import Brick from './Brick'

declare const my: BrowserCharacter

export default function CharacterBrick() {
	return (
		<Brick name="Character" header={my.name}>
			<HStack>
				{/* Character avatar here */}
				<VStack>
					{/* Character title here */}
					{/* Restrictions here */}
					{my.pathName !== 'none' && <Text>{my.pathName}</Text>}
					<HStack>
						{[
							'meat' as const,
							$item`11-leaf clover`,
							$item`Freddy Kruegerand`,
						].map((it) => (
							<CurrencyReadout item={it} />
						))}
					</HStack>
				</VStack>
				<VStack>
					<Text>{my.level}</Text>
					<CurrencyReadout item="fites" />
					<CurrencyReadout item="advs" />
				</VStack>
			</HStack>
		</Brick>
	)
}
