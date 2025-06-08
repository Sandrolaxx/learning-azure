import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ValidateBankslipRequest } from "../utils/types";
import { getErrorObj } from "../utils/util";

export async function fnValidateBankslip(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    const payload: ValidateBankslipRequest = await request.json() as any;

    context.log(`Validating bankslip with barcode: ${payload.barcode}`);

    if (!payload.barcode || payload.barcode.length < 44) {
        return {
            status: 400,
            body: getErrorObj("Código de barras inválido. Deve ter pelo menos 44 caracteres.")
        };
    }

    const dueDate = payload.barcode.substring(3, 11);
    const amount = parseFloat(payload.barcode.substring(11, 21)) / 100;
    const parsedDueDate = Date.parse(`${dueDate.substring(0, 4)}-${dueDate.substring(4, 6)}-${dueDate.substring(6, 8)}`);

    if (isNaN(amount) || amount <= 0) {
        return {
            status: 400,
            body: getErrorObj("Valor boleto inválido no código de barras.")
        };
    }

    if (!dueDate.match(/^\d{8}$/) && isNaN(parsedDueDate)) {
        return {
            status: 400,
            body: getErrorObj("Data de vencimento inválida no código de barras.")
        };
    }

    const resPayload = {
        barcode: payload.barcode,
        amount: amount,
        dueDate: new Date(parsedDueDate)
    };

    context.log(`Bankslip validated successfully: ${JSON.stringify(resPayload)}`);

    return { body: JSON.stringify(resPayload), status: 200 };
};

app.http('validate-bankslip', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: fnValidateBankslip
});
