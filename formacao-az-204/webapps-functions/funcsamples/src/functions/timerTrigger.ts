import { app, InvocationContext, Timer } from "@azure/functions";

export async function timerTrigger(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request. Timer: ', myTimer);
}

app.timer('timerTrigger', {
    schedule: '0 */1 * * * *',
    handler: timerTrigger
});
