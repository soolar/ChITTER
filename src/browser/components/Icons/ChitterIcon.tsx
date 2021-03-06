import { Image, Tooltip } from '@chakra-ui/react';
import * as React from 'react';

type BorderType =
	| 'normal'
	| 'has-drops'
	| 'all-drops'
	| 'good'
	| 'warning'
	| 'danger'
	| 'none';

interface ChitterIconArgs {
	image: string;
	tooltip: React.ReactNode;
	borderType?: BorderType;
	specialPath?: boolean;
	extraClass?: string;
	small?: boolean;
}

export default function ChitterIcon({
	image,
	tooltip,
	borderType = 'normal',
	specialPath = false,
	extraClass = '',
	small,
}: ChitterIconArgs) {
	return (
		<Tooltip label={tooltip}>
			<Image
				src={specialPath ? image : `/images/itemimages/${image}`}
				className={`chit-icon${borderType !== 'none' ? ` ${borderType}` : ''}${
					extraClass ? ` ${extraClass}` : ''
				}`}
				alt={image}
				maxWidth={small ? '15px' : undefined}
				maxHeight={small ? '15px' : undefined}
			/>
		</Tooltip>
	);
}
