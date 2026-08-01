export type UserRole = "teacher" | "student";

const DEFAULT_TEACHER_EMAIL = "mira.pm.tech@gmail.com";

function getPrivilegedEmails() {
  const extraEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);

  return new Set([getTeacherEmail(), ...extraEmails]);
}

export function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

export function getTeacherEmail() {
  return normalizeEmail(process.env.TEACHER_EMAIL || DEFAULT_TEACHER_EMAIL);
}

export function getUserRole(email?: string | null): UserRole {
  return isTeacherOrAdmin(email) ? "teacher" : "student";
}

export function isTeacher(email?: string | null) {
  return isTeacherOrAdmin(email);
}

export function isTeacherOrAdmin(email?: string | null) {
  return getPrivilegedEmails().has(normalizeEmail(email));
}

export function isStudent(email?: string | null) {
  return getUserRole(email) === "student";
}
