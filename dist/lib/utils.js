export const isNonZeroLength = (obj) => obj.length != 0;
export const isNonZeroSize = (obj) => obj.size != 0;
// istanbul ignore next
export const findLast = (arr, cb) => {
    let index = arr.length - 1;
    if (index >= 0) {
        for (;; index--) {
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
