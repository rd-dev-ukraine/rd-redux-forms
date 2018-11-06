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
                editing: {},
                fields: {
                    field: "124"
                },
                touched: {},
                validated: false
            });

            const expected: ValidFormInfo<OneField> = {
                data: { field: 124 },
                fields: {
                    field: { data: 124, hasCustomErrors: false, isParsed: true, value: "124", visualState: "none" }
                },
                hasCustomErrors: false,
                isValid: true
            };

            result.should.be.eql(expected);
        });
    });
});
