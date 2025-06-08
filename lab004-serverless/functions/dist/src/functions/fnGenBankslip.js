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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fnGenBankslip = void 0;
const functions_1 = require("@azure/functions");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const service_bus_1 = require("@azure/service-bus");
const bwip_js_1 = __importDefault(require("bwip-js"));
const util_1 = require("../utils/util");
function createServiceBusCliente() {
    const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
    const serviceBusClient = new service_bus_1.ServiceBusClient(connectionString);
    return serviceBusClient;
}
function fnGenBankslip(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const serviceBusClient = createServiceBusCliente();
        const payload = yield request.json();
        const validationError = validateRequest(payload, context);
        if (validationError) {
            return validationError;
        }
        try {
            const bankCode = "777"; //Mais de 200 por hora
            const barcodeAmount = payload.amount.toFixed(2).replace('.', '').padStart(10, '0');
            const baseCode = bankCode.concat(payload.dueDate.replace(/-/g, ''), barcodeAmount);
            const barcode = baseCode.length > 44 ? baseCode.substring(0, 44) : baseCode.padEnd(44, '0');
            context.log(`Generated barcode: ${barcode}`);
            const sender = serviceBusClient.createSender("bankslip-generator");
            const imageBase64 = yield bwip_js_1.default.toBuffer({
                bcid: "code128",
                text: barcode,
                scale: 3,
                height: 10,
                includetext: true,
                textxalign: "center", // Always good to set this
            });
            const payloadData = {
                barcode: barcode,
                amount: payload.amount,
                dueDate: new Date(payload.dueDate),
                imageBase64: imageBase64.toString('base64'),
            };
            const message = {
                body: payloadData,
                contentType: "application/json",
            };
            yield sender.sendMessages(message);
            yield sender.close();
            yield serviceBusClient.close();
            context.log("Message sent successfully!");
            return { body: JSON.stringify(payloadData), status: 200 };
        }
        catch (err) {
            context.error("Error sending message to Service Bus", err);
            return { status: 500, body: (0, util_1.getErrorObj)("Falha ao registrar mensagem na fila.") };
        }
    });
}
exports.fnGenBankslip = fnGenBankslip;
;
function validateRequest(payload, context) {
    if (payload == null || typeof payload !== 'object') {
        context.error("Invalid request body. Expected a BankslipRequest object.");
        return { status: 400, body: (0, util_1.getErrorObj)("Corpo da requisição em formato inválido.") };
    }
    if (typeof payload.amount !== 'number' || typeof payload.dueDate !== 'string') {
        context.error("Invalid request body. Expected amount as number and dueDate as string.");
        return { status: 400, body: (0, util_1.getErrorObj)("Corpo da requisição em formato inválido. Valores inválidos.") };
    }
    if (payload.amount <= 0) {
        context.error("Invalid amount. It must be greater than zero.");
        return { status: 400, body: (0, util_1.getErrorObj)("Valor boleto informado inválido.") };
    }
    if (isNaN(Date.parse(payload.dueDate))) {
        context.error("Invalid dueDate. It must be a valid date string.");
        return { status: 400, body: (0, util_1.getErrorObj)("Data de vencimento inválida! Formato YYYY-MM-DD") };
    }
}
functions_1.app.http('generate-bankslip', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: fnGenBankslip
});
//# sourceMappingURL=fnGenBankslip.js.map