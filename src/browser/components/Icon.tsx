import * as React from 'react';

type BorderType =
	| 'normal'
	| 'has-drops'
	| 'all-drops'
	| 'good'
	| 'warning'
	| 'danger';

interface IconArgs {
	image: string;
	title: string;
	borderType?: BorderType;
	specialPath?: boolean;
}

export default function Icon({
	image,
	title,
	borderType = 'normal',
	specialPath = false,
}: IconArgs) {
	return (
		<img
			src={specialPath ? image : `/images/itemimages/${image}`}
			className={`chit-icon ${borderType}`}
			title={title}
		/>
	);
}
