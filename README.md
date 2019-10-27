# Very small schema validation

[![Build status](https://travis-ci.org/Riim/omyumyum.svg?branch=master)](https://travis-ci.org/Riim/omyumyum)
[![Coverage status](https://coveralls.io/repos/github/Riim/omyumyum/badge.svg?branch=master)](https://coveralls.io/github/Riim/omyumyum?branch=master)
[![GZip size](https://badgen.net/bundlephobia/minzip/omyumyum)](https://bundlephobia.com/result?p=omyumyum)
[![Install size](https://packagephobia.now.sh/badge?p=omyumyum)](https://packagephobia.now.sh/result?p=omyumyum)

## Install

```
npm i omyumyum
```

## Examples

```js
import om from 'omyumyum';

const isOptionalNumber = om.number.or.undefined;

isOptionalNumber('1');
// => false
isOptionalNumber(null);
// => false
isOptionalNumber(undefined);
// => true
isOptionalNumber(1);
// => true

om(isOptionalNumber, '1');
// throws TypeError('Expected type "number"')
om(isOptionalNumber, 1);
// Ok

const isNumericArray = om.array.of(om.number);

isNumericArray(['1']);
// => false
isNumericArray([1]);
// => true

om(isNumericArray, [1, 2, '3']);
// Throws TypeError('Expected type "number" at "[2]"').
// Keypath to incorrect data in error message.

const isUserData = om.object.shape({
	name: om.string,
	age: om.number.or.vacuum // `.or.vacuum` == `.or.null.or.undefined`
});

isUserData({});
// => false
isUserData({ age: 20 })
// => false
isUserData({ name: 'Иванушка' });
// => true
isUserData({ name: 'Иванушка', age: null });
// => true
isUserData({ name: 'Иванушка', age: 20 });
// => true

om(isUserData, { name: 'Иванушка', age: '1' });
// throws TypeError('Expected type "number" at "age"')

const isEmailOrPhone = om.custom(require('is-email')).or.custom(require('is-phone'));

isEmailOrPhone('test@test.test');
// => true
```

Use `and` to combine and improvement types:
```js
const isNonZeroString = om.string.and.custom(minLenght(1));

isNonZeroString('');
// => false
isNonZeroString('1');
// => true
```

Use previously created validators:
```js
const isImprovedUserData = isUserData.and.object.shape({
	friends: om.array.of(isUserData).or.undefined
});

isImprovedUserData({
	name: 'Иванушка',
	age: 20,
	friends: [{ name: 'Алёнушка', age: 18 }]
});
// => true
```

Use `not` for type negation:
```js
const isNotVacuum = om.not.null.and.not.undefined; // == `om.not.vacuum`

isNotVacuum(1);
// => true
isNotVacuum(null);
// => false
isNotVacuum(undefined);
// => false
```

## API

```js
type TValidator = (value: any) => boolean;
interface IType {
	(value: any): boolean;
	and: ITypes;
	or: ITypes;
	allow(value: any): IType;
	notAllow(value: any): IType;
	oneOf(values: Array<any>): IType;
	notOneOf(values: Array<any>): IType;
}
```

- ##### om(validator: TValidator, value: any): true;
	Alternative signature: `om(validator: TValidator): (value: any) => true;`
	Returns true if the value is valid and throws a TypeError otherwise. Example:
	```js
	const isNumber = om.number;

	om(isNumber, '1');
	// throws TypeError('Expected type "number"')

	let isNumberOrThrow = om(isNumber);

	isNumberOrThrow('1');
	// throws TypeError('Expected type "number"')
	```
- ##### om.custom(validator: ((value: any) => boolean | string) | { validator: TValidator, message?: string, type?: string }): IType;
	Uses a custom validator. Example:
	```js
	const isUserOrNull = om.custom(value => value instanceof User).or.null;

	isUserOrNull(new User(data));
	// => true
	```
	Return the string as an error message:
	```js
	const isLegalAge = om.number.and.custom(age => age >= 18 || 'You are still too small');

	om(isLegalAge, 17);
	// throws TypeError('You are still too small')
	```
	Use the object with the `message` property as an error message:
	```js
	const isLegalAge = om.number.and.custom({
		validator: gte(18),
		message: 'You are still too small'
	});

	om(isLegalAge, 17);
	// throws TypeError('You are still too small')
	```
	Use the object with the `type` property as the type in an error message:
	```js
	const isType1OrType2 = om.custom({
		validator: type1Validator,
		type: 'type1'
	}).or.custom({
		validator: type2Validator,
		type: 'type2'
	});

	om(isType1OrType2, type3Value);
	// throws TypeError('Expected type "type1" or "type2"')
	```
- ##### om.null: IType;
	Matches a null.
- ##### om.undefined: IType;
	Matches an undefined.
- ##### om.vacuum: IType;
	Same as `om.null.or.undefined`.
- ##### om.boolean: IType;
	Matches a boolean data type.
- ##### om.number: INumberType;
	Matches a number data type except `NaN`, `Infinity` and `-Infinity`.
	```js
	interface INumberType extends IType {
		lt(value: number): INumberType;
		less(value: number): INumberType;
		lte(value: number): INumberType;
		max(value: number): INumberType;
		gt(value: number): INumberType;
		greater(value: number): INumberType;
		gte(value: number): INumberType;
		min(value: number): INumberType;
		inRange(minValue: number, maxValue: number): INumberType;
		between(minValue: number, maxValue: number): INumberType;
		positive: INumberType;
		negative: INumberType;
		integer: INumberType;
	}
	```
	- ###### om.number.lt(value: number): INumberType;
		Number must be less than the specified value.
	- ###### om.number.less(value: number): INumberType;
		Alias for `om.number.lt()`.
	- ###### om.number.lte(value: number): INumberType;
		Number must be less than or equal to the specified value.
	- ###### om.number.max(value: number): INumberType;
		Alias for `om.number.lte()`.
	- ###### om.number.gt(value: number): INumberType;
		Number must be greater than the specified value.
	- ###### om.number.greater(value: number): INumberType;
		Alias for `om.number.gt()`.
	- ###### om.number.gte(value: number): INumberType;
		Number must be greater than or equal to the specified value.
	- ###### om.number.min(value: number): INumberType;
		Alias for `om.number.gte()`.
	- ###### om.number.inRange(minValue: number, maxValue: number): INumberType;
		Number must be in the specified range.
	- ###### om.number.between(minValue: number, maxValue: number): INumberType;
		Alias for `om.number.inRange()`.
	- ###### om.number.positive: INumberType;
		Number must be positive.
	- ###### om.number.negative: INumberType;
		Number must be negative.
	- ###### om.number.integer: INumberType;
		Number must be an integer.
- ##### om.string: IStringType;
	Matches a string data type.
	```js
	interface IStringType extends IType {
		len(value: number): IStringType;
		minLen(value: number): IStringType;
		maxLen(value: number): IStringType;
		pattern(re: RegExp): IStringType;
		matches(re: RegExp): IStringType;
		startsWith(searchString: string, position?: number): IStringType;
		endsWith(searchString: string, position?: number): IStringType;
		nonZero: IStringType;
		nonEmpty: IStringType;
	}
	```
	- ###### om.string.len(value: number): IStringType;
		Length of string must be equal to the specified value.
	- ###### om.string.minLen(value: number): IStringType;
		Length of string must be greater than or equal to the specified value.
	- ###### om.string.maxLen(value: number): IStringType;
		Length of string must be less than or equal to the specified value.
	- ###### om.string.pattern(re: RegExp): IStringType;
		String must match the specified regular expression.
	- ###### om.string.matches(re: RegExp): IStringType;
		Alias for `om.string.pattern()`.
	- ###### om.string.startsWith(searchString: string, position?: number): IStringType;
		String must begin with the specified substring.
	- ###### om.string.endsWith(searchString: string, position?: number): IStringType;
		String must end with the specified substring.
	- ###### om.string.nonZero: IStringType;
		Same as `om.string.min(1)`.
	- ###### om.string.nonEmpty: IStringType;
		Same as `om.string.pattern(/\S/)`.
- ##### om.symbol: IType;
	Matches a symbol data type.
- ##### om.object: IObjectType;
	Matches an object data type.
	```js
	interface IObjectType extends IType {
		shape(shape: Record<string, TValidator>, exact = false): IObjectType;
		exactShape(shape: Record<string, TValidator>): IObjectType;
		keys(re: RegExp): IObjectType;
		values(validator: TValidator): IObjectType;
		nonEmpty: IObjectType;
	}
	```
	- ###### om.object.shape(shape: Record<string, TValidator>, exact = false): IType;
		Object must match the specified shape.
    - ###### om.object.exactShape(shape: Record<string, TValidator>): IType;
		Object must exactly match the specified shape.
    - ###### om.object.keys(re: RegExp): IObjectType;
		Object keys must match the specified regular expression.
    - ###### om.object.values(validator: TValidator): IType;
		Object values must match the specified validator.
    - ###### om.object.nonEmpty: IType;
		Object must have at least one property of its own.
- ##### om.array: IArrayType;
	Matches an array data type.
	```js
	interface IArrayType extends IType {
		of(validator: TValidator): IArrayType;
		nonEmpty: IArrayType;
	}
	```
	- ###### om.array.of(validator: TValidator): IType;
		Array values must match the specified validator.
- ##### om.function: IType;
	Matches a function type.
- ##### om.func: IType;
	Alias for `om.function`.
- ##### om.map: IMapType;
	Matches a `Map` type.
	```js
	interface IMapType extends IType {
		keys(validator: TValidator): IMapType;
		values(validator: TValidator): IMapType;
		nonEmpty: IMapType;
	}
	```
	- ###### om.map.keys(validator: TValidator): IMapType;
		Map keys must match the specified validator.
	- ###### om.map.values(validator: TValidator): IMapType;
		Map values must match the specified validator.
	- ###### om.map.nonEmpty: IMapType;
		Map must not be empty.
- ##### om.set: ISetType;
	Matches a `Set` type.
	```js
	interface ISetType extends IType {
		of(validator: TValidator): ISetType;
		nonEmpty: ISetType;
	}
	```
	- ###### om.set.of(validator: TValidator): ISetType;
		Set values must match the specified validator.
	- ###### om.set.nonEmpty: ISetType;
		Set must not be empty.
- ##### om.weakMap: IMapType;
	Matches a `WeakMap` type.
	- ###### om.weakMap.keys(validator: TValidator): IMapType;
		WeakMap keys must match the specified validator.
	- ###### om.weakMap.values(validator: TValidator): IMapType;
		WeakMap values must match the specified validator.
	- ###### om.weakMap.nonEmpty: IMapType;
		WeakMap must not be empty.
- ##### om.wmap: IMapType;
	Alias for `om.weakMap`.
- ##### om.weakSet: ISetType;
	Matches a `WeakSet` type.
	- ###### om.weakSet.of(validator: TValidator): ISetType;
		WeakSet values must match the specified validator.
	- ###### om.weakSet.nonEmpty: ISetType;
		WeakSet must not be empty.
- ##### om.wset: ISetType;
	Alias for `om.weakSet`.
- ##### om.date: IDateType;
	Matches a `Date` type.
	```js
	interface IDateType extends IType {
		earlier(earlierThanDate: Date | string | number): IDateType;
		later(laterThanDate: Date | string | number): IDateType;
		before(beforeDate: Date | string | number): IDateType;
		after(afterDate: Date | string | number): IDateType;
	}
	```
	- ###### om.date.earlier(beforeDate: Date | string | number): IDateType;
		Date is earlier than the specified date.
	- ###### om.date.later(afterDate: Date | string | number): IDateType;
		Date is later than the specified date.
	- ###### om.date.before(beforeDate: Date | string | number): IDateType;
		Alias for `om.date.earlier()`.
	- ###### om.date.after(afterDate: Date | string | number): IDateType;
		Alias for `om.date.later()`.
- ##### om.regExp: IType;
	Matches a `RegExp` type.
- ##### om.regex: IType;
	Alias for `om.regExp`.
- ##### om.promise: IType;
	Matches a `Promise` type.
- ##### om.error: IType;
	Matches a `Error` type.
