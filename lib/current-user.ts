import { normalizeEmail } from "@/lib/auth";

export async function getCurrentUserEmail() {
  return normalizeEmail("");
}
