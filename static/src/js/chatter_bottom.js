/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { FormRenderer } from "@web/views/form/form_renderer";

// En Odoo moderno, es buena práctica poner un nombre de parche (evita colisiones).
patch(FormRenderer.prototype, "force_chatter_bottom.FormRenderer", {
    get isChatterAside() {
        return false;
    },
});
