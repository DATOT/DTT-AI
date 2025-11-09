"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatType = exports.SenderTypes = void 0;
var SenderTypes;
(function (SenderTypes) {
    SenderTypes["User"] = "user";
    SenderTypes["Bot"] = "bot";
})(SenderTypes || (exports.SenderTypes = SenderTypes = {}));
var ChatType;
(function (ChatType) {
    ChatType["Direct"] = "direct";
    ChatType["Group"] = "group";
    ChatType["Bot"] = "bot";
})(ChatType || (exports.ChatType = ChatType = {}));
