import type { ReactNode, SVGProps } from "react";
import type { ICourse, MetaData } from "@/typing/Courses";
import type { ILesson } from "@/typing/lesson";

export type { ICourse } from "@/typing/Courses";
export type { ILesson } from "@/typing/lesson";

export type CourseStatus = "Draft" | "Published";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type VideoSource = "local" | "bunny";
export type EnrollmentStatus = "active" | "completed" | "paused";

export type CourseLesson = {
  id?: number | string;
  title?: string;
  description?: string;
  videoSource?: VideoSource;
  videoUrl?: string;
  duration?: number;
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
  meta_data?: MetaData;
};

export type CourseDetailResponse = {
  status: number;
  data?: ICourse;
  message?: string;
};

export type CourseLessonsResponse = {
  status: number;
  data?: ILesson[];
  message?: string;
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
