import {
	write,
} from 'kolmafia';
import {
	buildCharacter,
} from '../character';
import {
	buildStringFromGuidelines,
	effectGuidelines,
	familiarGuidelines,
	itemGuidelines,
	skillGuidelines,
	slotGuidelines,
	thrallGuidelines,
} from '../guidelines';
import {
	buildProperties
} from '../properties';

export function main(): void {
write(`<!DOCTYPE html>
<html lang="">
	<head>
		<title>ChITTER</title>
		<link rel="stylesheet" href="/ChITTER/main.css">
		<script>
${buildStringFromGuidelines(itemGuidelines)}
${buildStringFromGuidelines(effectGuidelines)}
${buildStringFromGuidelines(familiarGuidelines)}
${buildStringFromGuidelines(skillGuidelines)}
${buildStringFromGuidelines(slotGuidelines)}
${buildStringFromGuidelines(thrallGuidelines)}
${buildProperties()}
${buildCharacter()}
		</script>
	</head>
	<body>
		<div id="root"></div>
		<script src="./ChITTER/ChITTER.js"></script>
	</body>
</html>`);
}
