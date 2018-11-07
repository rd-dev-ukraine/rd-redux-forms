import "mocha";
import "should";
import { createForm, fields, formActionHelper } from "../src";

interface OneField {
    field: number | null;
}

describe("Form action helper", () => {
    const form = createForm<OneField>("One field form", {
        field: fields.int(true)
    });

    it("should derive field edit action from field edit", () => {
        const fieldEdit = form.actions.fieldEdit("field", 23);

        const derived = formActionHelper.deriveAction(fieldEdit).fieldEdit("field", 345);

        derived.should.eql(form.actions.fieldEdit("field", 345));
    });

    it("should derive field edit action validate form", () => {
        const fieldEdit = form.actions.validate();

        const derived = formActionHelper.deriveAction<OneField, undefined>(fieldEdit).fieldEdit("field", 345);

        derived.should.eql(form.actions.fieldEdit("field", 345));
    });
});
