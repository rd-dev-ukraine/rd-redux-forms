import "mocha";
import { Action } from "redux";
import "should";
import { createForm, fields } from "../src";

interface Fields {
    num: number | null;
    str: string | null;
    obj: object;
    arrObj: object[];
    arrNum: number[];
}

describe("Form selector cache", () => {
    const form = createForm<Fields>("One field form", {
        arrNum: fields.any(),
        arrObj: fields.any(),
        num: fields.int(false),
        obj: fields.any(),
        str: fields.string(false)
    });

    it("should be used on consequent selector calls", () => {
        const state = applyActionsToState(
            [],
            form.state.withData({
                num: 1234
            })
        );

        const first = form.selector(state);
        const second = form.selector(state);

        (first === second).should.be.true();
    });

    it("should not be used on if selector results are different", () => {
        const state = applyActionsToState([]);

        const first = form.selector(state, { num: 1 });
        const second = form.selector(state, { num: 2 });

        (first === second).should.be.false();
    });

    it("should be used if initial data produces equal selector results", () => {
        const state = applyActionsToState([]);

        const first = form.selector(state, { num: 1, str: "Hello" });
        const second = form.selector(state, { num: 1, str: "Hello" });

        (first === second).should.be.true();
    });

    it("should shallow compare objects in values", () => {
        const state = applyActionsToState([]);

        const obj = { a: 1 };

        const first = form.selector(state, { num: 1, str: "Hello", obj });
        const second = form.selector(state, { num: 1, str: "Hello", obj });
        const third = form.selector(state, { num: 1, str: "Hello", obj: { ...obj } });

        (first === second).should.be.true();
        (first === third).should.be.false();
    });

    it("should compare values in arrays", () => {
        const state = applyActionsToState([]);

        const first = form.selector(state, { num: 1, str: "Hello", arrNum: [1, 2, 3] });
        const second = form.selector(state, { num: 1, str: "Hello", arrNum: [1, 2, 3] });

        (first === second).should.be.true();
    });

    it("should shallow compare objects in arrays", () => {
        const state = applyActionsToState([]);

        const obj1 = { a: 1 };
        const obj2 = { b: 2 };

        const first = form.selector(state, { num: 1, str: "Hello", arrObj: [obj1, obj2] });
        const second = form.selector(state, { num: 1, str: "Hello", arrObj: [obj1, obj2] });
        const third = form.selector(state, { num: 1, str: "Hello", arrObj: [obj2, obj1] });

        (first === second).should.be.true();
        (first === third).should.be.false();
    });

    function applyActionsToState(
        actions: Action[],
        state = form.state.empty(),
        debug: boolean = false
    ): typeof form.types.state {
        const newState = actions.reduce((intermediateState, action) => form.reducer(intermediateState, action), state);
        if (debug) {
            // tslint:disable-next-line:no-console
            console.log(newState);
        }
        return newState;
    }
});
