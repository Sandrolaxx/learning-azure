export interface IPaymentRent {
    name: string;
    email: string;
    vehicle: {
        model: string;
        year: number;
        rentalTime: string;
    };
    date: string;
    amount: number;
}

export enum EnumPaymentStatus {
    APPROVED,
    WAITING,
    REPROVED
}