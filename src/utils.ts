export const entries = <TFieldValue>(data: any): Array<[string, TFieldValue]> =>
    Object.keys(data).map((field) => [field, data[field]] as [string, TFieldValue]);

export const isNullOrEmptyArray = (array?: any[]): boolean => !array || !array.length;

export const shallowCompareArrays = (array1: any[] | undefined | null, array2: any[] | undefined | null): boolean => {
    if (array1 === undefined || array1 === null) {
        return array2 === undefined || array2 === null;
    }

    if (array2 === undefined || array2 === null) {
        return array1 === undefined || array2 === null;
    }

    if (array1 === array2) {
        return true;
    }

    if (array1.length !== array2.length) {
        return false;
    }

    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }

    return true;
};

export const shallowCompareObjectsWithSameProps = (obj1: any, obj2: any): boolean => {
    if (obj1 === null || obj1 === undefined) {
        return obj2 === null || obj2 === undefined;
    }

    if (obj2 === null || obj2 === undefined) {
        return obj1 === null || obj1 === undefined;
    }

    for (const prop of Object.keys(obj1)) {
        const v1 = obj1[prop];
        const v2 = obj2[prop];

        if ((v1 === null || v1 === undefined) && (v1 !== null && v2 !== undefined)) {
            return false;
        }

        if (Array.isArray(v1)) {
            if (Array.isArray(v2)) {
                if (!shallowCompareArrays(v1, v2)) {
                    return false;
                } else {
                    continue;
                }
            } else {
                return false;
            }
        }

        if (v1 !== v2) {
            return false;
        }
    }

    return true;
};
