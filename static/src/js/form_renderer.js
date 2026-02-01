/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { FormCompiler } from "@web/views/form/form_compiler";

console.log("[force_chatter_bottom] loaded");

patch(FormCompiler.prototype, {
    compile(node, params) {
        const res = super.compile(node, params);

        // Ubica el componente OWL del chatter en el árbol compilado
        const chatter = res.querySelector("t[t-component='__comp__.mailComponents.Chatter']");
        if (chatter) {
            // Fuerza el layout a "no-aside"
            chatter.setAttribute("isChatterAside", "false");
        }

        return res;
    },
});
