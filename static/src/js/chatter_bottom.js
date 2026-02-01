/** @odoo-module **/

import { registry } from "@web/core/registry";
import { evaluateExpr } from "@web/core/py_js/py";
import { append, createElement, setAttributes } from "@web/core/utils/xml";

/**
 * Recompila el chatter para forzar SIEMPRE modo "bottom" (no-aside)
 * Nota: seguimos el patrón de reemplazar `chatter_compiler` del registry,
 * que es donde el form view construye el nodo del chatter. (Ver referencia del foro)
 */
function compileChatterForceBottom(node, params) {
    let hasActivities = false;
    let hasFollowers = false;
    let hasMessageList = false;

    let hasParentReloadOnAttachmentsChanged;
    let hasParentReloadOnFollowersUpdate = false;
    let hasParentReloadOnMessagePosted = false;

    // Respeta opciones de vistas (por si hay open_attachments/post_refresh)
    let isAttachmentBoxVisibleInitially = false;

    for (const childNode of node.children) {
        const options = evaluateExpr(childNode.getAttribute("options") || "{}");
        switch (childNode.getAttribute("name")) {
            case "activity_ids":
                hasActivities = true;
                break;

            case "message_follower_ids":
                hasFollowers = true;
                hasParentReloadOnFollowersUpdate = Boolean(options["post_refresh"]);
                isAttachmentBoxVisibleInitially =
                    isAttachmentBoxVisibleInitially || Boolean(options["open_attachments"]);
                break;

            case "message_ids":
                hasMessageList = true;
                hasParentReloadOnAttachmentsChanged = options["post_refresh"] === "always";
                hasParentReloadOnMessagePosted = Boolean(options["post_refresh"]);
                isAttachmentBoxVisibleInitially =
                    isAttachmentBoxVisibleInitially || Boolean(options["open_attachments"]);
                break;
        }
    }

    // Componente chatter
    const chatterComponentXml = createElement("t");
    setAttributes(chatterComponentXml, {
        "t-component": "__comp__.mailComponents.Chatter",

        hasActivities,
        hasFollowers,
        hasMessageList,

        hasParentReloadOnAttachmentsChanged,
        hasParentReloadOnFollowersUpdate,
        hasParentReloadOnMessagePosted,

        isAttachmentBoxVisibleInitially,

        // 🔴 CLAVE: forzar a NO-ASIDE desde el origen
        isChatterAside: false,

        // Mantener comportamiento estándar
        isInFormSheetBg: true,

        threadId: "__comp__.props.record.resId or undefined",
        threadModel: "__comp__.props.record.resModel",
        webRecord: "__comp__.props.record",
        saveRecord: "() => __comp__.save and __comp__.save()",
    });

    // Hook/container
    const hookXml = createElement("div");
    hookXml.classList.add("o-mail-ChatterContainer", "o-mail-Form-chatter", "o_force_chatter_bottom");
    append(hookXml, chatterComponentXml);

    return hookXml;
}

// Reemplazo del compiler del chatter (patrón recomendado en el foro)
registry.category("form_compilers").remove("chatter_compiler");
registry.category("form_compilers").add("chatter_compiler", {
    selector: "div.oe_chatter",
    fn: compileChatterForceBottom,
});
