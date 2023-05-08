export interface BrowserCharpaneData {
	sections: {
		familiar: string
		trail: string
	}
}

export default function parseCharpaneData(source: string) {
	const sections: Record<string, string> = {}

	const findSection = (sectionName: string, patterns: RegExp[]) => {
		// for some reason for (const pattern in patterns) gives me pattern as a string??
		for (let i = 0; i < patterns.length; ++i) {
			const pattern = patterns[i]
			const matches = source.match(pattern)
			if (matches) {
				sections[sectionName] = matches[0]
				break
			}
		}
		if (!sections[sectionName] === undefined) {
			sections[sectionName] = ''
		}
	}

	findSection('familiar', [
		/<p><span class=small><b>Familiar:.+?>none<\/a>\)<\/span>/, // familiar: none
		/<table width=90%.+?Familiar:.+?<\/table><\/center>/, // regular familiar
		/<b>Clancy<\/b>.*?<\/font><\/center>/, // Clancy (Avatar of Boris)
		/<font size=2><b>Companion:<\/b>.*?(?:<\/b><\/font>|none\))/, // Avatar of Jarlsberg
		/<a target=mainpane href=main.php\?action=motorcycle>.*?<\/b>/, // Avatar of Sneaky Pete
		/<p><font size=2><b>Servant:<\/b>.*?<\/p>/, // Actually Ed the Undying
		/<b><a href="famteam.php".*?Manage Team<\/a>/, // Pocket Familiars
		/<p><font size=2><b>Ensorcelee:<\/b><br><img src=.*?<\/b>/, // Darke Gyffte
	])

	findSection('trail', [
		/href="[^"]+" target=mainpane>Last Adventure:<\/a><\/b><\/font><br><table [^>]+>.*?<\/table><font size=1>.*?<\/font>/,
	])

	const res = ['\t\t\tcharpaneData = {\n\t\t\t\tsections: {\n']

	for (const section in sections) {
		res.push(`\t\t\t\t\t${section}: "${
			sections[section]
				.replace(/\\/g, '\\\\')
				.replace(/"/g, '\\"')
				.replace(/\n/g, '\\n')
		}",\n`)
	}

	res.push('\t\t\t\t}\n\t\t\t}')

	return res.join('')
}
