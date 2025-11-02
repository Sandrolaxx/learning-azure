const express = require("express");
const cors = require("cors");
const { ServiceBusClient } = require("@azure/service-bus");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/car-rental", async (req, res) => {
    const { name, email, vehicle } = req.body;
    const connectionString = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING;
    const message = {
        name,
        email,
        vehicle,
        date: new Date().toISOString()
    }

    try {
        const queueName = "fila-locacao-auto";

        const sbClient = new ServiceBusClient(connectionString);
        const sender = sbClient.createSender(queueName);
        const sbMesssage = {
            body: message,
            contentType: "application/json",
            label: "rent-car"
        }

        await sender.sendMessages(sbMesssage);
        await sender.close();
        await sbClient.close();

        res.status(201).json({ message: "Locação de veículo enviada pra a fila com sucesso"})

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error to send message" });
    }

});

app.listen(3001, () => {
    console.log("Server is running🏃 - Port: 3001");
});
