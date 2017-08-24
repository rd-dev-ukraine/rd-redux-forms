import { FieldConfiguration } from "./api";


export const fields = {
    int: (required: boolean = true): FieldConfiguration<number | null> =>
        ({
            parser(input: string = ""): number | null | undefined {
                input = input.trim();

                if (!input) {
                    return required ? undefined : null;
                }

                const parsed = parseInt(input, 10);
                return isNaN(parsed) ? undefined : parsed;
            },
            formatter(input: number | null | undefined): string {
                if (input === null || input === undefined) {
                    return "";
                }

                return input.toFixed(0);
            }
        }),
    float: (digits: number = 2, required: boolean = true): FieldConfiguration<number | null> =>
        ({
            parser: fields.int(required).parser,
            formatter(input: number | null | undefined): string {
                if (input === null || input === undefined) {
                    return "";
                }

                return input.toFixed(digits);
            }
        }),
    string: (required: boolean = true): FieldConfiguration<string | null> =>
        ({
            parser(input: string = ""): string | null | undefined {
                input = input.trim();

                if (!input) {
                    return required ? undefined : "";
                }

                return input;
            },
            formatter: (input: string | null): string => (input || "").trim(),
        }),
    any: <T>(): FieldConfiguration<T> => ({
        parser: (input: any) => input === undefined ? null : input,
        formatter: (input: any) => input
    })
};