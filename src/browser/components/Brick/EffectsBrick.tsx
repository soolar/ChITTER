import { Divider, Flex, HStack, Spacer, Text, VStack } from '@chakra-ui/react'
import * as React from 'react'
import { BrowserEffect, BrowserList } from '../../../guidelines'
import { getExtraEffectInfo } from '../../effectHelpers'
import EffectIcon from '../Icons/EffectIcon'
import PickerLauncher from '../Picker/PickerLauncher'
import Brick from './Brick'

declare const effects: BrowserList<BrowserEffect>

export default function EffectsBrick() {
	const nameBlock = (eff: BrowserEffect) => (
		<Text dangerouslySetInnerHTML={{ __html: eff.name }} />
	)
	return (
		<Brick name="Effects" header="Effects">
			<VStack>
				<Divider />
				{effects.active
					.sort((eff1, eff2) => {
						const turnsDiff = eff1.turnsActive - eff2.turnsActive
						return turnsDiff === 0 ? eff1.id - eff2.id : turnsDiff
					})
					.map((eff) => {
						const extraInfo = getExtraEffectInfo(eff)
						return (
							<>
								<Flex key={eff.name} className="chit-effect">
									<HStack>
										<EffectIcon effect={eff} />
										<VStack spacing={0} className="chit-effect-description">
											{extraInfo.launches ? (
												<PickerLauncher
													WrappedPicker={extraInfo.launches}
													pickerProps={{}}
												>
													{nameBlock(eff)}
												</PickerLauncher>
											) : (
												nameBlock(eff)
											)}
											{extraInfo.mods.length > 0 && (
												<Text
													className="desc-line"
													dangerouslySetInnerHTML={{ __html: extraInfo.mods }}
												/>
											)}
										</VStack>
									</HStack>
									<Spacer />
									<HStack>
										<Text className="chit-effect-turns">
											{eff.turnsActive === 2147483647 ? (
												<>&infin;</>
											) : (
												eff.turnsActive
											)}
										</Text>
										<Text className="chit-effect-extender">^</Text>
									</HStack>
								</Flex>
								<Divider />
							</>
						)
					})}
			</VStack>
		</Brick>
	)
}
