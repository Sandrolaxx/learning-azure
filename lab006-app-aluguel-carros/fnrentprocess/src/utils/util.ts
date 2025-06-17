export function getErrorObj(message: string) {
    return JSON.stringify({ error: message, timestamp: new Date().toISOString() });
}