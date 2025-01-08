function convertPdfToJson(pdfText) {
  const pattern =
    /(?<date>\w+ \d{1,2}, \d{4})\s*(?<time>\d{2}:\d{2} (?:am|pm))\s*(?<type>DEBIT|CREDIT)₹(?<amount>\d{1,3}(?:,\d{2})*(?:,\d{3})*)\s*(?:Paid to|Received from)\s*(?<recipient>[^\n]+)\s*Transaction ID (?<transaction_id>[^\n]+)\s*UTR No\. (?<utr_no>[^\n]+)\s*(?:Paid by|Credited to)\s*(?<paid_by>[^\n]+)/g;
  const matches = [...pdfText.matchAll(pattern)];
  const transactions = matches.map((match) => ({
    date: match.groups.date,
    time: match.groups.time,
    type: match.groups.type,
    amount: `₹${match.groups.amount}`,
    recipient: match.groups.recipient,
    transaction_id: match.groups.transaction_id,
    utr_no: match.groups.utr_no,
    paid_by: match.groups.paid_by,
  }));
  return transactions;
}
export default convertPdfToJson;
