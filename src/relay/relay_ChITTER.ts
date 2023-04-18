import { print, visitUrl } from 'kolmafia'
import { write } from 'kolmafia'
import { buildCharacter } from '../character'
import {
	buildStringFromGuidelines,
	classGuidelines,
	effectGuidelines,
	familiarGuidelines,
	itemGuidelines,
	locationGuidelines,
	skillGuidelines,
	slotGuidelines,
	thrallGuidelines,
} from '../guidelines'
import parseCharpaneData from '../parseCharpaneData'
import { buildGearCategories, buildProperties } from '../properties'

export function main(): void {
	const baseCharpane = visitUrl('charpane.php', false)

	write(`<!DOCTYPE html>
<html lang="">
	<head>
		<title>ChITTER</title>
		<link rel="stylesheet" href="/ChITTER/main.css">
		<script type="text/javascript">
${buildStringFromGuidelines(itemGuidelines)}
${buildStringFromGuidelines(effectGuidelines)}
${buildStringFromGuidelines(familiarGuidelines)}
${buildStringFromGuidelines(skillGuidelines)}
${buildStringFromGuidelines(slotGuidelines)}
${buildStringFromGuidelines(thrallGuidelines)}
${buildStringFromGuidelines(classGuidelines)}
${buildStringFromGuidelines(locationGuidelines)}
${buildGearCategories()}
${buildProperties()}
${buildCharacter()}
${parseCharpaneData(baseCharpane)}
		</script>
	</head>
	<body>
		<div id="root"></div>
		<script src="./ChITTER/ChITTER.js"></script>
	</body>
</html>`)
}
