/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { FormRenderer } from "@web/views/form/form_renderer";

// Odoo 19: patch(objToPatch, extension)
patch(FormRenderer.prototype, {
    get isChatterAside() {
        return false; // fuerza chatter abajo
    },
});
