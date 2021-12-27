import * as React from "react";
import Icon from './components/Icon';
import {
	BrowserFamiliar,
	BrowserList,
} from '../guidelines'

declare const familiars: BrowserList<BrowserFamiliar>;

function App() {
	const favoriteFamiliars = familiars.favorites.map((fam) => {
		return (
			<Icon image={fam.image} />
		)
	});

	return (
		<div id="chitterContainer">
			{favoriteFamiliars}
		</div>
	);
}

export default App;
