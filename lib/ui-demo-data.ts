import type { StudentCourse } from "@/typing";

export type DemoCourse = StudentCourse;

export const demoCourses: DemoCourse[] = [
  {
    _id: "1",
    title: "Product Design Essentials",
    shortDescription: "Thiết kế trải nghiệm người dùng và giao diện hiện đại.",
    description: "Một khóa học nền tảng giúp bạn làm quen với tư duy UX, wireframe và prototyping.",
    thumbnailUrl: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200",
    authorName: "Cô Mai UI UX",
    category: "Design",
    level: "Beginner",
    language: "English",
    price: 1290000,
    originalPrice: 1490000,
    discountPrice: 1290000,
    status: "Published",
    lessons: [
      { title: "Giới thiệu khóa học", duration: "08:20", isFreePreview: true, order: 1 },
      { title: "Tạo wireframe", duration: "12:10", isFreePreview: false, order: 2 },
      { title: "Thiết kế prototype", duration: "14:05", isFreePreview: false, order: 3 },
    ],
    createdAt: "2024-11-20T00:00:00.000Z",
  },
  {
    _id: "course-2",
    title: "Next.js 16 cho người mới bắt đầu",
    shortDescription: "Xây dựng ứng dụng web hiện đại với Next.js và React.",
    description: "Từ cấu trúc project đến deployment, khóa học hướng dẫn bạn từng bước.",
    thumbnailUrl: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200",
    authorName: "Anh Quân Dev",
    category: "Development",
    level: "Beginner",
    language: "Vietnamese",
    price: 1490000,
    originalPrice: 1990000,
    discountPrice: 1490000,
    status: "Published",
    lessons: [
      { title: "Cài đặt môi trường", duration: "10:00", isFreePreview: true, order: 1 },
      { title: "Routing và layout", duration: "15:45", isFreePreview: false, order: 2 },
      { title: "Data fetching", duration: "13:30", isFreePreview: false, order: 3 },
    ],
    createdAt: "2025-01-12T00:00:00.000Z",
  },
  {
    _id: "course-3",
    title: "AI Product Management",
    shortDescription: "Hiểu cách vận hành sản phẩm AI trong doanh nghiệp.",
    description: "Khóa học giúp bạn kết hợp tư duy sản phẩm với công nghệ AI.",
    thumbnailUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
    authorName: "Chị Linh PM",
    category: "AI",
    level: "Intermediate",
    language: "Vietnamese",
    price: 1990000,
    originalPrice: 2490000,
    discountPrice: 1990000,
    status: "Published",
    lessons: [
      { title: "Tổng quan AI product", duration: "09:40", isFreePreview: true, order: 1 },
      { title: "Định hình roadmap", duration: "16:05", isFreePreview: false, order: 2 },
    ],
    createdAt: "2025-02-03T00:00:00.000Z",
  },
];

export function getDemoCourseById(courseId?: string) {
  return demoCourses.find((course) => course._id === courseId) || null;
}

export const demoMyCourses = [
  {
    enrollmentId: "enr-1",
    progress: 42,
    enrolledAt: "2025-02-10T00:00:00.000Z",
    completedAt: null,
    course: demoCourses[0],
  },
  {
    enrollmentId: "enr-2",
    progress: 100,
    enrolledAt: "2025-01-16T00:00:00.000Z",
    completedAt: "2025-02-01T00:00:00.000Z",
    course: demoCourses[1],
  },
];

export const demoEnrollments = [
  {
    _id: "enr-1",
    studentName: "Nguyễn An",
    studentEmail: "an@example.com",
    courseId: demoCourses[0],
    status: "active" as const,
    progress: 42,
    enrolledAt: "2025-02-10T00:00:00.000Z",
    completedAt: null,
  },
  {
    _id: "enr-2",
    studentName: "Trần Bảo",
    studentEmail: "bao@example.com",
    courseId: demoCourses[1],
    status: "completed" as const,
    progress: 100,
    enrolledAt: "2025-01-16T00:00:00.000Z",
    completedAt: "2025-02-01T00:00:00.000Z",
  },
];

export const demoActivationCodes = [
  {
    _id: "code-1",
    code: "BRAIN-001",
    courseId: demoCourses[0],
    isUsed: false,
    usedBy: null,
    usedAt: null,
    createdAt: "2025-03-01T00:00:00.000Z",
  },
  {
    _id: "code-2",
    code: "BRAIN-002",
    courseId: demoCourses[1],
    isUsed: true,
    usedBy: "bao@example.com",
    usedAt: "2025-03-05T00:00:00.000Z",
    createdAt: "2025-03-02T00:00:00.000Z",
  },
];

export const demoTeacherSettings = {
  displayName: "BrainCourse Admin",
  email: "admin@braincourse.dev",
  avatarUrl: "https://img.clerk.com/placeholder",
  supportEmail: "support@braincourse.dev",
  bankName: "Vietcombank",
  bankAccountNumber: "1010101010",
  bankAccountHolder: "BrainCourse",
  defaultPaymentContent: "Thanh toan khoa hoc BrainCourse",
  allowStudentSignup: true,
};

export const demoDashboardStats = {
  totalStudents: 24,
  activeStudents: 16,
  totalOrders: 18,
  totalCourses: demoCourses.length,
  totalRevenue: 142000000,
};
