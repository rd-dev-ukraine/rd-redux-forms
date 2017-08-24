export const entries =
    <TFieldValue>(data: any): Array<[string, TFieldValue]> =>
        Object.keys(data)
            .map((field) => ([field, data[field]]) as [string, TFieldValue]);

export const isNullOrEmptyArray =
    (array?: any[]): boolean => !array || !array.length;
