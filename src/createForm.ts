import { RdReduxFormImpl } from "./runtime/RdReduxForm";

import { FormFieldsConfiguration, RdReduxForm } from "./api";

const existingForms = new Set<string>();

export function createForm<TFields, TMeta = undefined>(
    title: string,
    fields: FormFieldsConfiguration<TFields>): RdReduxForm<TFields, TMeta> {
    if (!fields) {
        throw new Error("Form fields configuration is missing.");
    }

    title = uniqueFormTitle(title);

    return new RdReduxFormImpl<TFields, TMeta>(title, fields);
}

function uniqueFormTitle(title: string): string {
    title = title || "rd-redux-form";

    if (!existingForms.has(title)) {
        return title;
    }

    let index = 1;

    while (true) {
        const uniqueTitle = `${title} ${index}`;
        if (existingForms.has(uniqueTitle)) {
            index++;
        } else {
            return uniqueTitle;
        }
    }
}
