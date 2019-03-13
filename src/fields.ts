import { FieldConfiguration } from "./api";

export const fields = {
    /**
     * A field which doesn't change a value received from the editor.
     * Usable if editor returns a data in the required format.
     */
    any: <T>(): FieldConfiguration<T> => ({}),
    float: (
        digits: number = 2,
        required: boolean = true,
        errorMessage?: string
    ): FieldConfiguration<number | null> => ({
        parse(input: string = ""): number | null {
            if (input === null || input === undefined || input === "") {
                if (required) {
                    throw new Error(errorMessage || "Value is required.");
                }

                return null;
            }

            if (typeof input === "number") {
                return input;
            }

            input = `${input || ""}`.trim();

            const parsed = parseFloat(input);
            if (isNaN(parsed)) {
                throw new Error(errorMessage || "Value is not a valid number");
            }

            return parsed;
        },
        formatForDisplay(value) {
            if (value === null || value === undefined) {
                return "";
            }

            return value.toFixed(digits);
        }
    }),
    /** Binds a integer number to a text input. */
    int: (required: boolean = true, errorMessage?: string): FieldConfiguration<number | null> => ({
        formatForDisplay(value) {
            if (value === null || value === undefined) {
                return "";
            }

            return value.toFixed(0);
        },
        parse(input: string = ""): number | null {
            if (input === null || input === undefined || input === "") {
                if (required) {
                    throw new Error(errorMessage || "Value is required.");
                }

                return null;
            }

            if (typeof input === "number") {
                return input;
            }

            input = `${input || ""}`.trim();

            const parsed = parseInt(input, 10);
            if (isNaN(parsed)) {
                throw new Error(errorMessage || "Value is not a valid number");
            }

            return parsed;
        }
    }),
    string: (required: boolean = true, errorMessage?: string): FieldConfiguration<string | null> => ({
        formatForDisplay: value => value || "",
        parse(input: string = ""): string {
            input = input || "";

            if (!input.trim() && required) {
                throw new Error(errorMessage || "Value is required");
            }

            return input;
        }
    })
};
