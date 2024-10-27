import EffectsBrick from './EffectsBrick'
import FamiliarBrick from './FamiliarBrick'
import GearBrick from './GearBrick'

const brickRegistry: { [brickName: string]: () => JSX.Element } = {
	effects: EffectsBrick,
	familiar: FamiliarBrick,
	gear: GearBrick,
} as const

export type BrickName = keyof typeof brickRegistry

export default brickRegistry
