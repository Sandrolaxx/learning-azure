import { app, InvocationContext } from "@azure/functions";

export async function fnRentProcess(message: any, context: InvocationContext): Promise<void> {
    context.log('Service bus queue function processed message:', message.body);

    const rentCarData: RentCar = JSON.parse(message.body);

    if (rentCarData.data == null || rentCarData.name == null || rentCarData.email == null) {
        context.error("Erro ao relizar processamento da mensagem, dados rentcar inválidos");

        return;
    }

    const connection = await connectToDb();
    const { name, email, vehicle, data } = rentCarData;
    const { model, year, rentalTime } = vehicle;

    // Formate a data para o formato aceito pelo PostgreSQL (YYYY-MM-DD)
    // const rentDate = new Date(data).toISOString().split('T')[0];

    const query = `INSERT INTO car_rental (name, email, model, year, rental_time, rent_date)
                    VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [name, email, model, year, rentalTime, new Date(data)];

    await connection.query(query, values);

    await connection.end();
}

app.serviceBusQueue('fnRentProcess', {
    connection: process.env.AZURE_SERVICE_BUS_CONNECTION_STRING,
    queueName: 'fila-locacao-auto',
    handler: fnRentProcess
});
