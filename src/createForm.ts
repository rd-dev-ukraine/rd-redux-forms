import { RdReduxFormImpl } from "./runtime/RdReduxForm";

import { FormConfiguration, RdReduxForm } from "./api";


const existingForms = new Set<string>();

export function createForm<TFields, TMeta = undefined>(title: string, config: FormConfiguration<TFields, TMeta>): RdReduxForm<TFields, TMeta> {
    if (!config) {
        throw new Error("Form configuration is missing.");
    }

    if (!config.fields || !Object.keys(config.fields).length) {
        throw new Error("Form fields is missing.");
    }

    title = uniqueFormTitle(title);

    return new RdReduxFormImpl<TFields, TMeta>(title, config);
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