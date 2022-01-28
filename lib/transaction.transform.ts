import { YnabTransaction } from "../pages/api/ynab/createTransactions";
import { Transaction } from "./nordigen";

type DanskeTransaction = Pick<Transaction,
  "additionalInformation" |
  "bookingDate" |
  "creditorName" |
  "creditorAccount" |
  "currencyExchange" |
  "entryReference" |
  "remittanceInformationUnstructured" |
  "transactionAmount" |
  "transactionId" |
  "valueDate">;

type StructuredInfo = {
  payee?: string;
  untagged?: string[];
  ["Recipient Name"]?: string;
  ["Purchase Date"]?: string;
  [key: string]: string | string[] | undefined;
};

const danske_transform = (transaction: DanskeTransaction): YnabTransaction => {
  const unstructured = transaction.remittanceInformationUnstructured.split("\n");

  const structured: StructuredInfo = {
    payee: unstructured.splice(0, 1)[0]
  }

  if (structured.payee?.startsWith("Swish till")) {
    parseSwish(unstructured, structured);
  } else {
    parseRegular(unstructured, structured);
  }

  const amount = Math.round(parseFloat(transaction.transactionAmount.amount) * 1000);
  const date = reverseDate(structured["Purchase Date"]) ?? transaction.bookingDate;
  delete structured["Purchase Date"];

  if (transaction.creditorName && transaction.creditorName != structured.payee) {
    console.warn(`Mismatch in payee: "${transaction.creditorName}" vs "${structured.payee}"`);
  }
  const payee_name = structured.payee || transaction.creditorName;
  delete structured.payee;

  const memo = Object.entries(structured).map(([k, v]) => k == "untagged" ? v : `${k}: ${v}`).join(", ");

  return {
    amount,
    date,
    import_id: transaction.transactionId.substring(0, 36),
    memo: memo.substring(0, 200),
    payee_name
  }
};

export const transforms: { [name: string]: (transaction: any) => YnabTransaction } = { "DANSKEBANK_DABASESX": danske_transform }


function parseSwish(unstructured: string[], structured: StructuredInfo) {
  unstructured.splice(0, 1);
  parseRegular(unstructured, structured);
  structured.payee = structured["Recipient Name"] || structured.payee?.replace("Swish till", "");
  delete structured["Recipient Name"]
  delete structured["EndToEndID"];
  delete structured["Transaction ID"]
  delete structured["Reference number"]
  delete structured["Order number"]
  structured.Swish = `"${structured["Text for recipient"] ?? ""}".`
  delete structured["Text for recipient"];
  if (structured.hasOwnProperty("Recipient no.")) {
    structured.Swish += ` Nummer: +${structured["Recipient no."]}.`
    delete structured["Recipient no."]
  }
}

function parseRegular(unstructured: string[], structured: StructuredInfo) {
  for (let i = 0; i < unstructured.length; i += 1) {
    if (unstructured[i].endsWith(":")) {
      const key = unstructured[i].slice(0, -1);
      i += 1;
      const value = unstructured[i]
      structured[key] = value;
    }
    else if (unstructured[i].includes(":")) {
      const [k, v] = unstructured[i].split(": ");
      structured[k] = v;
    }
    else if (unstructured[i].includes("  ")) {
      const key = unstructured[i].split("  ");
      const value = key.splice(-1, 1)[0].trim();
      structured[key.map(v => v.trim()).filter(v => v.length > 0).join(" ")] = value;
    } else {
      structured["untagged"] = [...structured["untagged"] ?? [], unstructured[i]];
    }
  }
  if (structured["EndToEndID"] == "NOTPROVIDED") {
    delete structured["EndToEndID"];
  }
}

function reverseDate(date?: string) {
  if (date === undefined)
    return undefined;

  return date.split(".").reverse().join("-");
}