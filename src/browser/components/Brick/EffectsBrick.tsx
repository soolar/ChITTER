import { Divider, Flex, HStack, Spacer, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Effect, haveEffect, stringModifier } from 'kolmafia'
import Brick from './Brick'
import { getActiveEffects } from 'libram'
import EffectIcon from '../Icons/EffectIcon'
import { parseMods } from '../../../util'

export default function EffectsBrick() {
	const myEffs = getActiveEffects().sort((eff1, eff2) => {
		const turnsDiff = haveEffect(eff1) - haveEffect(eff2)
		return turnsDiff === 0
			? eff1.identifierNumber - eff2.identifierNumber
			: turnsDiff
	})
	return (
		<Brick name="effects" header="Effects">
			<VStack>
				<Divider />
				{myEffs.map((eff) => {
					const turnsLeft = haveEffect(eff)
					const mods = parseMods(stringModifier(eff, 'Evaluated Modifiers'))
					const nameBlock = (
						<Text dangerouslySetInnerHTML={{ __html: eff.name }} />
					)
					return (
						<>
							<Flex key={`eff${eff.name}`} className="chit-effect">
								<HStack>
									<EffectIcon effect={eff} />
									<VStack spacing={0} className="chit-effect-description">
										{nameBlock}
										{mods.length > 0 && (
											<Text
												className="desc-line"
												dangerouslySetInnerHTML={{ __html: mods }}
											/>
										)}
									</VStack>
								</HStack>
								<Spacer />
								<HStack>
									<Text className="chit-effect-turns">
										{turnsLeft === 2147483647 ? <>&infin;</> : turnsLeft}
									</Text>
									<Text className="chit-effect-extender">^</Text>
								</HStack>
							</Flex>
							<Divider key={`div${eff.name}`} />
						</>
					)
				})}
			</VStack>
		</Brick>
	)
}
