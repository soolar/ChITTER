import React from 'react'

export default function useToggle(
	name: string,
	defaultValue: boolean,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
	const trueName = `chitter.${name}`
	const storedValue = window.localStorage.getItem(trueName)
	const startingValue =
		storedValue !== null ? JSON.parse(storedValue) : defaultValue
	const [value, setValue] = React.useState(startingValue)

	React.useEffect(() => {
		window.localStorage.setItem(trueName, JSON.stringify(value))
	}, [value])

	return [value, setValue]
}
