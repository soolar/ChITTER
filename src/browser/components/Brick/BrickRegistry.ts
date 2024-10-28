import CharacterBrick from './CharacterBrick'
import EffectsBrick from './EffectsBrick'
import FamiliarBrick from './FamiliarBrick'
import GearBrick from './GearBrick'
import StatsBrick from './StatsBrick'
import TrailBrick from './TrailBrick'

const brickRegistry: { [brickName: string]: () => JSX.Element } = {
	character: CharacterBrick,
	effects: EffectsBrick,
	familiar: FamiliarBrick,
	gear: GearBrick,
	stats: StatsBrick,
	trail: TrailBrick,
} as const

export type BrickName = keyof typeof brickRegistry

export default brickRegistry
