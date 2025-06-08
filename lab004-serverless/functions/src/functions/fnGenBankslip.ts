import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import dotenv from "dotenv";

dotenv.config();

import { ServiceBusClient } from "@azure/service-bus";
import bwipjs from "bwip-js";
import { BankslipRequest, BankslipResponse } from "../utils/types";
import { getErrorObj } from "../utils/util";

function createServiceBusCliente() {
    const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;

    const serviceBusClient = new ServiceBusClient(connectionString);

    return serviceBusClient;
}

export async function fnGenBankslip(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const serviceBusClient = createServiceBusCliente();
    const payload: BankslipRequest = await request.json() as any;

    const validationError = validateRequest(payload, context);

    if (validationError) {
        return validationError;
    }

    try {
        const bankCode = "777"//Mais de 200 por hora
        const barcodeAmount = payload.amount.toFixed(2).replace('.', '').padStart(10, '0');
        const baseCode = bankCode.concat(payload.dueDate.replace(/-/g, ''), barcodeAmount);
        const barcode = baseCode.length > 44 ? baseCode.substring(0, 44) : baseCode.padEnd(44, '0');

        context.log(`Generated barcode: ${barcode}`);

        const sender = serviceBusClient.createSender("bankslip-generator");
        const imageBase64 = await bwipjs.toBuffer({
            bcid: "code128",     // Barcode type
            text: barcode,       // Text to encode
            scale: 3,            // 3x scaling factor
            height: 10,          // Bar height, in millimeters
            includetext: true,   // Show human-readable text
            textxalign: "center",// Always good to set this
        })

        const payloadData: BankslipResponse = {
            barcode: barcode,
            amount: payload.amount,
            dueDate: new Date(payload.dueDate),
            imageBase64: imageBase64.toString('base64'),
        }

        const message = {
            body: payloadData,
            contentType: "application/json",
        };

        await sender.sendMessages(message);

        await sender.close();
        await serviceBusClient.close();

        context.log("Message sent successfully!");

        return { body: JSON.stringify(payloadData), status: 200 };

    } catch (err) {
        context.error("Error sending message to Service Bus", err);

        return { status: 500, body: getErrorObj("Falha ao registrar mensagem na fila.") };
    }
};

function validateRequest(payload: BankslipRequest, context: InvocationContext): HttpResponseInit | void {
    if (payload == null || typeof payload !== 'object') {
        context.error("Invalid request body. Expected a BankslipRequest object.");

        return { status: 400, body: getErrorObj("Corpo da requisição em formato inválido.") };
    }

    if (typeof payload.amount !== 'number' || typeof payload.dueDate !== 'string') {
        context.error("Invalid request body. Expected amount as number and dueDate as string.");

        return { status: 400, body: getErrorObj("Corpo da requisição em formato inválido. Valores inválidos.") };
    }

    if (payload.amount <= 0) {
        context.error("Invalid amount. It must be greater than zero.");

        return { status: 400, body: getErrorObj("Valor boleto informado inválido.") };
    }

    if (isNaN(Date.parse(payload.dueDate))) {
        context.error("Invalid dueDate. It must be a valid date string.");

        return { status: 400, body: getErrorObj("Data de vencimento inválida! Formato YYYY-MM-DD") };
    }
}

app.http('generate-bankslip', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: fnGenBankslip
});
