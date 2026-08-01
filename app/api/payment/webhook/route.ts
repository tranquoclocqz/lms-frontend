import { processPaymentWebhook } from "@/lib/payment-webhook";

export async function POST(request: Request) {
  return processPaymentWebhook(request);
}
