"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorObj = void 0;
function getErrorObj(message) {
    return JSON.stringify({ error: message, timestamp: new Date().toISOString() });
}
exports.getErrorObj = getErrorObj;
//# sourceMappingURL=util.js.map