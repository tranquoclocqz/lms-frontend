export const ENROLLMENT_STATUSES = ["active", "completed", "paused"] as const;

export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

export function normalizeStudentEmail(email: string) {
  return email.trim().toLowerCase();
}

export function deriveStudentName(input?: string | null) {
  const normalized = input?.trim();

  if (normalized) {
    return normalized;
  }

  return "Học viên BrainCourse";
}

export function normalizeEnrollmentStatus(
  value?: string | null,
): EnrollmentStatus | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return ENROLLMENT_STATUSES.includes(normalized as EnrollmentStatus)
    ? (normalized as EnrollmentStatus)
    : null;
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function calculateEnrollmentProgress(
  progress?: number | null,
  status?: EnrollmentStatus | null,
) {
  const numericProgress =
    typeof progress === "number" && Number.isFinite(progress)
      ? Math.min(100, Math.max(0, Math.round(progress)))
      : null;

  if (status === "completed") {
    return 100;
  }

  if (numericProgress === null) {
    return 0;
  }

  return numericProgress;
}

export function canAccessCourse(status: string) {
  return status === "active" || status === "completed";
}
