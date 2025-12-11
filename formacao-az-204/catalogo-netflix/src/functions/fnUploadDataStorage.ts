import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { ALLOWED_IMAGE_TYPES, ALLOWED_TYPES, ALLOWED_VIDEO_TYPES, MAX_FILE_SIZE } from "../utils/constants";
import { isImageType, isVideoType } from "../utils/util";

export async function fnUploadDataStorage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        // Verifica se o método é POST
        if (request.method !== 'POST') {
            return {
                status: 405,
                body: JSON.stringify({ 
                    error: 'Método não permitido. Use POST.' 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        // Obtém o form-data
        const formData = await request.formData();
        const file = formData.get('file');

        // Verifica se o arquivo foi enviado
        if (!file) {
            return {
                status: 400,
                body: JSON.stringify({ 
                    error: 'Nenhum arquivo foi enviado. Use o campo "file" no form-data.' 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        // Verifica se é um arquivo (não uma string)
        if (typeof file === 'string') {
            return {
                status: 400,
                body: JSON.stringify({ 
                    error: 'O campo "file" deve conter um arquivo, não texto.' 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const tamanhoEmMB = (buffer.length / 1024 / 1024).toFixed(2);

        // Verifica o tamanho do arquivo
        if (buffer.length > MAX_FILE_SIZE) {
            return {
                status: 413,
                body: JSON.stringify({ 
                    error: `Arquivo muito grande. Tamanho máximo: 100MB. Tamanho enviado: ${tamanhoEmMB}MB` 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        // Verifica o tipo de arquivo
        if (!ALLOWED_TYPES.includes(file.type)) {
            return {
                status: 415,
                body: JSON.stringify({ 
                    error: `Tipo de arquivo não suportado. Tipos de imagem permitidos: ${ALLOWED_IMAGE_TYPES.join(', ')}. Tipos de vídeo permitidos: ${ALLOWED_VIDEO_TYPES.join(', ')}. Tipo enviado: ${file.type}` 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        // Determina o container baseado no tipo de arquivo
        const isImage = isImageType(file.type);
        const containerName = isImage ? 'images' : 'videos';
        const fileCategory = isImage ? 'imagem' : 'vídeo';

        context.log(`Arquivo recebido: ${file.name}, Tamanho: ${tamanhoEmMB}MB, Tipo: ${file.type}, Categoria: ${fileCategory}, Container: ${containerName}`);

        // Upload para Azure Blob Storage
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        
        const blockBlobClient = containerClient.getBlockBlobClient(file.name);
        const uploadResponse = await blockBlobClient.uploadData(buffer, { blobHTTPHeaders: { blobContentType: file.type } });

        return {
            status: 200,
            body: JSON.stringify({ 
                message: 'Arquivo recebido com sucesso',
                fileName: file.name,
                fileSize: `${tamanhoEmMB}MB`,
                fileType: file.type,
                uri: uploadResponse._response.request.url
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };

    } catch (error) {
        context.error('Erro ao processar upload:', error);
        return {
            status: 500,
            body: JSON.stringify({ 
                error: 'Erro ao processar o upload do arquivo',
                details: error.message 
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};

app.http('fnUploadDataStorage', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: fnUploadDataStorage
});
