import type { CourseLevel, CourseLesson, StudentCourse } from "@/typing";

const FALLBACK_RATING = "4.8";

type CourseVisualTheme = {
  panelClassName: string;
  accentClassName: string;
  glowClassName: string;
};

const courseVisualThemes: CourseVisualTheme[] = [
  {
    panelClassName:
      "bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.28),_transparent_40%),linear-gradient(135deg,_#0f172a_0%,_#312e81_54%,_#7c3aed_100%)]",
    accentClassName: "bg-white/14 text-white ring-1 ring-white/20",
    glowClassName: "bg-violet-500/30",
  },
  {
    panelClassName:
      "bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),_transparent_35%),linear-gradient(135deg,_#111827_0%,_#0f766e_52%,_#22c55e_100%)]",
    accentClassName: "bg-white/14 text-white ring-1 ring-white/20",
    glowClassName: "bg-emerald-500/30",
  },
  {
    panelClassName:
      "bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.28),_transparent_42%),linear-gradient(135deg,_#172554_0%,_#1d4ed8_52%,_#38bdf8_100%)]",
    accentClassName: "bg-white/14 text-white ring-1 ring-white/20",
    glowClassName: "bg-sky-500/30",
  },
  {
    panelClassName:
      "bg-[radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.28),_transparent_42%),linear-gradient(135deg,_#3f1d2e_0%,_#9d174d_45%,_#fb7185_100%)]",
    accentClassName: "bg-white/14 text-white ring-1 ring-white/20",
    glowClassName: "bg-rose-500/30",
  },
];

export function formatPriceVnd(price?: number) {
  if (!price || price <= 0) {
    return "Miễn phí";
  }

  return `${Math.round(price).toLocaleString("vi-VN")}đ`;
}

export function getTotalDuration(lessons: CourseLesson[]) {
  const totalSeconds = lessons.reduce((sum, lesson) => {
    return sum + (lesson.duration ?? 0);
  }, 0);
  
  if (totalSeconds <= 0) {
    return "Tự học linh hoạt";
  }

  return getDurationString(totalSeconds);
}

export function getDurationString(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    if (minutes === 0) {
      return `${hours} giờ`;
    }

    return `${hours} giờ ${minutes} phút`;
  }
  if (minutes === 0) {
    return `${totalSeconds} giây`;
  }
  return `${minutes} phút`;
}

export function getCourseVisualTheme(seed: string) {
  const normalizedSeed = seed.trim();
  const index =
    [...normalizedSeed].reduce(
      (sum, character) => sum + character.charCodeAt(0),
      0,
    ) % courseVisualThemes.length;

  return courseVisualThemes[index];
}

export function getCourseDescriptor(
  course: Pick<StudentCourse, "category" | "title">,
) {
  if (course.category?.trim()) {
    return formatCourseCategory(course.category);
  }

  return "Tổng quan";
}

export function getCourseSummary(
  course: Pick<StudentCourse, "shortDescription" | "description">,
) {
  return (
    course.shortDescription ||
    course.description ||
    "Bài học thực tiễn, dự án có hướng dẫn và lộ trình học rõ ràng."
  );
}

export function getCourseBadge(
  course: Pick<StudentCourse, "category" | "createdAt">,
) {
  const category = course.category?.trim();

  if (category === "AI") {
    return "Khóa học AI";
  }

  if (course.createdAt) {
    const createdAt = new Date(course.createdAt).getTime();
    const daysSincePublished = Math.floor(
      (Date.now() - createdAt) / (1000 * 60 * 60 * 24),
    );

    if (Number.isFinite(daysSincePublished) && daysSincePublished <= 30) {
      return "Mới";
    }
  }

  return "Nổi bật";
}

export function formatCourseCategory(category?: string) {
  switch (category) {
    case "Development":
      return "Lập trình";
    case "Design":
      return "Thiết kế";
    case "Business":
      return "Kinh doanh";
    case "Marketing":
      return "Marketing";
    case "AI":
      return "AI";
    case "Data":
      return "Dữ liệu";
    case "General":
      return "Tổng quan";
    default:
      return category || "Tổng quan";
  }
}

export function formatCourseLevel(level?: CourseLevel) {
  switch (level) {
    case "Beginner":
      return "Cơ bản";
    case "Intermediate":
      return "Trung cấp";
    case "Advanced":
      return "Nâng cao";
    default:
      return "Cơ bản";
  }
}

export function formatCourseStatus(status?: StudentCourse["status"]) {
  switch (status) {
    case "Published":
      return "Đã xuất bản";
    case "Draft":
      return "Nháp";
    default:
      return "Nháp";
  }
}

export function formatCompactCountVi(value: string) {
  if (value.endsWith("k")) {
    return value.replace(".", ",");
  }

  return value;
}

export function getCourseRating() {
  return {
    rating: FALLBACK_RATING,
  };
}
