import { FieldConfiguration } from "./api";
export declare const fields: {
    int: (required?: boolean) => FieldConfiguration<number | null>;
    float: (digits?: number, required?: boolean) => FieldConfiguration<number | null>;
    string: (required?: boolean) => FieldConfiguration<string | null>;
    any: <T>() => FieldConfiguration<T>;
};
