import APITestBrick from './APITestBrick'
import CharacterBrick from './CharacterBrick'
import DebugBrick from './DebugBrick'
import EffectsBrick from './EffectsBrick'
import FamiliarBrick from './FamiliarBrick'
import GearBrick from './GearBrick'
import StatsBrick from './StatsBrick'
import TrailBrick from './TrailBrick'

const brickRegistry: { [brickName: string]: () => JSX.Element } = {
	debug: DebugBrick,
	character: CharacterBrick,
	char: CharacterBrick,
	stats: StatsBrick,
	gear: GearBrick,
	effects: EffectsBrick,
	eff: EffectsBrick,
	familiar: FamiliarBrick,
	fam: FamiliarBrick,
	trail: TrailBrick,
	apitest: APITestBrick,
} as const

export type BrickName = keyof typeof brickRegistry

export default brickRegistry
