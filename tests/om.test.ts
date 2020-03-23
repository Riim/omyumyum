import { expect } from 'chai';
import om from '../src/OmYumYum';

describe('om', () => {
	it('простая проверка', () => {
		let isNumber = om.number;

		expect(isNumber(1)).to.true;
		expect(isNumber('1')).to.false;
		expect(isNumber(null)).to.false;
		expect(isNumber(undefined)).to.false;
	});

	it('бросает ошибку', () => {
		let isNumber = om.number;
		let isSomeData = om.object.shape({
			prop1: om.array.of(om.object.shape({ prop2: om.boolean.or.number }))
		});

		expect(() => {
			om(isNumber, 1);
		}).to.not.throws();
		expect(() => {
			om(isNumber, '1');
		}).to.throws(TypeError);
		expect(() => {
			om(isSomeData, { prop1: [{ prop2: 1 }, { prop2: '2' }] });
		}).to.throws(TypeError, 'Expected type "boolean" or "number" at "prop1[1].prop2"');
		expect(() => {
			om(om.object, 1);
		}).to.throws(TypeError, 'Expected type "Object"');
	});

	it('бросает ошибку (2)', () => {
		let message = 'Ты ещё слишком маленький/ая';
		let isLegalAge = om.number.and.custom((age: number) => age >= 18 || message);
		let isUserData = om.object.shape({
			name: om.string,
			age: isLegalAge
		});

		expect(() => {
			om(isLegalAge)(18);
		}).to.not.throws();
		expect(() => {
			om(isLegalAge)(17);
		}).to.throws(TypeError, message);
		expect(() => {
			om(isUserData)({ name: 'Марфа', age: 17 });
		}).to.throws(TypeError, message + ' (at "age")');
	});

	it('бросает ошибку (3)', () => {
		let message = 'Ты ещё слишком маленький/ая';
		let isLegalAge = om.number.and.custom({
			validator: (age: number) => age >= 18,
			message
		});

		expect(() => {
			om(isLegalAge)(18);
		}).to.not.throws();
		expect(() => {
			om(isLegalAge)(17);
		}).to.throws(TypeError, message);
	});

	it('.custom()', () => {
		let isOne = om.custom(value => value === 1);

		expect(isOne(1)).to.true;
		expect(isOne(2)).to.false;
		expect(isOne('1')).to.false;
	});

	it('.custom() (2)', () => {
		let isZero = om.number.and.custom(num => num);

		expect(() => {
			om(isZero)(1);
		}).to.not.throws();
	});

	it('.[type].and', () => {
		let isNumberAndString = om.number.and.string;

		expect(isNumberAndString(1)).to.false;
		expect(isNumberAndString('1')).to.false;
	});

	it('.[type].and (2)', () => {
		let isNonZeroString = om.string.and.custom(str => str.length > 0);

		expect(isNonZeroString('')).to.false;
		expect(isNonZeroString('1')).to.true;
	});

	it('.[type].and (3)', () => {
		let isUserData = om.object.shape({ name: om.string }).and.object.shape({ age: om.number });

		expect(isUserData({ name: 'Иванушка' })).to.false;
		expect(isUserData({ age: 20 })).to.false;
		expect(isUserData({ name: 'Иванушка', age: 20 })).to.true;
	});

	it('.[type].or', () => {
		let isNumberOrString = om.number.or.string;

		expect(isNumberOrString(true)).to.false;
		expect(isNumberOrString(1)).to.true;
		expect(isNumberOrString('1')).to.true;
		expect(isNumberOrString(null)).to.false;
		expect(isNumberOrString(undefined)).to.false;
	});

	it('.[type].or.null', () => {
		let isNumberOrNull = om.number.or.null;

		expect(isNumberOrNull(1)).to.true;
		expect(isNumberOrNull('1')).to.false;
		expect(isNumberOrNull(null)).to.true;
		expect(isNumberOrNull(undefined)).to.false;
	});

	it('.[type].or.null.or.undefined', () => {
		let isOptionalNumber = om.number.or.null.or.undefined;

		expect(isOptionalNumber(1)).to.true;
		expect(isOptionalNumber('1')).to.false;
		expect(isOptionalNumber(null)).to.true;
		expect(isOptionalNumber(undefined)).to.true;
	});

	it('.null', () => {
		let isNull = om.null;

		expect(isNull(true)).to.false;
		expect(isNull(false)).to.false;
		expect(isNull(null)).to.true;
		expect(isNull(undefined)).to.false;
	});

	it('.undefined', () => {
		let isUndefined = om.undefined;

		expect(isUndefined(true)).to.false;
		expect(isUndefined(false)).to.false;
		expect(isUndefined(null)).to.false;
		expect(isUndefined(undefined)).to.true;
	});

	it('.vacuum', () => {
		let isVacuum = om.vacuum;

		expect(isVacuum(true)).to.false;
		expect(isVacuum(false)).to.false;
		expect(isVacuum(null)).to.true;
		expect(isVacuum(undefined)).to.true;
	});

	it('.boolean', () => {
		let isBoolean = om.boolean;

		expect(isBoolean(true)).to.true;
		expect(isBoolean(1)).to.false;
		expect(isBoolean('1')).to.false;
	});

	it('.number', () => {
		let isNumber = om.number;

		expect(isNumber(true)).to.false;
		expect(isNumber(1)).to.true;
		expect(isNumber('1')).to.false;
		expect(isNumber(NaN)).to.false;
		expect(isNumber(Infinity)).to.false;
		expect(isNumber(-Infinity)).to.false;
	});

	it('.number.less()', () => {
		let isNumberLess3 = om.number.less(3);

		expect(isNumberLess3(2)).to.true;
		expect(isNumberLess3(3)).to.false;
		expect(isNumberLess3(4)).to.false;
	});

	it('.number.max()', () => {
		let isNumberMax3 = om.number.max(3);

		expect(isNumberMax3(2)).to.true;
		expect(isNumberMax3(3)).to.true;
		expect(isNumberMax3(4)).to.false;
	});

	it('.number.greater()', () => {
		let isNumberGreater3 = om.number.greater(3);

		expect(isNumberGreater3(2)).to.false;
		expect(isNumberGreater3(3)).to.false;
		expect(isNumberGreater3(4)).to.true;
	});

	it('.number.min()', () => {
		let isNumberMin3 = om.number.min(3);

		expect(isNumberMin3(2)).to.false;
		expect(isNumberMin3(3)).to.true;
		expect(isNumberMin3(4)).to.true;
	});

	it('.number.between()', () => {
		let isNumberBetween3to5 = om.number.between(3, 5);

		expect(isNumberBetween3to5(2)).to.false;
		expect(isNumberBetween3to5(3)).to.true;
		expect(isNumberBetween3to5(4)).to.true;
		expect(isNumberBetween3to5(5)).to.true;
		expect(isNumberBetween3to5(6)).to.false;
	});

	it('.number.positive', () => {
		let isPositiveNumber = om.number.positive;

		expect(isPositiveNumber(-1)).to.false;
		expect(isPositiveNumber(0)).to.true;
		expect(isPositiveNumber(1)).to.true;
	});

	it('.number.negative', () => {
		let isPositiveNumber = om.number.negative;

		expect(isPositiveNumber(-1)).to.true;
		expect(isPositiveNumber(0)).to.false;
		expect(isPositiveNumber(1)).to.false;
	});

	it('.number.integer', () => {
		let isIntegerNumber = om.number.integer;

		expect(isIntegerNumber(0)).to.true;
		expect(isIntegerNumber(0.1)).to.false;
		expect(isIntegerNumber(1)).to.true;
	});

	it('.string', () => {
		let isString = om.string;

		expect(isString(true)).to.false;
		expect(isString(1)).to.false;
		expect(isString('1')).to.true;
	});

	it('.string.nonZero', () => {
		let isNonZeroString = om.string.nonZero;

		expect(isNonZeroString('')).to.false;
		expect(isNonZeroString(' ')).to.true;
		expect(isNonZeroString('1')).to.true;
	});

	it('.string.nonEmpty', () => {
		let isNonEmptyString = om.string.nonEmpty;

		expect(isNonEmptyString('')).to.false;
		expect(isNonEmptyString(' ')).to.false;
		expect(isNonEmptyString('1')).to.true;
		expect(isNonEmptyString(' 1 ')).to.true;
	});

	it('.string.len()', () => {
		let isStringLen3 = om.string.len(3);

		expect(isStringLen3('12')).to.false;
		expect(isStringLen3('123')).to.true;
		expect(isStringLen3('1234')).to.false;
	});

	it('.string.minLen()', () => {
		let isStringMinLen3 = om.string.minLen(3);

		expect(isStringMinLen3('12')).to.false;
		expect(isStringMinLen3('123')).to.true;
		expect(isStringMinLen3('1234')).to.true;
	});

	it('.string.maxLen()', () => {
		let isStringMaxLen3 = om.string.maxLen(3);

		expect(isStringMaxLen3('12')).to.true;
		expect(isStringMaxLen3('123')).to.true;
		expect(isStringMaxLen3('1234')).to.false;
	});

	it('.string.pattern()', () => {
		let isAbcString = om.string.pattern(/^abc$/);

		expect(isAbcString('abc')).to.true;
		expect(isAbcString('zabcz')).to.false;
	});

	it('.string.matches()', () => {
		let isAbcString = om.string.matches(/^abc$/);

		expect(isAbcString('abc')).to.true;
		expect(isAbcString('zabcz')).to.false;
	});

	it('.string.startsWith()', () => {
		let isStringStartsWithAbc = om.string.startsWith('abc');

		expect(isStringStartsWithAbc('abczz')).to.true;
		expect(isStringStartsWithAbc('zabcz')).to.false;
	});

	it('.string.endsWith()', () => {
		let isStringEndsWithAbc = om.string.endsWith('abc');

		expect(isStringEndsWithAbc('zzabc')).to.true;
		expect(isStringEndsWithAbc('zabcz')).to.false;
	});

	it('.symbol', () => {
		let isSymbol = om.symbol;

		expect(isSymbol(Symbol())).to.true;
		expect(isSymbol('1')).to.false;
	});

	it('.object', () => {
		let isObject = om.object;

		expect(isObject({})).to.true;
		expect(isObject(() => {})).to.true;
	});

	it('.object.shape()', () => {
		let isUserData = om.object.shape({
			name: om.string,
			age: om.number.or.vacuum
		});

		expect(isUserData({})).to.false;
		expect(isUserData({ age: 1 })).to.false;
		expect(isUserData({ name: 1 })).to.false;
		expect(isUserData({ name: 'Иванушка' })).to.true;
		expect(isUserData({ name: 'Иванушка', age: 1 })).to.true;
		expect(isUserData({ name: 'Иванушка', age: null })).to.true;
		expect(isUserData({ name: 'Иванушка', age: '1' })).to.false;
		expect(isUserData({ name: 'Иванушка', age: 1, friends: [] })).to.true;

		expect(() => {
			let isNumericObject = om.object.values(om.number);
			om(isNumericObject, { prop1: 1, prop2: '2' });
		}).to.throws(TypeError, 'Expected type "number" at "prop2"');
	});

	it('.object.exactShape()', () => {
		let isUserData = om.object.exactShape({
			name: om.string,
			age: om.number.or.vacuum
		});

		expect(isUserData({ name: 'Иванушка', age: 1, friends: [] })).to.false;
	});

	it('.object.keys()', () => {
		let isObjectWithAlphaKeys = om.object.keys(/^[a-zA-Z]+$/);

		expect(isObjectWithAlphaKeys({ a: 1, b: 2, c: 3 })).to.true;
		expect(isObjectWithAlphaKeys({ a: 1, b: 2, _c: 3 })).to.false;
	});

	it('.object.values()', () => {
		let isObjectWithNumericValues = om.object.values(om.number);

		expect(isObjectWithNumericValues({ a: 1, b: 2, c: 3 })).to.true;
		expect(isObjectWithNumericValues({ a: 1, b: 2, c: '3' })).to.false;
		expect(isObjectWithNumericValues({ a: 1, b: 2, c: null })).to.false;
		expect(isObjectWithNumericValues({ a: 1, b: 2, c: undefined })).to.false;
	});

	it('.object.nonEmpty', () => {
		let isNonEmptyObject = om.object.nonEmpty;

		expect(isNonEmptyObject({})).to.false;
		expect(isNonEmptyObject({ a: 1 })).to.true;
	});

	it('.array', () => {
		let isArray = om.array;
		expect(isArray([])).to.true;
	});

	it('.array.of()', () => {
		let isNumericArray = om.array.of(om.number);

		expect(isNumericArray([])).to.true;
		expect(isNumericArray([1])).to.true;
		expect(isNumericArray([1, 2])).to.true;
		expect(isNumericArray(['1'])).to.false;
		expect(isNumericArray([1, '2'])).to.false;

		expect(() => {
			om(isNumericArray, [1, '2']);
		}).to.throws(TypeError, 'Expected type "number" at "[1]"');
	});

	it('.array.of() (2)', () => {
		let isArrayOfNumberAndString = om.array.of(om.number.or.string);

		expect(isArrayOfNumberAndString([])).to.true;
		expect(isArrayOfNumberAndString([1])).to.true;
		expect(isArrayOfNumberAndString([1, 2])).to.true;
		expect(isArrayOfNumberAndString(['1'])).to.true;
		expect(isArrayOfNumberAndString([1, '2'])).to.true;
		expect(isArrayOfNumberAndString([true])).to.false;
		expect(isArrayOfNumberAndString([1, false])).to.false;
	});

	it('.array.len()', () => {
		let isArrayLen3 = om.array.len(3);

		expect(isArrayLen3([1, 2])).to.false;
		expect(isArrayLen3([1, 2, 3])).to.true;
		expect(isArrayLen3([1, 2, 3, 4])).to.false;
	});

	it('.array.minLen()', () => {
		let isArrayMinLen3 = om.array.minLen(3);

		expect(isArrayMinLen3([1, 2])).to.false;
		expect(isArrayMinLen3([1, 2, 3])).to.true;
		expect(isArrayMinLen3([1, 2, 3, 4])).to.true;
	});

	it('.array.maxLen()', () => {
		let isArrayMaxLen3 = om.array.maxLen(3);

		expect(isArrayMaxLen3([1, 2])).to.true;
		expect(isArrayMaxLen3([1, 2, 3])).to.true;
		expect(isArrayMaxLen3([1, 2, 3, 4])).to.false;
	});

	it('.array.nonEmpty', () => {
		let isNonEmptyArray = om.array.nonEmpty;

		expect(isNonEmptyArray([])).to.false;
		expect(isNonEmptyArray([1])).to.true;
	});

	it('.function', () => {
		let isFunction = om.function;

		expect(isFunction({})).to.false;
		expect(isFunction(() => {})).to.true;
	});

	it('.func', () => {
		let isFunction = om.func;

		expect(isFunction({})).to.false;
		expect(isFunction(() => {})).to.true;
	});

	it('.map', () => {
		let isMap = om.map;

		expect(isMap({})).to.false;
		expect(isMap(new Map())).to.true;
	});

	it('.map.keys()', () => {
		let isMapWithNumericKeys = om.map.keys(om.number);

		expect(
			isMapWithNumericKeys(
				new Map<any, number>([
					[1, 1],
					['2', 2]
				])
			)
		).to.false;
		expect(
			isMapWithNumericKeys(
				new Map<number, any>([
					[1, 1],
					[2, '2']
				])
			)
		).to.true;

		expect(() => {
			om(
				isMapWithNumericKeys,
				new Map<any, number>([['1', 1]])
			);
		}).to.throws(TypeError, 'Expected type "number" at "[1]"');
	});

	it('.map.values()', () => {
		let isNumericMap = om.map.values(om.number);

		expect(
			isNumericMap(
				new Map<any, number>([
					[1, 1],
					['2', 2]
				])
			)
		).to.true;
		expect(
			isNumericMap(
				new Map<number, any>([
					[1, 1],
					[2, '2']
				])
			)
		).to.false;

		expect(() => {
			om(
				isNumericMap,
				new Map<number, any>([[1, '1']])
			);
		}).to.throws(TypeError, 'Expected type "number" at "[1]"');
	});

	it('.map.nonEmpty', () => {
		let isNonEmptyMap = om.map.nonEmpty;

		expect(isNonEmptyMap(new Map())).to.false;
		expect(isNonEmptyMap(new Map([[1, 1]]))).to.true;
	});

	it('.set', () => {
		let isSet = om.set;

		expect(isSet({})).to.false;
		expect(isSet(new Set())).to.true;
	});

	it('.set.of()', () => {
		let isNumericSet = om.set.of(om.number);

		expect(
			isNumericSet(
				new Set<number>([1, 1])
			)
		).to.true;
		expect(
			isNumericSet(
				new Set<any>([1, '2'])
			)
		).to.false;

		expect(() => {
			om(
				isNumericSet,
				new Set<any>([1, '2'])
			);
		}).to.throws(TypeError, 'Expected type "number" at "[1]"');
	});

	it('.set.nonEmpty', () => {
		let isNonEmptySet = om.set.nonEmpty;

		expect(isNonEmptySet(new Set())).to.false;
		expect(isNonEmptySet(new Set([1]))).to.true;
	});

	it('.weakMap', () => {
		let isWeakMap = om.weakMap;

		expect(isWeakMap({})).to.false;
		expect(isWeakMap(new Map())).to.false;
		expect(isWeakMap(new WeakMap())).to.true;
	});

	it('.wmap', () => {
		let isWeakMap = om.wmap;

		expect(isWeakMap({})).to.false;
		expect(isWeakMap(new Map())).to.false;
		expect(isWeakMap(new WeakMap())).to.true;
	});

	it('.weakSet', () => {
		let isWeakSet = om.weakSet;

		expect(isWeakSet({})).to.false;
		expect(isWeakSet(new Set())).to.false;
		expect(isWeakSet(new WeakSet())).to.true;
	});

	it('.wset', () => {
		let isWeakSet = om.wset;

		expect(isWeakSet({})).to.false;
		expect(isWeakSet(new Set())).to.false;
		expect(isWeakSet(new WeakSet())).to.true;
	});

	it('.date', () => {
		let isDate = om.date;

		expect(isDate({})).to.false;
		expect(isDate(new Date())).to.true;
	});

	it('.date.before()', () => {
		let now = Date.now();
		let isDateBeforeNow = om.date.before(new Date(now));

		expect(isDateBeforeNow(new Date(now))).to.false;
		expect(isDateBeforeNow(new Date(now - 100))).to.true;
		expect(isDateBeforeNow(new Date(now + 100))).to.false;
	});

	it('.date.after()', () => {
		let now = Date.now();
		let isDateAfterNow = om.date.after(new Date(now));

		expect(isDateAfterNow(new Date(now))).to.false;
		expect(isDateAfterNow(new Date(now - 100))).to.false;
		expect(isDateAfterNow(new Date(now + 100))).to.true;
	});

	it('.date.after()', () => {
		let isDate = om.date;

		expect(isDate({})).to.false;
		expect(isDate(new Date())).to.true;
	});

	it('.regExp', () => {
		let isRegExp = om.regExp;

		expect(isRegExp({})).to.false;
		expect(isRegExp(/a/)).to.true;
	});

	it('.regex', () => {
		let isRegExp = om.regex;

		expect(isRegExp({})).to.false;
		expect(isRegExp(/a/)).to.true;
	});

	it('.promise', () => {
		let isPromise = om.promise;

		expect(isPromise({})).to.false;
		expect(isPromise(Promise.resolve())).to.true;
	});

	it('.error', () => {
		let isError = om.error;

		expect(isError({})).to.false;
		expect(isError(new Error())).to.true;
		expect(isError(new TypeError())).to.true;
	});

	it('.[type].and (3)', () => {
		let isUserData = om.object.shape({
			name: om.string,
			age: om.number.or.vacuum
		});
		const isImprovedUserData = isUserData.and.object.shape({
			friends: om.array.of(isUserData).or.undefined
		});

		expect(
			isImprovedUserData({
				name: 'Иванушка',
				age: 20,
				friends: [{ name: 'Алёнушка', age: 18 }]
			})
		).to.true;
		expect(
			isImprovedUserData({
				name: 'Иванушка',
				age: 20,
				friends: [{ name: 'Марфа' }]
			})
		).to.true;
		expect(
			isImprovedUserData({
				name: 'Иванушка',
				age: 20,
				friends: [{ age: 18 }]
			})
		).to.false;
	});

	it('.allow()', () => {
		let isNumberOrString1OrNaN = om.number.allow('1').allow(NaN);

		expect(isNumberOrString1OrNaN(1)).to.true;
		expect(isNumberOrString1OrNaN('1')).to.true;
		expect(isNumberOrString1OrNaN('2')).to.false;
		expect(isNumberOrString1OrNaN(NaN)).to.true;
	});

	it('.notAllow()', () => {
		let isNumberNot2 = om.number.notAllow(2);

		expect(isNumberNot2(1)).to.true;
		expect(isNumberNot2(2)).to.false;
		expect(isNumberNot2(3)).to.true;
	});

	it('.oneOf()', () => {
		let isNumberOrString1OrNaN = om.number.oneOf(['1', NaN]);

		expect(isNumberOrString1OrNaN(1)).to.true;
		expect(isNumberOrString1OrNaN('1')).to.true;
		expect(isNumberOrString1OrNaN('2')).to.false;
		expect(isNumberOrString1OrNaN(NaN)).to.true;
	});

	it('.notOneOf()', () => {
		let isNumberNot2AndNot3 = om.number.notOneOf([2, 3]);

		expect(isNumberNot2AndNot3(1)).to.true;
		expect(isNumberNot2AndNot3(2)).to.false;
		expect(isNumberNot2AndNot3(3)).to.false;
		expect(isNumberNot2AndNot3(4)).to.true;
	});

	it('.not.[type]', () => {
		let isNotNull = om.not.null;

		expect(isNotNull(true)).to.true;
		expect(isNotNull(false)).to.true;
		expect(isNotNull(null)).to.false;
		expect(isNotNull(undefined)).to.true;
	});
});
