// static/src/js/form_renderer.js
/** @odoo-module **/

import { FormRenderer } from "@web/views/form/form_renderer";
import { patch } from "@web/core/utils/patch";

patch(FormRenderer.prototype, {
    /**
     * Override para forzar el chatter siempre abajo
     * La propiedad isChatterAside determina si el chatter se muestra al lado
     * Siempre retornamos false para forzarlo abajo
     */
    get isChatterAside() {
        return false;
    }
});