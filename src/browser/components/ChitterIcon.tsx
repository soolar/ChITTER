import { Image, Tooltip } from '@chakra-ui/react';
import * as React from 'react';

type BorderType =
	| 'normal'
	| 'has-drops'
	| 'all-drops'
	| 'good'
	| 'warning'
	| 'danger';

interface ChitterIconArgs {
	image: string;
	tooltip: React.ReactNode;
	borderType?: BorderType;
	specialPath?: boolean;
	extraClass?: string;
}

export default function ChitterIcon({
	image,
	tooltip,
	borderType = 'normal',
	specialPath = false,
	extraClass = '',
}: ChitterIconArgs) {
	return (
		<Tooltip label={tooltip}>
			<Image
				src={specialPath ? image : `/images/itemimages/${image}`}
				className={`chit-icon ${borderType}${
					extraClass ? ` ${extraClass}` : ''
				}`}
				alt={image}
			/>
		</Tooltip>
	);
}
