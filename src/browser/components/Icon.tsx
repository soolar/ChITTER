import * as React from "react";

interface IconArgs {
	image: string;
	specialPath?: boolean;
}

export default function Icon({image, specialPath}: IconArgs) {
	return (
		<img
			src={specialPath ? image : `/images/itemimages/${image}`}
			className="chit-icon"
		/>
	)
}
