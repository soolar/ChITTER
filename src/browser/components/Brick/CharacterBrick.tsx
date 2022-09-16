import { HStack, Text, VStack } from '@chakra-ui/react'
import * as React from 'react'
import { BrowserCharacter } from '../../../character'
import { BrowserItem, BrowserList } from '../../../guidelines'
import CurrencyReadout from '../CurrencyReadout'
import Brick from './Brick'

declare const my: BrowserCharacter
declare const items: BrowserList<BrowserItem>

export default function CharacterBrick() {
	return (
		<Brick name="Character" header={my.name}>
			<HStack>
				{/* Character avatar here */}
				<VStack>
					{/* Character title here */}
					{/* Restrictions here */}
					<Text>{my.pathName}</Text>
					<HStack>
						{[
							'meat' as const,
							items.byName['11-leaf clover'],
							items.byName['Freddy Kruegerand'],
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
