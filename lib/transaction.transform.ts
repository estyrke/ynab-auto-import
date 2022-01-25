import { YnabTransaction } from "../pages/api/ynab/createTransactions";

const danske_transform = (transaction: any): YnabTransaction => {
  return {
    amount: Math.round(new Number(transaction.transactionAmount.amount).valueOf() * 1000),
    date: transaction.bookingDate,
    import_id: transaction.transactionId.substr(0, 36),
    memo: transaction.remittanceInformationUnstructured.substr(0, 200),
    payee_name: transaction.creditorName
  }
};

export const transforms: { [name: string]: (transaction: any) => YnabTransaction } = { "DANSKEBANK_DABASESX": danske_transform }