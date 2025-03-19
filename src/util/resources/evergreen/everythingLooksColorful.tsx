import { $effect } from 'libram'
import { EffectListEntry } from '../effectList'
import { Text } from '@chakra-ui/react'

const everythingLooksColorful: EffectListEntry[] = [
	[
		$effect`Everything Looks Blue`.identifierString,
		(effectInfo) => {
			effectInfo.displayName = (
				<Text as="span" color="blue">
					{effectInfo.displayName}
				</Text>
			)
		},
	],
	[
		$effect`Everything Looks Red`.identifierString,
		(effectInfo) => {
			effectInfo.displayName = (
				<Text as="span" color="red">
					{effectInfo.displayName}
				</Text>
			)
		},
	],
	[
		$effect`Everything Looks Yellow`.identifierString,
		(effectInfo) => {
			effectInfo.displayName = (
				<Text as="span" color="olive">
					{effectInfo.displayName}
				</Text>
			)
		},
	],
	[
		$effect`Everything Looks Green`.identifierString,
		(effectInfo) => {
			effectInfo.displayName = (
				<Text as="span" color="green">
					{effectInfo.displayName}
				</Text>
			)
		},
	],
	[
		$effect`Everything Looks Purple`.identifierString,
		(effectInfo) => {
			effectInfo.displayName = (
				<Text as="span" color="purple">
					{effectInfo.displayName}
				</Text>
			)
		},
	],
]

export default everythingLooksColorful
