import "mocha";
import "should";

import { createForm, fields, ValidFormInfo } from "../src";

interface OneField {
    field: number | null;
}

describe("Selector", () => {
    const oneFieldForm = createForm<OneField>("One field form", {
        field: fields.int(true)
    });

    describe("fields", () => {
        it("should be valid for valid input", () => {
            const result = oneFieldForm.selector({
                fields: {
                    field: "124"
                },
                formatted: new Set<string>(),
                touched: new Set<string>(),
                validated: false
            });

            const expected: ValidFormInfo<OneField> = {
                data: { field: 124 },
                fields: {
                    field: {
                        data: 124,
                        hasErrors: false,
                        isParsed: true,
                        value: "124",
                        visualState: "none"
                    }
                },
                isValid: true
            };

            result.should.be.eql(expected);
        });
    });
});
