import { BrowserFamiliar } from './guidelines';

export const nextLevelInfo = (fam: BrowserFamiliar) => {
	for (let i = 2; i <= 20; ++i) {
		const nextGoal = i * i;
		if (nextGoal > fam.experience) {
			const prevGoal = i === 2 ? 0 : (i - 1) * (i - 1);
			return { progress: fam.experience - prevGoal, goal: nextGoal - prevGoal };
		}
	}
	return { progress: 1, goal: 1 };
};
