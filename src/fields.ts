import { FieldConfiguration } from "./api";

export const fields = {
    /**
     * A field which doesn't change a value received from the editor.
     * Usable if editor returns a data in the required format.
     */
    any: <T>(): FieldConfiguration<T> => ({
        parse: (input: any) => input,
        toDisplay: (info) => info.input
    }),

    float: (
        digits: number = 2,
        required: boolean = true,
        errorMessage?: string
    ): FieldConfiguration<number | null> => ({
        parse(input: string = ""): number | null {
            input = `${input || ""}`.trim();

            if (!input) {
                if (required) {
                    throw new Error(errorMessage || "Value is required.");
                }

                return null;
            }

            const parsed = parseFloat(input);
            if (isNaN(parsed)) {
                throw new Error(errorMessage || "Value is not a valid number");
            }

            return parsed;
        },
        toDisplay(info) {
            if (!info.isParsed) {
                return info.input;
            }

            if (info.parsedValue === null || info.parsedValue === undefined) {
                return "";
            }

            return info.parsedValue.toFixed(digits);
        }
    }),

    /** Binds a integer number to a text input. */
    int: (required: boolean = true, errorMessage?: string): FieldConfiguration<number | null> => ({
        toDisplay(info) {
            if (!info.isParsed) {
                return info.input;
            }

            if (info.parsedValue === null || info.parsedValue === undefined) {
                return "";
            }

            return info.parsedValue.toFixed(0);
        },
        parse(input: string = ""): number | null {
            input = `${input || ""}`.trim();

            if (!input) {
                if (required) {
                    throw new Error(errorMessage || "Value is required.");
                }

                return null;
            }

            const parsed = parseInt(input, 10);
            if (isNaN(parsed)) {
                throw new Error(errorMessage || "Value is not a valid number");
            }

            return parsed;
        }
    }),

    string: (required: boolean = true, errorMessage?: string): FieldConfiguration<string | null> => ({
        toDisplay: (info) => info.input || "",
        parse(input: string = ""): string {
            input = input || "";

            if (!input.trim() && required) {
                throw new Error(errorMessage || "Value is required");
            }

            return input;
        }
    })
};
