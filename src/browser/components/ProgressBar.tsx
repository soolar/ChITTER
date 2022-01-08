import * as React from 'react';

interface ProgressBarArgs {
	value: number;
	max: number;
}

export default function ProgressBar({ value, max }: ProgressBarArgs) {
	const width = (100 * value) / max;
	return (
		<div title={`${value} / ${max}`} className="progress-bar">
			<div className="progress-content" style={{ width: `${width}%` }}></div>
		</div>
	);
}
