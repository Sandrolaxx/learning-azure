import { app, InvocationContext } from "@azure/functions";

export async function fnRentProcess(message: unknown, context: InvocationContext): Promise<void> {
    context.log('Service bus queue function processed message:', message);
}

app.serviceBusQueue('fnRentProcess', {
    connection: '',
    queueName: 'myinputqueue',
    handler: fnRentProcess
});
