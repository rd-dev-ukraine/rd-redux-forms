import "mocha";
import { Action } from "redux";
import "should";
import { createForm, FieldInfo, fields } from "../src";

interface OneField {
    field: number | null;
}

interface BugFields {
    amount: number;
}

describe("Form unformatter test", () => {
    const form = createForm<OneField>("One field form", {
        field: {
            parse: fields.float(2, true).parse,
            formatForDisplay(value) {
                return (value || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    useGrouping: true
                });
            },
            formatForEditing(value: string) {
                if (value === "0") {
                    return "";
                }

                return value;
            }
        }
    });

    const buggableForm = createForm<BugFields>("BUG FORM TEST", {
        amount: {
            ...fields.float(2, true),
            formatForDisplay(value: any) {
                if (value === null || value === undefined || (value as any) === "") {
                    return "";
                }

                return (fields as any).float(2, true).formatForDisplay(value);
            },
            formatForEditing(value: any) {
                if (value === 0 || value === "0" || parseFloat(value) === 0) {
                    return "";
                }

                return value;
            }
        } as any
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

        it("should have unformatted value due editing", () => {
            const data = applyActions([
                form.actions.fieldEdit("field", "1234", undefined),
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

        it("should have unformatted value with decimals due editing", () => {
            const data = applyActions([
                form.actions.fieldEdit("field", "1234.01", undefined),
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

        it("should display empty string for empty value due editing", () => {
            const data = applyActions([
                form.actions.fieldEdit("field", "", undefined),
                form.actions.fieldStartEditing("field", undefined)
            ]);
            data.isValid.should.be.false();
            data.fields.field.should.be.eql({
                errors: ["Value is required."],
                hasCustomErrors: false,
                isParsed: false,
                value: "",
                visualState: "none"
            } as FieldInfo);
        });

        it("should display empty string for zero value due editing", () => {
            const data = applyActions([
                form.actions.fieldEdit("field", "0", undefined),
                form.actions.fieldStartEditing("field", undefined)
            ]);
            data.isValid.should.be.true();
            data.fields.field.should.be.eql({
                data: 0,
                hasCustomErrors: false,
                isParsed: true,
                value: "",
                visualState: "none"
            } as FieldInfo);
        });

        it("should display '0.00' for zero if not editing", () => {
            const data = applyActions([form.actions.fieldEdit("field", "0", undefined)]);
            data.isValid.should.be.true();
            data.fields.field.should.be.eql({
                data: 0,
                hasCustomErrors: false,
                isParsed: true,
                value: "0.00",
                visualState: "none"
            } as FieldInfo);
        });
    });

    describe("reproduce bug with editing", () => {
        it("should have an empty string value on start editing", () => {
            let state = buggableForm.state.withData({
                amount: 0
            });
            state = buggableForm.reducer(state, buggableForm.actions.fieldStartEditing("amount"));

            const result = buggableForm.selector(state);

            result.fields.amount.value.should.be.eql("");
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
