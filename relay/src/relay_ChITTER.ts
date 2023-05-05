import { visitUrl } from 'kolmafia'
import { write } from 'kolmafia'
import parseCharpaneData from './parseCharpaneData'

export function main(): void {
	const baseCharpane = visitUrl('charpane.php', false)

	write(`<!DOCTYPE html>
<html lang="">
	<head>
		<title>ChITTER</title>
		<script type="text/javascript">
${parseCharpaneData(baseCharpane)}
		</script>
	</head>
	<body>
		<div id="root"></div>
		<script src="./ChITTER/ChITTER.js"></script>
	</body>
</html>`)
}
