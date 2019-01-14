import "mocha";
import { Action } from "redux";
import "should";
import { createForm, FieldInfo, fields } from "../src";

interface OneField {
    field: number | null;
}

describe("Form unformatter test", () => {
    const form = createForm<OneField>("One field form", {
        field: {
            formatter: (value) =>
                (value || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    useGrouping: true
                }),
            parser: fields.float(2, true).parser,
            unformatter: (value) => ((value || 0) === 0 ? "" : (value || 0).toString())
        }
    });

    describe("form field", () => {
        it("should have formatted value after editing finished", () => {
            const data = applyActions([form.actions.fieldEdit("field", 1234, undefined)]);
            data.isValid.should.be.true();
            data.fields.field.should.be.eql({
                data: 1234,
                hasCustomErrors: false,
                isParsed: true,
                value: "1,234.00",
                visualState: "none"
            } as FieldInfo);
        });

        it("should have formatted value after editing finished", () => {
            const data = applyActions([
                form.actions.fieldEdit("field", 1234, undefined),
                form.actions.fieldStartEditing("field", undefined)
            ]);
            data.isValid.should.be.true();
            data.fields.field.should.be.eql({
                data: 1234,
                hasCustomErrors: false,
                isParsed: true,
                value: "1234",
                visualState: "none"
            } as FieldInfo);
        });

        it("should have formatted value with decimals after editing finished", () => {
            const data = applyActions([
                form.actions.fieldEdit("field", 1234.01, undefined),
                form.actions.fieldStartEditing("field", undefined)
            ]);
            data.isValid.should.be.true();
            data.fields.field.should.be.eql({
                data: 1234.01,
                hasCustomErrors: false,
                isParsed: true,
                value: "1234.01",
                visualState: "none"
            } as FieldInfo);
        });
    });

    function applyActions(
        actions: Action[],
        state = form.state.empty(),
        debug: boolean = false
    ): typeof form.types.selectorResult {
        const newState = actions.reduce((intermediateState, action) => form.reducer(intermediateState, action), state);
        if (debug) {
            // tslint:disable-next-line:no-console
            console.log(newState);
        }
        return form.selector(newState);
    }
});
