import "mocha";
import "should";

import { createForm, fields } from "../src";
import { field, reactBinding } from "../src/bindings";

describe("Form binding configuration", () => {
    it("must not throw errors", () => {
        const form = createForm("TEST FORM", {
            description: fields.string(),
            id: fields.int(),
            name: fields.string()
        });

        const binding = reactBinding()
            .forAllFields()
            .edit()
            .onChange()
            .format()
            .onBlur()
            .end()
            .withForm(form)
            .configureFields({
                id: field()
                    .submit()
                    .onChange()
            });

        const events = binding.bind((a: any) => a, undefined);

        events.should.not.be.null();
    });
});
