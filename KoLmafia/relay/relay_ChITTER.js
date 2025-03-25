/* eslint-env commonjs */

const { getRevision, write } = require('kolmafia')

function main() {
	write(
		'<html><body><script>' +
			`window.parent.parent.revision = ${getRevision()};` +
			'window.parent.parent.frames.mainpane.location.href = "/chitter/load.html";' +
			'</script></body></html>',
	)
}

module.exports.main = main
