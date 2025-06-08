export type BankslipRequest = {
    amount: number;
    dueDate: string;
};

export type BankslipResponse = {
    barcode: string;
    amount: number;
    dueDate: Date;
    imageBase64: string;
};

export type ValidateBankslipRequest = {
    barcode: string;
}