import React, { JSXElementConstructor } from 'react'
import CharacterBrick from './CharacterBrick'
import EffectsBrick from './EffectsBrick'
import FamiliarBrick from './FamiliarBrick'
import GearBrick from './GearBrick'
import StatsBrick from './StatsBrick'
import TrailBrick from './TrailBrick'
import { CalendarIcon } from '@chakra-ui/icons'
import ModifierBrick from './ModifierBrick'

interface BrickInfo {
	brick: () => JSX.Element
	icon?: React.ReactElement<unknown, string | JSXElementConstructor<unknown>>
}

const brickRegistry: { [brickName: string]: BrickInfo } = {
	character: { brick: CharacterBrick },
	effects: { brick: EffectsBrick },
	familiar: { brick: FamiliarBrick },
	gear: { brick: GearBrick },
	modifiers: { brick: ModifierBrick, icon: <CalendarIcon /> },
	stats: { brick: StatsBrick },
	trail: { brick: TrailBrick },
} as const

export type BrickName = keyof typeof brickRegistry

export default brickRegistry
