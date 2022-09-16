import * as React from 'react'
import { Flex, Spacer } from '@chakra-ui/react'
import { BrowserItem } from '../../guidelines'
import ItemIcon from './Icons/ItemIcon'

interface GearOptionArgs {
	item: BrowserItem
	children: React.ReactNode
}

export default function GearOption({
	item,
	children
}: GearOptionArgs) {
	return <Flex>
		<ItemIcon item={item} />
		<Spacer />
		{children}
	</Flex>
}
