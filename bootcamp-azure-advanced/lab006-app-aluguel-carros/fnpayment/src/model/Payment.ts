import { randomUUID } from "crypto";
import { EnumPaymentStatus, IPaymentRent } from "../utils/types";
import { generateRandomNumber } from "../utils/utils";

export class Payment {
    paymentId: string;
    status: string;
    approvedAt: Date;
    amount: number;
    name: string;
    email: string;
    vehicle: {
        model: string;
        year: number;
        rentalTime: string;
    };
    date: string;

    constructor(paymentRent: IPaymentRent) {
        const randomStatus = generateRandomNumber(0, 2);
        const paymentStatus = EnumPaymentStatus[randomStatus];

        this.amount = paymentRent.amount;
        this.email = paymentRent.email;
        this.name = paymentRent.name;
        this.date = paymentRent.date;
        this.status = paymentStatus;
        this.paymentId = randomUUID();
        this.vehicle = {
            year: paymentRent.vehicle.year,
            rentalTime: paymentRent.vehicle.rentalTime,
            model: paymentRent.vehicle.model
        }

        if(randomStatus == 0) {
            this.approvedAt = new Date();
        }
    }
}