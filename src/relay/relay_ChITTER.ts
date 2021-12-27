import {
	write,
} from 'kolmafia';
import {
	buildStringFromGuidelines,
	effectGuidelines,
	familiarGuidelines,
	itemGuidelines,
	skillGuidelines,
	thrallGuidelines,
} from '../guidelines';

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
${buildStringFromGuidelines(thrallGuidelines)}
		</script>
	</head>
	<body>
		<div id="root"></div>
		<script src="./ChITTER/ChITTER.js"></script>
	</body>
</html>`);
}
