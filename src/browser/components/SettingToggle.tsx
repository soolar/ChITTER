import { Flex, Switch, Text } from '@chakra-ui/react'
import * as React from 'react'

interface SettingToggleArgs {
	displayText: string
	value: boolean
	setValue: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SettingToggle({
	displayText,
	value,
	setValue,
}: SettingToggleArgs) {
	return (
		<Flex>
			<Switch isChecked={value} onChange={(e) => setValue(e.target.checked)} />
			<Text>{displayText}</Text>
		</Flex>
	)
}
