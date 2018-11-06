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
                hasCustomErrors: false,
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
                hasCustomErrors: false,
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
                hasCustomErrors: false,
                isParsed: true,
                value: "4321",
                visualState: "valid"
            } as FieldInfo);
        });
    });

    //     describe("should be invalid", () => {
    //         it("but not visually marked if form is not validated", () => {
    //             const data = applyActions([form.actions.fieldEdit("field", "cant", undefined)]);
    //             data.isValid.should.be.false();

    //             data.fields.field.should.be.eql({
    //                 errors: ["Value is not a valid number"],
    //                 hasCustomErrors: true,
    //                 isParsed: false,
    //                 value: "cant",
    //                 visualState: "none"
    //             } as FieldInfo);
    //         });

    //         it("and visually marked as invalid if form validated", () => {
    //             const data = applyActions([
    //                 form.actions.fieldEdit("field", "cant", undefined),
    //                 form.actions.validate()
    //             ]);
    //             data.isValid.should.be.false();
    //             data.fields.field.should.be.eql({
    //                 errors: ["Value is not a valid number"],
    //                 hasCustomErrors: true,
    //                 isParsed: false,
    //                 value: "cant",
    //                 visualState: "invalid"
    //             } as FieldInfo);
    //         });

    //         it("and visually marked as invalid if field is formatted", () => {
    //             const data = applyActions([
    //                 form.actions.fieldEdit("field", "cant", undefined),
    //                 form.actions.fieldFormat("field", undefined)
    //             ]);
    //             data.isValid.should.be.false();
    //             data.fields.field.should.be.eql({
    //                 errors: ["Value is not a valid number"],
    //                 hasCustomErrors: true,
    //                 isParsed: false,
    //                 value: "cant",
    //                 visualState: "invalid"
    //             } as FieldInfo);
    //         });
    //     });
    // });

    // describe("form with external errors", () => {
    //     it("should have errors in fields if errors are set event if form is not validated", () => {
    //         const data = applyActions(
    //             [
    //                 form.actions.setErrors({
    //                     fields: {
    //                         field: ["Value too large"]
    //                     }
    //                 })
    //             ],
    //             form.state.withData({ field: 1234 })
    //         );
    //         data.isValid.should.be.false();
    //         data.fields.field.should.be.eql({
    //             data: 1234,
    //             errors: ["Value too large"],
    //             hasCustomErrors: true,
    //             isParsed: true,
    //             value: "1234",
    //             visualState: "invalid"
    //         } as FieldInfo);
    //     });

    //     it("should not display error if field is edited", () => {
    //         const data = applyActions(
    //             [
    //                 form.actions.setErrors({
    //                     fields: {
    //                         field: ["Value too large"]
    //                     }
    //                 }),
    //                 form.actions.fieldEdit("field", 111, undefined)
    //             ],
    //             form.state.withData({ field: 1234 })
    //         );
    //         data.isValid.should.be.false();
    //         data.fields.field.should.be.eql({
    //             data: 111,
    //             errors: ["Value too large"],
    //             hasCustomErrors: true,
    //             isParsed: true,
    //             value: "111",
    //             visualState: "none"
    //         } as FieldInfo);
    //     });

    //     it("should display valid field if value is parsed and formatted", () => {
    //         const data = applyActions(
    //             [
    //                 form.actions.setErrors({
    //                     fields: {
    //                         field: ["Value too large"]
    //                     }
    //                 }),
    //                 form.actions.fieldEdit("field", 111, undefined),
    //                 form.actions.fieldFormat("field", undefined)
    //             ],
    //             form.state.withData({ field: 1234 })
    //         );
    //         data.isValid.should.be.false();
    //         data.fields.field.should.be.eql({
    //             data: 111,
    //             errors: ["Value too large"],
    //             hasCustomErrors: true,
    //             isParsed: true,
    //             value: "111",
    //             visualState: "valid"
    //         } as FieldInfo);
    //     });
    // });

    describe("typical flow: no custom errors", () => {
        it("initial form with data", () => {
            const result = applyActions(
                [],
                form.state.withData({
                    field: 111
                })
            );

            result.isValid.should.be.true();
            result.fields.field.should.eql({
                data: 111,
                hasCustomErrors: false,
                isParsed: true,
                value: "111",
                visualState: "none"
            } as FieldInfo);
        });

        it("initial form without data should be invalid if field is required", () => {
            const result = applyActions([]);

            result.isValid.should.be.false();
            result.fields.field.should.eql({
                errors: ["Value is required."],
                hasCustomErrors: false,
                isParsed: false,
                value: undefined,
                visualState: "none"
            } as FieldInfo);
        });

        it("editing field with valid value", () => {
            const result = applyActions([form.actions.fieldEdit("field", 123, undefined)]);

            result.isValid.should.be.true();
            result.fields.field.should.eql({
                data: 123,
                hasCustomErrors: false,
                isParsed: true,
                value: "123",
                visualState: "none"
            } as FieldInfo);
        });

        it("has edit field with valid value", () => {
            const result = applyActions([
                form.actions.fieldEdit("field", 123, undefined),
                form.actions.fieldFormat("field", undefined)
            ]);

            result.isValid.should.be.true();
            result.fields.field.should.eql({
                data: 123,
                hasCustomErrors: false,
                isParsed: true,
                value: "123",
                visualState: "valid"
            } as FieldInfo);
        });

        it("editing field with invalid value", () => {
            const result = applyActions([form.actions.fieldEdit("field", "inv", undefined)]);

            result.isValid.should.be.false();
            result.fields.field.should.eql({
                errors: ["Value is not a valid number"],
                hasCustomErrors: false,
                isParsed: false,
                value: "inv",
                visualState: "none"
            } as FieldInfo);
        });

        it("has edit field with invalid value", () => {
            const result = applyActions([
                form.actions.fieldEdit("field", "inv", undefined),
                form.actions.fieldFormat("field", undefined)
            ]);

            result.isValid.should.be.false();
            result.fields.field.should.eql({
                errors: ["Value is not a valid number"],
                hasCustomErrors: false,
                isParsed: false,
                value: "inv",
                visualState: "invalid"
            } as FieldInfo);
        });

        it("editing field with invalid value", () => {
            const result = applyActions([
                form.actions.fieldEdit("field", "inv", undefined),
                form.actions.fieldFormat("field", undefined),
                form.actions.fieldEdit("field", "1234", undefined)
            ]);

            result.isValid.should.be.true();
            result.fields.field.should.eql({
                data: 1234,
                hasCustomErrors: false,
                isParsed: true,
                value: "1234",
                visualState: "none"
            } as FieldInfo);
        });
    });

    describe("typical flow: with custom errors", () => {
        it("should display field error for pristine form", () => {
            const result = applyActions(
                [
                    form.actions.setErrors({
                        fields: {
                            field: ["Too large"]
                        }
                    })
                ],
                form.state.withData({ field: 123 })
            );

            result.isValid.should.be.true();
            result.fields.field.should.eql({
                data: 123,
                errors: ["Too large"],
                hasCustomErrors: true,
                isParsed: true,
                value: "123",
                visualState: "invalid"
            } as FieldInfo);
        });

        it("should display field error for dirty form after setting custom errors", () => {
            const result = applyActions([
                form.actions.fieldEdit("field", 123, undefined),
                form.actions.setErrors({
                    fields: {
                        field: ["Too large"]
                    }
                })
            ]);

            result.isValid.should.be.true();
            result.fields.field.should.eql({
                data: 123,
                errors: ["Too large"],
                hasCustomErrors: true,
                isParsed: true,
                value: "123",
                visualState: "invalid"
            } as FieldInfo);
        });

        it("should not display custom errors for dirty field", () => {
            const result = applyActions(
                [
                    form.actions.setErrors({
                        fields: {
                            field: ["Too large"]
                        }
                    }),
                    form.actions.fieldEdit("field", 123, undefined)
                ],
                form.state.withData({ field: 321 })
            );

            result.isValid.should.be.true();
            result.fields.field.should.eql({
                data: 123,
                errors: ["Too large"],
                hasCustomErrors: true,
                isParsed: true,
                value: "123",
                visualState: "none"
            } as FieldInfo);
        });
    });

    function applyActions(actions: Action[], state = form.state.empty()): typeof form.types.selectorResult {
        const newState = actions.reduce((intermediateState, action) => form.reducer(intermediateState, action), state);

        return form.selector(newState);
    }
});
