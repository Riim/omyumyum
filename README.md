# Very small schema validation

## Install

```
npm i omnamnam
```

## Examples

```js
import om from 'omnamnam';

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
// Throws TypeError
om(isOptionalNumber, 1);
// Ok

const isNumericArray = om.array.of(om.number);

isNumericArray(['1']);
// => false
isNumericArray([1]);
// => true

om(isNumericArray, [1, 2, '3']);
// Throws TypeError('Type mismatch at "[2]"')
// Keypath to incorrect data in error message

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
// Throws TypeError('Type mismatch at "age"')

const isEmailOrPhone = om.custom(require('is-email')).or.custom(require('is-phone'));

isEmailOrPhone('test@test.test');
// => true

// Use `and` to combine and improvement types:
const isNonZeroString = om.string.and.custom(minLenght(1));

isNonZeroString('');
// => false
isNonZeroString('1');
// => true

// Use previously created validators:
const isImprovedUserData = isUserData.and.object.shape({
	friends: om.array.of(isUserData).or.undefined
});

isImprovedUserData({
	name: 'Иванушка',
	age: 20,
	friends: [{ name: 'Алёнушка', age: 18 }]
});
// => true

// Use `not` for type negation:
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
	or: ITypes;
	and: ITypes;
	allow(value: any): IType;
}
```

- ##### om(validator: TValidator, value: any): true;
	Returns true if the value is valid, and throws a TypeError otherwise.
- ##### om.custom(validator: TValidator): IType;
	Uses a custom validator. Example:
	```js
	const isUserOrNull = om.custom(value => value instanceof User).or.null;

	isUserOrNull(new User(data));
	// => true
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
		min(minValue: number): INumberType;
		max(maxValue: number): INumberType;
		less(lessThanValue: number): INumberType;
		greater(greaterThanValue: number): INumberType;
		between(minValue: number, maxValue: number): INumberType;
		positive: INumberType;
		negative: INumberType;
		integer: INumberType;
	}
	```
	- ###### om.number.min(minValue: number): INumberType;
	- ###### om.number.max(maxValue: number): INumberType;
	- ###### om.number.less(lessThanValue: number): INumberType;
	- ###### om.number.greater(greaterThanValue: number): INumberType;
	- ###### om.number.between(minValue: number, maxValue: number): INumberType;
	- ###### om.number.positive: INumberType;
	- ###### om.number.negative: INumberType;
	- ###### om.number.integer: INumberType;
- ##### om.string: IStringType;
	Matches a string data type.
	```js
	interface IStringType extends IType {
		nonZero: IStringType;
		nonEmpty: IStringType;
		len(length: number): IStringType;
		min(minLength: number): IStringType;
		max(maxVength: number): IStringType;
		pattern(re: RegExp): IStringType;
	}
	```
	- ###### om.string.nonZero: IStringType;
		Same as `om.string.min(1)`.
	- ###### om.string.nonEmpty: IStringType;
		Same as `om.string.pattern(/\S/)`.
	- ###### om.string.len(length: number): IStringType;
	- ###### om.string.min(minLength: number): IStringType;
	- ###### om.string.max(maxLength: number): IStringType;
	- ###### om.string.pattern(re: RegExp): IStringType;
- ##### om.symbol: IType;
	Matches a symbol data type.
- ##### om.object: IObjectType;
	Matches an object data type.
	```js
	interface IObjectType extends IType {
		shape(shape: Record<string, TValidator>, exact = false): IObjectType;
		exactShape(shape: Record<string, TValidator>): IObjectType;
		values(validator: TValidator): IObjectType;
	}
	```
	- ###### om.object.shape(shape: Record<string, TValidator>, exact = false): IType;
    - ###### om.object.exactShape(shape: Record<string, TValidator>): IType;
    - ###### om.object.values(validator: TValidator): IType;
- ##### om.array: IArrayType;
	Matches an array data type.
	```js
	interface IArrayType extends IType {
		of(validator: TValidator): IType;
	}
	```
	- ###### om.array.of(validator: TValidator): IType;
- ##### om.function: IType;
	Matches a function type.
- ##### om.func: IType;
	Alias for `om.function`.
- ##### om.map: IMapType;
	Matches a `Map` type.
	```js
	interface IMapType extends IType {
		of(validator: TValidator): IType;
		values(validator: TValidator): IType;
		keys(validator: TValidator): IType;
	}
	```
	- ###### om.map.of(validator: TValidator): IMapType;
	- ###### om.map.values(validator: TValidator): IMapType;
	- ###### om.map.keys(validator: TValidator): IMapType;
- ##### om.set: ISetType;
	Matches a `Set` type.
	```js
	interface ISetType extends IType {
		of(validator: TValidator): IType;
	}
	```
	- ###### om.set.of(validator: TValidator): ISetType;
- ##### om.weakMap: IMapType;
	Matches a `WeakMap` type.
	- ###### om.weakMap.of(validator: TValidator): IMapType;
	- ###### om.weakMap.values(validator: TValidator): IMapType;
	- ###### om.weakMap.keys(validator: TValidator): IMapType;
- ##### om.wmap: IMapType;
	Alias for `om.weakMap`.
- ##### om.weakSet: ISetType;
	Matches a `WeakSet` type.
	- ###### om.weakSet.of(validator: TValidator): ISetType;
- ##### om.wset: ISetType;
	Alias for `om.weakSet`.
- ##### om.date: IDateType;
	Matches a `Date` type.
	- ###### om.date.before(beforeDate: Date | string | number): IDateType;
	- ###### om.date.after(afterDate: Date | string | number): IDateType;
- ##### om.regExp: IType;
	Matches a `RegExp` type.
- ##### om.regex: IType;
	Alias for `om.regExp`.
- ##### om.promise: IType;
	Matches a `Promise` type.
- ##### om.error: IType;
	Matches a `Error` type.
