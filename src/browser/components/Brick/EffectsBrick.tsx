import { Divider, GridItem, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import * as React from 'react'
import { BrowserEffect, BrowserList } from '../../../guidelines'
import { getExtraEffectInfo } from '../../effectHelpers'
import EffectIcon from '../Icons/EffectIcon'
import Brick from './Brick'

declare const effects: BrowserList<BrowserEffect>

export default function EffectsBrick() {
	return (
		<Brick name="Effects" header="Effects">
			<SimpleGrid columns={4}>
				{effects.active
					.sort((eff1, eff2) => {
						const turnsDiff = eff1.turnsActive - eff2.turnsActive
						return turnsDiff === 0 ? eff1.id - eff2.id : turnsDiff
					})
					.map((eff) => {
						const extraInfo = getExtraEffectInfo(eff)
						return (
							<>
								<GridItem>
									<EffectIcon effect={eff} />
								</GridItem>
								<GridItem>
									<VStack spacing={0}>
										<Text dangerouslySetInnerHTML={{ __html: eff.name }} />
										<Text
											className="desc-line"
											dangerouslySetInnerHTML={{ __html: extraInfo.mods }}
										/>
									</VStack>
								</GridItem>
								<GridItem>
									<Text>
										{eff.turnsActive === 2147483647 ? (
											<>&infin;</>
										) : (
											eff.turnsActive
										)}
									</Text>
								</GridItem>
								<GridItem>
									<Text>^</Text>
								</GridItem>
								<GridItem colSpan={4}>
									<Divider />
								</GridItem>
							</>
						)
					})}
			</SimpleGrid>
		</Brick>
	)
}
