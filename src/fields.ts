import { FieldConfiguration } from "./api";

export const fields = {
    /**
     * A field which doesn't change a value received from the editor.
     * Usable if editor returns a data in the required format.
     */
    any: <T>(): FieldConfiguration<T> => ({
        formatter: (input: any) => input,
        parser: (input: any) => input
    }),

    float: (
        digits: number = 2,
        required: boolean = true,
        errorMessage?: string
    ): FieldConfiguration<number | null> => ({
        parser(input: string = ""): number | null {
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
        formatter(input: number | null | undefined): string {
            if (input === null || input === undefined) {
                return "";
            }

            return input.toFixed(digits);
        }
    }),

    /** Binds a integer number to a text input. */
    int: (required: boolean = true, errorMessage?: string): FieldConfiguration<number | null> => ({
        parser(input: string = ""): number | null {
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
        },
        formatter(input: number | undefined | null): string {
            if (input === undefined || input === null) {
                return "";
            }

            return input.toFixed(0);
        }
    }),

    string: (required: boolean = true, errorMessage?: string): FieldConfiguration<string | null> => ({
        parser(input: string = ""): string {
            input = input || "";

            if (!input.trim() && required) {
                throw new Error(errorMessage || "Value is required");
            }

            return input;
        },
        formatter: (input: string | null): string => input || ""
    })
};
