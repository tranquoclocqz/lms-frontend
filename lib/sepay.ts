export function buildOrderPaymentCode(orderId: string) {
  return `ORDER_${orderId}`.trim().toUpperCase();
}

export function extractPaymentCode(input?: string | null) {
  if (!input) {
    return null;
  }

  const match = input.toUpperCase().match(/ORDER_[A-Z0-9_]+/);
  return match ? match[0] : null;
}

export function normalizeSePayAmount(payload: Record<string, unknown>) {
  const amountValue =
    payload.amount ??
    payload.transferAmount ??
    payload.transfer_amount ??
    payload.totalAmount;

  if (typeof amountValue === "string") {
    const normalizedDigits = amountValue.replace(/[^\d.-]/g, "");
    const amount = Number(normalizedDigits);
    return Number.isFinite(amount) ? amount : NaN;
  }

  const amount = Number(amountValue);
  return Number.isFinite(amount) ? amount : NaN;
}

export function pickTransferContent(payload: Record<string, unknown>) {
  const rawContent =
    payload.content ??
    payload.description ??
    payload.transferContent ??
    payload.transfer_description ??
    payload.transaction_content;

  return typeof rawContent === "string" ? rawContent.trim() : "";
}

export function buildVietQrUrl({
  amount,
  paymentCode,
  bankCode,
  accountNumber,
  accountName,
}: {
  amount: number;
  paymentCode: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
}) {
  const resolvedBankCode = bankCode || process.env.SEPAY_BANK_CODE;
  const resolvedAccountNumber =
    accountNumber || process.env.SEPAY_BANK_ACCOUNT;
  const resolvedAccountName = accountName || process.env.SEPAY_ACCOUNT_NAME;

  if (!resolvedBankCode || !resolvedAccountNumber) {
    return null;
  }

  const query = new URLSearchParams({
    amount: String(amount),
    addInfo: paymentCode,
  });

  if (resolvedAccountName) {
    query.set("accountName", resolvedAccountName);
  }

  return `https://img.vietqr.io/image/${resolvedBankCode}-${resolvedAccountNumber}-compact2.png?${query.toString()}`;
}
