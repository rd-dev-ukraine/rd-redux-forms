import "mocha";
import { Action } from "redux";
import "should";
import { createForm, FieldInfo, fields } from "../src";

interface OneField {
    field: number | null;
}

describe("Reducer test:", () => {
    const form = createForm<OneField>("One field form", {
        field: fields.int(true)
    });

    describe("form field", () => {
        it("should have a value after edit form value", () => {
            const data = applyActions([form.actions.fieldEdit("field", 1234, undefined)]);
            data.isValid.should.be.true();
            data.fields.field.should.be.eql({
                data: 1234,
                hasErrors: false,
                isParsed: true,
                value: "1234",
                visualState: "none"
            } as FieldInfo);
        });

        it("should correctly parse string", () => {
            const data = applyActions([form.actions.fieldEdit("field", "4321", undefined)]);
            data.isValid.should.be.true();
            data.fields.field.should.be.eql({
                data: 4321,
                hasErrors: false,
                isParsed: true,
                value: "4321",
                visualState: "none"
            } as FieldInfo);
        });

        it("should be valid after validating form", () => {
            const data = applyActions([form.actions.fieldEdit("field", "4321", undefined), form.actions.validate()]);
            data.isValid.should.be.true();
            data.fields.field.should.be.eql({
                data: 4321,
                hasErrors: false,
                isParsed: true,
                value: "4321",
                visualState: "valid"
            } as FieldInfo);
        });

        describe("should be invalid", () => {
            it("but not visually marked if form is not validated", () => {
                const data = applyActions([form.actions.fieldEdit("field", "cant", undefined)]);
                data.isValid.should.be.false();
                if (data.isValid === false) {
                    data.isParsed.should.be.false();
                }

                data.fields.field.should.be.eql({
                    errors: ["Value is not a valid number"],
                    hasErrors: true,
                    isParsed: false,
                    value: "cant",
                    visualState: "none"
                } as FieldInfo);
            });

            it("and visually marked as invalid if form validated", () => {
                const data = applyActions([
                    form.actions.fieldEdit("field", "cant", undefined),
                    form.actions.validate()
                ]);
                data.isValid.should.be.false();
                data.fields.field.should.be.eql({
                    errors: ["Value is not a valid number"],
                    hasErrors: true,
                    isParsed: false,
                    value: "cant",
                    visualState: "invalid"
                } as FieldInfo);
            });

            it("and visually marked as invalid if field is formatted", () => {
                const data = applyActions([
                    form.actions.fieldEdit("field", "cant", undefined),
                    form.actions.fieldFormat("field", undefined)
                ]);
                data.isValid.should.be.false();
                data.fields.field.should.be.eql({
                    errors: ["Value is not a valid number"],
                    hasErrors: true,
                    isParsed: false,
                    value: "cant",
                    visualState: "invalid"
                } as FieldInfo);
            });
        });
    });

    describe("form with external errors", () => {
        it("should have errors in fields if errors are set event if form is not validated", () => {
            const data = applyActions(
                [
                    form.actions.setErrors({
                        fields: {
                            field: ["Value too large"]
                        }
                    })
                ],
                form.state.withData({ field: 1234 })
            );
            data.isValid.should.be.false();
            data.fields.field.should.be.eql({
                data: 1234,
                errors: ["Value too large"],
                hasErrors: true,
                isParsed: true,
                value: "1234",
                visualState: "invalid"
            } as FieldInfo);
        });

        it("should not display error if field is edited", () => {
            const data = applyActions(
                [
                    form.actions.setErrors({
                        fields: {
                            field: ["Value too large"]
                        }
                    }),
                    form.actions.fieldEdit("field", 111, undefined)
                ],
                form.state.withData({ field: 1234 })
            );
            data.isValid.should.be.false();
            data.fields.field.should.be.eql({
                data: 111,
                errors: ["Value too large"],
                hasErrors: true,
                isParsed: true,
                value: "111",
                visualState: "none"
            } as FieldInfo);
        });

        it("should display valid field if value is parsed and formatted", () => {
            const data = applyActions(
                [
                    form.actions.setErrors({
                        fields: {
                            field: ["Value too large"]
                        }
                    }),
                    form.actions.fieldEdit("field", 111, undefined),
                    form.actions.fieldFormat("field", undefined)
                ],
                form.state.withData({ field: 1234 })
            );
            data.isValid.should.be.false();
            data.fields.field.should.be.eql({
                data: 111,
                errors: ["Value too large"],
                hasErrors: true,
                isParsed: true,
                value: "111",
                visualState: "valid"
            } as FieldInfo);
        });
    });

    function applyActions(actions: Action[], state = form.state.empty()): typeof form.types.selectorResult {
        const newState = actions.reduce((intermediateState, action) => form.reducer(intermediateState, action), state);

        return form.selector(newState);
    }
});
