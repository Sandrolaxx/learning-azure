export function getErrorObj(message: string) {
    return JSON.stringify({ error: message, timestamp: new Date().toISOString() });
}

export function generateRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}