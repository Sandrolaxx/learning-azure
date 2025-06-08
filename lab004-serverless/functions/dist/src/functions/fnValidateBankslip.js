"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fnValidateBankslip = void 0;
const functions_1 = require("@azure/functions");
const util_1 = require("../utils/util");
function fnValidateBankslip(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = yield request.json();
        context.log(`Validating bankslip with barcode: ${payload.barcode}`);
        if (!payload.barcode || payload.barcode.length < 44) {
            return {
                status: 400,
                body: (0, util_1.getErrorObj)("Código de barras inválido. Deve ter pelo menos 44 caracteres.")
            };
        }
        const dueDate = payload.barcode.substring(3, 11);
        const amount = parseFloat(payload.barcode.substring(11, 21)) / 100;
        const parsedDueDate = Date.parse(`${dueDate.substring(0, 4)}-${dueDate.substring(4, 6)}-${dueDate.substring(6, 8)}`);
        if (isNaN(amount) || amount <= 0) {
            return {
                status: 400,
                body: (0, util_1.getErrorObj)("Valor boleto inválido no código de barras.")
            };
        }
        if (!dueDate.match(/^\d{8}$/) && isNaN(parsedDueDate)) {
            return {
                status: 400,
                body: (0, util_1.getErrorObj)("Data de vencimento inválida no código de barras.")
            };
        }
        const resPayload = {
            barcode: payload.barcode,
            amount: amount,
            dueDate: new Date(parsedDueDate)
        };
        context.log(`Bankslip validated successfully: ${JSON.stringify(resPayload)}`);
        return { body: JSON.stringify(resPayload), status: 200 };
    });
}
exports.fnValidateBankslip = fnValidateBankslip;
;
functions_1.app.http('validate-bankslip', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: fnValidateBankslip
});
//# sourceMappingURL=fnValidateBankslip.js.map