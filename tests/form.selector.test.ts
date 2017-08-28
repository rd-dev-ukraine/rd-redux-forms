import "mocha";
import "should";

import { createForm, fields, ValidFormInfo } from "../src";

interface OneField {
    field: number;
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
                        formattedValue: "124",
                        hasErrors: false,
                        isParsed: true,
                        parsedValue: 124,
                        value: "124",
                        visualState: "none"
                    }
                },
                isValid: true,
            };

            result.should.be.eql(expected);
        });

    });

});
