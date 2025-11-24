import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function httpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Iniciando validação CPF"`);

    const body = await request.json() as any;
    const cpf = body.cpf ?? null;

    if (!cpf) {
        context.log(`CPF não fornecido no corpo da requisição.`);
        return { status: 400, body: "CPF é obrigatório no corpo da requisição." };
    }

    if (!isValidCPF(cpf)) {
        context.log(`CPF inválido: ${cpf}`);
        return { status: 400, body: "CPF inválido." };
    }

    return { body: `CPF válido: ${cpf}` };
};

function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    
    let sum = 0;
    
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    
    let rev = 11 - (sum % 11);
    
    if (rev === 10 || rev === 11) rev = 0;
    
    if (rev !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    
    rev = 11 - (sum % 11);
    
    if (rev === 10 || rev === 11) rev = 0;
    
    return rev === parseInt(cpf.charAt(10));
}

app.http('httpTrigger', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: httpTrigger
});
