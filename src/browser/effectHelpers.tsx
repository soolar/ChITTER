import * as React from 'react'
import { BrowserEffect } from '../guidelines'
import { parseMods } from '../utils'

interface ExtraEffectInfo {
	mods: string
	desc?: React.ReactNode
}

export function getExtraEffectInfo(eff: BrowserEffect): ExtraEffectInfo {
	const res: ExtraEffectInfo = { mods: eff.mods }

	switch (eff.name.toLowerCase()) {
		case 'video... games?': {
			res.mods = 'Basically Everything +5'
			break
		}
	}

	res.mods = parseMods(res.mods)

	return res
}
