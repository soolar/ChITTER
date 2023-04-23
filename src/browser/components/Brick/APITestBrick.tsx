import * as React from 'react'
import { Text } from '@chakra-ui/react'
import Brick from './Brick'

export default function APITestBrick() {
	const [str, setstr] = React.useState('Loading...')

	fetch('/ChITTERData.js?relay=true', {
		method: 'POST',
		body: new URLSearchParams({
			body: JSON.stringify({
				items: ['cosmic bowling ball', 'Guzzlr tablet'],
				classes: ['Sauceror', 'Pastamancer'],
				properties: ['chit.gear.favorites'],
			}),
		}),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	})
		.then((response) => response.json())
		.then((data) => setstr(JSON.stringify(data)))

	return (
		<Brick name="apitest" header="API Test">
			<Text>{str}</Text>
		</Brick>
	)
}
