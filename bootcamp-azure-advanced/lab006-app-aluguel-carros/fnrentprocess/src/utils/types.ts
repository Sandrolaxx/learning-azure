export interface RentCar {
    name: string;
    email: string;
    vehicle: {
        model: string;
        year: number;
        rentalTime: string;
    };
    date: string;
}