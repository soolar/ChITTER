import { cliExecute, currentMcd } from 'kolmafia'
import Picker from './Picker'
import { resolveStr } from '../../../util'
import { Flex, Spacer } from '@chakra-ui/react'
import ActionLink from '../Link/ActionLink'
import MainLink from '../Link/MainLink'

type MCDType = 'knoll' | 'gnomad' | 'canadia' | 'heartbreak'
export type MCDOptionalType = MCDType | undefined

interface MCDInfo {
	name: string
	label: string
	title: string | (() => string)
	page: string
	maxOverride?: number
}

export const MCDs = new Map<MCDType, MCDInfo>([
	[
		'knoll',
		{
			name: 'Detuned Radio',
			label: 'Radio',
			title: 'Turn it up or down, man',
			page: '/inv_use.php?pwd&which=3&whichitem=2682',
		},
	],
	[
		'gnomad',
		{
			name: 'Annoy-o-Tron 5000',
			label: 'AOT5K',
			title: 'Touch that dial!',
			page: '/gnomes.php?place=machine',
		},
	],
	[
		'canadia',
		{
			name: 'Mind-Control Device',
			label: 'MCD',
			title: 'Touch that dial!',
			page: '/canadia.php?place=machine',
			maxOverride: 11,
		},
	],
	[
		'heartbreak',
		{
			name: "Heartbreaker's Hotel",
			label: 'Hotel',
			title: () => `Hotel Floor #${currentMcd()}`,
			page: '/heydeze.php',
		},
	],
])

const mcdStrs = [
	'Turn it off',
	'Turn it mostly off',
	"Ratsworth's money clip",
	'Glass Balls of the King',
	'Boss Bat britches',
	'Rib of the Bonerdagon',
	'Horoscope of the Hermit',
	'Codpiece of the King',
	'Boss Bat bling',
	"Ratsworth's tophat",
	'Vertebra of the Bonerdagon',
	'It goes to 11?',
]

interface MCDPickerArgs {
	type: MCDOptionalType
}

export default function MCDPicker({ type }: MCDPickerArgs) {
	const info = type ? MCDs.get(type) : undefined

	if (!info) {
		return ''
	}

	const max = info.maxOverride ?? 10
	const levels: number[] = []
	for (let i = 0; i <= max; ++i) {
		levels.push(i)
	}
	return (
		<Picker
			header={<MainLink href={info.page}>{resolveStr(info.title)}</MainLink>}
		>
			{levels.map((level) => (
				<ActionLink callback={() => cliExecute(`mcd ${level}`)}>
					<Flex>
						{mcdStrs[level]}
						<Spacer />
						{level}
					</Flex>
				</ActionLink>
			))}
		</Picker>
	)
}
