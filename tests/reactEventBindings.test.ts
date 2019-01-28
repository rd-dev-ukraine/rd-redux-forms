import "mocha";
import "should";
import { createForm, fields, reactEventBindings } from "../src";

interface Fields {
    num: number;
    str: string;
    obj: any;
    arr: any[];
}

interface Meta {
    id: number;
    isNew: boolean;
}

describe("React event bindings", () => {
    const form = createForm<Fields, Meta>("test", {
        arr: fields.any(),
        num: fields.int(true),
        obj: fields.any(),
        str: fields.string(false)
    });

    describe("configuration", () => {
        it("should be easy and readable", () => {
            reactEventBindings(form);
        });
    });
});
