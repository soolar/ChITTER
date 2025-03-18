import { Item } from 'kolmafia'
import CurrencyReadout, { SpecialCurrency } from '../CurrencyReadout'
import { $item } from 'libram'
import Picker from './Picker'
import { Text, VStack } from '@chakra-ui/react'

export const currencyList: (Item | SpecialCurrency)[] = [
	'meat',
	'pulls',
	$item`11-leaf clover`,
	$item`Shore Inc. Ship Trip Scrip`,
	$item`rad`,
	$item`hobo nickel`,
	$item`Freddy Kruegerand`,
	$item`Chroner`,
	$item`Beach Buck`,
	$item`Coinspiracy`,
	$item`FunFunds™`,
	$item`Volcoino`,
	$item`Wal-Mart gift certificate`,
	$item`BACON`,
	$item`buffalo dime`,
	$item`Source essence`,
	$item`cop dollar`,
	'timespinnerminutes',
	$item`cashew`,
	$item`sprinkles`,
	$item`Spacegate Research`,
	'asdonfuel',
	$item`X`,
	$item`O`,
	$item`Rubee™`,
	$item`stick of firewood`,
	$item`inflammable leaf`,
	'embers',
]

export default function CurrencyPicker() {
	return (
		<Picker header={<Text>Currencies</Text>}>
			<VStack>
				{currencyList.map((currency) => (
					<CurrencyReadout
						key={`cdrop${
							typeof currency === 'string'
								? currency
								: currency.identifierString
						}`}
						item={currency}
						skipZero
					/>
				))}
			</VStack>
		</Picker>
	)
}
