import type { ReactNode, SVGProps } from "react";

export type CourseStatus = "Draft" | "Published";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type VideoSource = "local" | "bunny";
export type EnrollmentStatus = "active" | "completed" | "paused";

export type CourseLesson = {
  title?: string;
  description?: string;
  videoSource?: VideoSource;
  videoUrl?: string;
  duration?: string;
  isFreePreview?: boolean;
  order: number;
};

export type StudentCourse = {
  _id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  thumbnailUrl?: string;
  authorName?: string;
  category?: string;
  level?: CourseLevel;
  language?: string;
  price?: number;
  originalPrice?: number;
  discountPrice?: number;
  status?: CourseStatus;
  lessons?: CourseLesson[];
  createdAt?: string;
};

export type CourseFormState = {
  title: string;
  shortDescription: string;
  description: string;
  authorName: string;
  category: string;
  level: string;
  language: string;
  originalPrice: string;
  discountPrice: string;
  thumbnailUrl: string;
  status: CourseStatus;
};

export type LessonDraft = {
  title: string;
  description: string;
  videoSource: VideoSource;
  videoUrl: string;
  duration: string;
  isFreePreview: boolean;
};

export type CoursePayload = {
  _id?: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  authorName?: string;
  category?: string;
  level?: string;
  language?: string;
  originalPrice?: number;
  discountPrice?: number;
  price?: number | string;
  thumbnailUrl?: string;
  status?: CourseStatus;
  lessons?: CourseLesson[];
};

export type CourseResponseShape = {
  success?: boolean;
  course?: StudentCourse | CoursePayload;
  message?: string;
};

export type ActivationCodeCourse = {
  _id: string;
  title: string;
  status?: CourseStatus;
};

export type ActivationCodeItem = {
  _id: string;
  code: string;
  courseId:
    | string
    | {
        _id: string;
        title: string;
        category?: string;
        status?: CourseStatus;
      };
  isUsed: boolean;
  usedBy?: string | null;
  usedAt?: string | null;
  createdAt?: string;
};

export type TeacherSettings = {
  displayName: string;
  email: string;
  avatarUrl: string;
  supportEmail: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  defaultPaymentContent: string;
  allowStudentSignup: boolean;
};

export type EnrollmentItem = {
  _id: string;
  studentName: string;
  studentEmail: string;
  courseId:
    | string
    | {
        _id: string;
        title: string;
      };
  status: EnrollmentStatus;
  progress: number;
  enrolledAt?: string;
  completedAt?: string | null;
};

export type EnrollmentStats = {
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  completionRate: number;
};

export type CourseItem = {
  _id: string;
  title: string;
};

export type CreateEnrollmentPayload = {
  studentName: string;
  studentEmail: string;
  courseId: string;
  status: EnrollmentStatus;
};

export type UpdateEnrollmentPayload = {
  status: EnrollmentStatus;
  progress: number;
};

export type CreateActivationCodesPayload = {
  courseId?: string;
  quantity?: number | string;
};

export type CourseUpdatePayload = {
  title?: string;
  lessons?: Array<{
    title?: string;
    description?: string;
    videoSource?: "local" | "bunny" | string;
    videoUrl?: string;
    duration?: string;
    isFreePreview?: boolean;
    order?: number;
  }>;
};

export type CourseAccessRouteContext = {
  params: Promise<{ id: string }>;
};

export type EnrollmentRouteContext = {
  params: Promise<{ id: string }>;
};

export type ProgressPayload = {
  courseId?: string;
  lessonId?: string;
  progress?: number;
  status?: string;
};

export type RedeemCodePayload = {
  code?: string;
};

export type OrderRouteContext = {
  params: Promise<{ orderId: string }>;
};

export type MyCourseItem = {
  enrollmentId: string;
  progress: number;
  enrolledAt?: string;
  completedAt?: string | null;
  course: {
    _id: string;
    title: string;
    shortDescription?: string;
    thumbnailUrl?: string;
    authorName?: string;
    category?: string;
    status?: CourseStatus;
    lessons?: Array<{ order: number; title?: string }>;
  };
};

export type CheckoutResponse = {
  success?: boolean;
  message?: string;
  qrUrl?: string | null;
  orderId?: string;
  status?: string;
  courseId?: string;
  amount?: number;
  transferContent?: string;
  firstLessonId?: string;
  bank?: {
    bankName?: string;
    bankCode?: string;
    bankAccount?: string;
    accountName?: string;
  };
  order?: {
    id?: string;
    courseId?: string;
    amount: number;
    transferContent?: string;
    status?: string;
    firstLessonId?: string;
    course: {
      title: string;
      thumbnailUrl?: string;
    };
  };
};

export type RedeemResponse = {
  success?: boolean;
  message?: string;
  course?: {
    _id: string;
    title: string;
    firstLessonHref?: string | null;
    courseHref?: string;
  };
};

export type NavItem = {
  href: string;
  label: string;
};

export type ShellSearch = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export type SidebarNavItem = {
  href: string;
  label: string;
  icon: (props: SVGProps<SVGSVGElement>) => ReactNode;
};
