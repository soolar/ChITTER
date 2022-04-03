import { Image, Tooltip } from '@chakra-ui/react';
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
	tooltip: string;
	borderType?: BorderType;
	specialPath?: boolean;
}

export default function Icon({
	image,
	tooltip,
	borderType = 'normal',
	specialPath = false,
}: IconArgs) {
	return (
		<Tooltip label={tooltip}>
			<Image
				src={specialPath ? image : `/images/itemimages/${image}`}
				className={`chit-icon ${borderType}`}
				alt={tooltip}
			/>
		</Tooltip>
	);
}
