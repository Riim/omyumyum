# Very small schema validation

## Install

```
npm i omnamnam
```

## Examples

```js
import om from 'omnamnam';

const isNumberOrString = om.number.or.string;

isNumberOrString(1);
// => true
isNumberOrString('1');
// => true

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
isUserData({ age: 1 })
// => false
isUserData({ name: 'Иванушка' });
// => true
isUserData({ name: 'Иванушка', age: null });
// => true
isUserData({ name: 'Иванушка', age: 1 });
// => true

om(isUserData, { name: 'Иванушка', age: '1' });
// Throws TypeError('Type mismatch at "age"')

const isEmailOrPhone = om.custom(require('is-email')).or.custom(require('is-phone'));

isEmailOrPhone('test@test.test');
// => true

const isNonZeroString = om.string.and.custom(minLenght(1));

isNonZeroString('');
// => false
isNonZeroString('1');
// => true
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
- ##### om.undefined: IType;
- ##### om.vacuum: IType;
	Same as `om.null.or.undefined`.
- ##### om.boolean: IType;
- ##### om.number: INumberType;
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
	- ###### om.min(minValue: number): INumberType;
	- ###### om.max(maxValue: number): INumberType;
	- ###### om.less(lessThanValue: number): INumberType;
	- ###### om.greater(greaterThanValue: number): INumberType;
	- ###### om.between(minValue: number, maxValue: number): INumberType;
	- ###### om.positive: INumberType;
	- ###### om.negative: INumberType;
	- ###### om.integer: INumberType;
- ##### om.string: IStringType;
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
	- ###### om.nonZero: IStringType;
	- ###### om.nonEmpty: IStringType;
	- ###### om.len(length: number): IStringType;
	- ###### om.min(minLength: number): IStringType;
	- ###### om.max(maxLength: number): IStringType;
	- ###### om.pattern(re: RegExp): IStringType;
- ##### om.symbol: IType;
- ##### om.object: IObjectType;
	```js
	interface IObjectType extends IType {
		shape(shape: Record<string, TValidator>, partial: boolean = false): IType;
		partialShape(shape: Record<string, TValidator>): IType;
		values(validator: TValidator): IType;
	}
	```
	- ###### om.object.shape(shape: Record<string, TValidator>, partial: boolean = false): IType;
    - ###### om.object.partialShape(shape: Record<string, TValidator>): IType;
    - ###### om.object.values(validator: TValidator): IType;
- ##### om.array: IArrayType;
	```js
	interface IArrayType extends IType {
		of(validator: TValidator): IType;
	}
	```
	- ###### om.array.of(validator: TValidator): IType;
- ##### om.function: IType;
- ##### om.func: IType;
	Alias for `om.function`.
- ##### om.map: IMapType;
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
	```js
	interface ISetType extends IType {
		of(validator: TValidator): IType;
	}
	```
	- ###### om.set.of(validator: TValidator): ISetType;
- ##### om.weakMap: IMapType;
	- ###### om.weakMap.of(validator: TValidator): IMapType;
	- ###### om.weakMap.values(validator: TValidator): IMapType;
	- ###### om.weakMap.keys(validator: TValidator): IMapType;
- ##### om.wmap: IMapType;
	Alias for `om.weakMap`.
- ##### om.weakSet: ISetType;
	- ###### om.weakSet.of(validator: TValidator): ISetType;
- ##### om.wset: ISetType;
	Alias for `om.weakSet`.
- ##### om.date: IDateType;
	- ###### om.date.before(beforeDate: Date | string | number): IDateType;
	- ###### om.date.after(afterDate: Date | string | number): IDateType;
- ##### om.regExp: IType;
- ##### om.regex: IType;
	Alias for `om.regExp`.
- ##### om.promise: IType;
- ##### om.error: IType;
