import { FieldConfiguration } from "./api";
export declare const fields: {
    any: <T>() => FieldConfiguration<T>;
    float: (digits?: number, required?: boolean) => FieldConfiguration<number | null>;
    int: (required?: boolean) => FieldConfiguration<number | null>;
    string: (required?: boolean) => FieldConfiguration<string | null>;
};
