export const isNonZeroLength = (obj: { length: number }): boolean => obj.length != 0;
export const isNonZeroSize = (obj: { size: number }): boolean => obj.size != 0;

// istanbul ignore next
export const findLast = <T>(arr: Array<T>, cb: (item: T, index: number) => any) => {
	let index = arr.length - 1;

	if (index >= 0) {
		for (; ; index--) {
			if (cb(arr[index], index)) {
				return arr[index];
			}

			if (index == 0) {
				break;
			}
		}
	}

	return;
};
