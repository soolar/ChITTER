import {
	canadiaAvailable,
	currentMcd,
	gnomadsAvailable,
	inBadMoon,
	knollAvailable,
} from 'kolmafia'
import Picker from './Picker'
import { resolveStr } from '../../../util'
import MainLink from '../Link/MainLink'
import { Flex, Spacer } from '@chakra-ui/react'

type MCDType = 'knoll' | 'gnomad' | 'canadia' | 'heartbreak'
type MCDOptionalType = MCDType | undefined

interface MCDInfo {
	name: string
	label: string
	title: string | (() => string)
	page: string
	changeUrl: string
	maxOverride?: number
	noSet?: boolean
}

const mcds = new Map<MCDType, MCDInfo>([
	[
		'knoll',
		{
			name: 'Detuned Radio',
			label: 'Radio',
			title: 'Turn it up or down, man',
			page: '/inv_use.php?pwd&which=3&whichitem=2682',
			changeUrl: '/inv_use.php?pwd&which=3&whichitem=2682&tuneradio=',
		},
	],
	[
		'gnomad',
		{
			name: 'Annoy-o-Tron 5000',
			label: 'AOT5K',
			title: 'Touch that dial!',
			page: '/gnomes.php?place=machine',
			changeUrl: '/gnomes.php?action=changedial&whichlevel=',
		},
	],
	[
		'canadia',
		{
			name: 'Mind-Control Device',
			label: 'MCD',
			title: 'Touch that dial!',
			page: '/canadia.php?place=machine',
			changeUrl: '/canadia.php?action=changedial&whichlevel=',
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
			changeUrl: '',
			noSet: true,
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

export default function MCDPicker() {
	const type: MCDOptionalType = knollAvailable()
		? 'knoll'
		: gnomadsAvailable()
			? 'gnomad'
			: canadiaAvailable()
				? 'canadia'
				: inBadMoon()
					? 'heartbreak'
					: undefined
	const info = type ? mcds.get(type) : undefined

	if (!info) {
		return ''
	}

	const max = info.maxOverride ?? 10
	const levels: number[] = []
	for (let i = 0; i <= max; ++i) {
		levels.push(i)
	}
	return (
		<Picker header={resolveStr(info.title)}>
			{levels.map((level) => (
				<MainLink href={`${info.changeUrl}${level}`}>
					<Flex>
						{mcdStrs[level]}
						<Spacer />
						{level}
					</Flex>
				</MainLink>
			))}
		</Picker>
	)
}
