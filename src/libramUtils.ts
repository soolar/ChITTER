import { get } from 'libram';

export function getExtraFamInfo(fam: Familiar) {
	switch (fam.toString()) {
		case 'Melodramedary': {
			const spit = get('camelSpit');
			if (spit >= 100) {
				return { desc: 'Ready to spit!', extraClass: 'has-drops' };
			} else {
				return { desc: `${spit}% charged` };
			}
		}
	}

	return null;
}
