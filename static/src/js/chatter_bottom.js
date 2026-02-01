/** @odoo-module **/

import { registry } from "@web/core/registry";
import { evaluateExpr } from "@web/core/py_js/py";
import { append, createElement, setAttributes } from "@web/core/utils/xml";

function compileChatterForceBottom(node, params) {
    let hasActivities = false;
    let hasFollowers = false;
    let hasMessageList = false;

    let hasParentReloadOnAttachmentsChanged;
    let hasParentReloadOnFollowersUpdate = false;
    let hasParentReloadOnMessagePosted = false;
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

    const chatterComponentXml = createElement("t");
    setAttributes(chatterComponentXml, {
        "t-component": "__comp__.mailComponents.Chatter",

        hasActivities: hasActivities ? "true" : "false",
        hasFollowers: hasFollowers ? "true" : "false",
        hasMessageList: hasMessageList ? "true" : "false",

        hasParentReloadOnAttachmentsChanged: hasParentReloadOnAttachmentsChanged ? "true" : "false",
        hasParentReloadOnFollowersUpdate: hasParentReloadOnFollowersUpdate ? "true" : "false",
        hasParentReloadOnMessagePosted: hasParentReloadOnMessagePosted ? "true" : "false",

        isAttachmentBoxVisibleInitially: isAttachmentBoxVisibleInitially ? "true" : "false",

        // ✅ CLAVE: expresión string, no boolean JS
        isChatterAside: "false",

        // Mantener estándar
        isInFormSheetBg: "true",

        threadId: "__comp__.props.record.resId || undefined",
        threadModel: "__comp__.props.record.resModel",
        webRecord: "__comp__.props.record",
        saveRecord: "() => __comp__.save && __comp__.save()",
    });

    const hookXml = createElement("div");
    hookXml.classList.add("o-mail-ChatterContainer", "o-mail-Form-chatter", "o_force_chatter_bottom");
    append(hookXml, chatterComponentXml);
    return hookXml;
}

const compilers = registry.category("form_compilers");
if (compilers.contains && compilers.contains("chatter_compiler")) {
    compilers.remove("chatter_compiler");
} else {
    // en algunas builds el registry no trae contains(); remove directo puede tronar
    try { compilers.remove("chatter_compiler"); } catch (e) {}
}

compilers.add("chatter_compiler", {
    selector: "div.oe_chatter",
    fn: compileChatterForceBottom,
});
