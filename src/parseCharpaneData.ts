import { print } from 'kolmafia';

interface BrowserCharpaneData {
	avatar: string; // TODO: Make this handle You, Robot properly
	title: string;
}

export default function parseCharpaneData(source: string) {
	const sections: Record<string, string> = {};

	const findSection = (sectionName: string, patterns: RegExp[]) => {
		// for some reason for (const pattern in patterns) gives me pattern as a string??
		for (let i = 0; i < patterns.length; ++i) {
			const pattern = patterns[i];
			const matches = source.match(pattern);
			if (matches) {
				sections[sectionName] = matches[0];
				break;
			}
		}
	};

	findSection('familiar', [
		/<p><span class=small><b>Familiar:.+?>none<\/a>\)<\/span>/, // familiar: none
		/<table width=90%.+?Familiar:.+?<\/table><\/center>/, // regular familiar
		/<b>Clancy<\/b>.*?<\/font><\/center>/, // Clancy (Avatar of Boris)
		/<font size=2><b>Companion:<\/b>.*?(?:<\/b><\/font>|none\))/, // Avatar of Jarlsberg
		/<a target=mainpane href=main.php\?action=motorcycle>.*?<\/b>/, // Avatar of Sneaky Pete
		/<p><font size=2><b>Servant:<\/b>.*?<\/p>/, // Actually Ed the Undying
		/<b><a href="famteam.php".*?Manage Team<\/a>/, // Pocket Familiars
		/<p><font size=2><b>Ensorcelee:<\/b><br><img src=.*?<\/b>/, // Darke Gyffte
	]);

	return '';
}
