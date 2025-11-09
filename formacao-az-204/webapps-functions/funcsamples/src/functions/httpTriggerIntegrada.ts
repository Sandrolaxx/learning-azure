import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ContainerClient } from "@azure/storage-blob";

export async function httpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const containerClient = new ContainerClient(process.env.AZURE_STORAGE_CONNECTION_STRING || '', 'containerimgsandrolaxx');

    const blobFileData = await containerClient.exists().then(async (exists) => {
        if (exists) {
            context.log('The container exists.');

            return await containerClient.getBlobClient('sample.json').download().then(async (blobData) => {
                if (blobData.readableStreamBody) {
                    const downloaded = await streamToString(blobData.readableStreamBody);
                    context.log('The blob exists.');
                    return downloaded;
                }

                context.log('The blob does not exist.');
            }).catch((error) => {
                context.log('Error checking blob existence:', error.message);
            });
        } else {
            context.log('The container does not exist.');
        }
    }).catch((error) => {
        context.log('Error checking container existence:', error.message);
    });

    if (blobFileData) {
        return { body: blobFileData };
    }

    return { body: "Hello Blob!" };
};

app.http('httpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTrigger
});

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const result = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (data) => {
      chunks.push(Buffer.isBuffer(data) ? data : Buffer.from(data));
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on("error", reject);
  });
  return result.toString();
}
