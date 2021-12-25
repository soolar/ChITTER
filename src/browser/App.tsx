import * as React from "react";
import {
	BrowserFamiliar,
	BrowserList,
} from '../Guidelines'

declare const familiars: BrowserList<BrowserFamiliar>;

function App() {
	const favoriteFamiliars = familiars.favorites.map((fam) => {
		return (
			<img src={`/images/itemimages/${fam.image}`} />
		)
	});

	return (
		<div id="chitterContainer">
			{favoriteFamiliars}
		</div>
	);
}

export default App;
