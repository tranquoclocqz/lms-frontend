"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { demoCourses } from "@/lib/ui-demo-data";
import type {
  CourseFormState,
  CourseLesson,
  CoursePayload,
  CourseResponseShape,
  CourseStatus,
  LessonDraft,
  VideoSource,
} from "@/typing";

const tabs = ["Basic Info", "Curriculum", "Publish"] as const;
type TabKey = (typeof tabs)[number];

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const labelClassName = "mb-2 block text-sm font-medium text-slate-700";

const emptyLessonDraft: LessonDraft = {
  title: "",
  description: "",
  videoSource: "local",
  videoUrl: "",
  duration: "",
  isFreePreview: false,
};

const initialCourseForm: CourseFormState = {
  title: "",
  shortDescription: "",
  description: "",
  authorName: "Cô Mai UI UX",
  category: "Development",
  level: "Beginner",
  language: "English",
  originalPrice: "",
  discountPrice: "",
  thumbnailUrl: "",
  status: "Draft",
};

function normalizeCourseForm(course?: CoursePayload): CourseFormState {
  return {
    title: course?.title || "",
    shortDescription: course?.shortDescription || "",
    description: course?.description || "",
    authorName: course?.authorName || "Cô Mai UI UX",
    category: course?.category || "Development",
    level: course?.level || "Beginner",
    language: course?.language || "English",
    originalPrice:
      typeof course?.originalPrice === "number" && course.originalPrice > 0
        ? String(course.originalPrice)
        : "",
    discountPrice:
      typeof course?.discountPrice === "number" && course.discountPrice > 0
        ? String(course.discountPrice)
        : typeof course?.discountPrice === "number" && course.discountPrice === 0
          ? "0"
          : "",
    thumbnailUrl: course?.thumbnailUrl || "",
    status: course?.status || "Draft",
  };
}

function normalizeLessons(lessons?: CourseLesson[]): CourseLesson[] {
  return (lessons || [])
    .map((lesson, index) => ({
      title: lesson.title || "",
      description: lesson.description || "",
      videoSource:
        lesson.videoSource === "bunny"
          ? ("bunny" as const)
          : ("local" as const),
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration || "",
      isFreePreview: Boolean(lesson.isFreePreview),
      order: Number.isFinite(lesson.order) ? lesson.order : index + 1,
    }))
    .sort((left, right) => left.order - right.order)
    .map((lesson, index) => ({
      ...lesson,
      order: index + 1,
    }));
}

export function CourseEditor({
  mode,
  courseId,
}: {
  mode: "create" | "edit";
  courseId?: string;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("Basic Info");
  const [course, setCourse] = useState<CourseFormState>(initialCourseForm);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [lessonDraft, setLessonDraft] = useState<LessonDraft>(emptyLessonDraft);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(mode === "edit");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (mode !== "edit" || !courseId) {
      return;
    }

    let mounted = true;

    async function fetchCourse() {
      try {
        setIsLoadingCourse(true);
        setLoadError("");

        const demoCourse = demoCourses.find((item) => item._id === courseId);

        if (!demoCourse) {
          throw new Error("Không thể tải khóa học");
        }

        if (!mounted) {
          return;
        }

        setCourse(normalizeCourseForm(demoCourse as CoursePayload));
        setLessons(normalizeLessons(demoCourse.lessons as CourseLesson[]));
      } catch (error) {
        console.error(error);

        if (mounted) {
          setLoadError(
            error instanceof Error ? error.message : "Không thể tải khóa học",
          );
        }
      } finally {
        if (mounted) {
          setIsLoadingCourse(false);
        }
      }
    }

    void fetchCourse();

    return () => {
      mounted = false;
    };
  }, [courseId, mode]);

  const updateCourseField = <K extends keyof CourseFormState>(
    key: K,
    value: CourseFormState[K],
  ) => {
    setCourse((prev) => ({ ...prev, [key]: value }));
  };

  const updateLessonDraft = <K extends keyof LessonDraft>(
    key: K,
    value: LessonDraft[K],
  ) => {
    setLessonDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = async (file: File, fieldName: "image" | "video") => {
    const previewUrl = URL.createObjectURL(file);

    if (fieldName === "image") {
      return previewUrl;
    }

    return previewUrl;
  };

  const handleThumbnailUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingThumbnail(true);
      const url = await handleUpload(file, "image");
      updateCourseField("thumbnailUrl", url);
    } catch (error) {
      console.error(error);
      alert("Tải ảnh đại diện thất bại");
    } finally {
      setIsUploadingThumbnail(false);
      event.target.value = "";
    }
  };

  const handleVideoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingVideo(true);
      const url = await handleUpload(file, "video");
      const duration = await extractVideoDuration(file);
      setLessonDraft((prev) => ({
        ...prev,
        videoSource: "local",
        videoUrl: url,
        duration,
      }));
    } catch (error) {
      console.error(error);
      alert("Tải video bài học thất bại");
    } finally {
      setIsUploadingVideo(false);
      event.target.value = "";
    }
  };

  const handleAddLesson = () => {
    if (!lessonDraft.title.trim()) {
      alert("Vui lòng nhập tên bài học");
      return;
    }

    if (!lessonDraft.videoUrl) {
      alert(
        lessonDraft.videoSource === "bunny"
          ? "Vui lòng nhập Bunny embed URL"
          : "Vui lòng tải video bài học lên",
      );
      return;
    }

    const nextLesson: CourseLesson = {
      ...lessonDraft,
      title: lessonDraft.title.trim(),
      description: lessonDraft.description.trim(),
      duration: lessonDraft.duration.trim(),
      order: lessons.length + 1,
    };

    setLessons((prev) => [...prev, nextLesson]);
    setLessonDraft(emptyLessonDraft);
  };

  const handleDeleteLesson = (order: number) => {
    setLessons((prev) =>
      prev
        .filter((lesson) => lesson.order !== order)
        .map((lesson, index) => ({ ...lesson, order: index + 1 })),
    );
  };

  const handleToggleLessonPreview = (order: number, isFreePreview: boolean) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.order === order ? { ...lesson, isFreePreview } : lesson,
      ),
    );
  };

  const saveCourse = async (status: CourseStatus) => {
    const finalPrice = course.discountPrice.trim();

    const payload = {
      title: course.title.trim(),
      shortDescription: course.shortDescription.trim(),
      description: course.description.trim(),
      authorName: course.authorName.trim(),
      thumbnailUrl: course.thumbnailUrl,
      category: course.category,
      level: course.level,
      language: course.language,
      price: finalPrice,
      originalPrice: course.originalPrice.trim(),
      discountPrice: course.discountPrice.trim(),
      status,
      lessons: lessons.map((lesson, index) => ({
        title: lesson.title?.trim() || "",
        description: lesson.description?.trim() || "",
        videoSource: lesson.videoSource,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration?.trim() || "",
        isFreePreview: lesson.isFreePreview,
        order: index + 1,
      })),
    };

    router.push("/courses");
    router.refresh();
  };

  const handleSaveDraft = async () => {
    if (!course.title.trim()) {
      alert("Vui lòng nhập tên khóa học trước khi lưu");
      return;
    }

    try {
      setIsSaving(true);
      setCourse((prev) => ({ ...prev, status: "Draft" }));
      await saveCourse("Draft");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Không thể lưu bản nháp khóa học",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!course.title.trim()) {
      alert("Vui lòng nhập tên khóa học trước khi xuất bản");
      return;
    }

    if (!course.thumbnailUrl) {
      alert("Vui lòng tải ảnh đại diện khóa học trước khi xuất bản");
      return;
    }

    if (lessons.length === 0) {
      alert("Vui lòng thêm ít nhất 1 bài học trước khi xuất bản");
      return;
    }

    try {
      setIsSaving(true);
      setCourse((prev) => ({ ...prev, status: "Published" }));
      await saveCourse("Published");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Không thể xuất bản khóa học",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const courseSummary =
    course.shortDescription.trim() || course.description.trim();
  const originalPriceValue = course.originalPrice.trim();
  const discountedPriceValue = course.discountPrice.trim();
  const originalPriceNumber = Number(originalPriceValue);
  const discountedPriceNumber = Number(discountedPriceValue);
  const showOriginalPriceWarning =
    Boolean(originalPriceValue) &&
    Boolean(discountedPriceValue) &&
    Number.isFinite(originalPriceNumber) &&
    Number.isFinite(discountedPriceNumber) &&
    originalPriceNumber < discountedPriceNumber;
  const pageTitle =
    mode === "edit" ? "Chỉnh sửa khóa học" : "Tạo khóa học mới";
  const pageDescription =
    mode === "edit"
      ? "Cập nhật thông tin khóa học, bài học và trạng thái xuất bản."
      : "Tạo khóa học, tải bài học lên và xuất bản khi đã sẵn sàng.";
  const saveDraftLabel =
    isSaving && course.status === "Draft"
      ? mode === "edit"
        ? "Đang cập nhật..."
        : "Đang lưu..."
      : mode === "edit"
        ? "Cập nhật nháp"
        : "Lưu nháp";
  const publishLabel =
    isSaving && course.status === "Published"
      ? mode === "edit"
        ? "Đang cập nhật..."
        : "Đang xuất bản..."
      : mode === "edit"
        ? "Cập nhật khóa học"
        : "Xuất bản khóa học";

  if (isLoadingCourse) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-28 rounded-3xl bg-white shadow-sm" />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <div className="h-[34rem] rounded-3xl bg-white shadow-sm" />
            </div>
            <div className="h-[30rem] rounded-3xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-950">
            Không thể tải khóa học
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-500">{loadError}</p>
          <button
            type="button"
            onClick={() => router.push("/courses")}
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                {pageTitle}
              </h1>
              <p className="mt-2 text-sm text-slate-500">{pageDescription}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveDraftLabel}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSaving}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {publishLabel}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {formatTabLabel(tab)}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            {activeTab === "Basic Info" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Thông tin cơ bản
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Bắt đầu với những thông tin quan trọng mà học viên sẽ thấy đầu tiên.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Bước 1 / 3
                  </span>
                </div>

                <div className="grid gap-5">
                  <div>
                    <label className={labelClassName}>Tên khóa học</label>
                    <input
                      type="text"
                      value={course.title}
                      onChange={(event) =>
                        updateCourseField("title", event.target.value)
                      }
                      placeholder="Làm chủ phát triển web hiện đại"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className={labelClassName}>Mô tả ngắn</label>
                    <textarea
                      value={course.shortDescription}
                      onChange={(event) =>
                        updateCourseField("shortDescription", event.target.value)
                      }
                      placeholder="Tóm tắt ngắn gọn để hiển thị trên thẻ khóa học."
                      rows={3}
                      className={`${inputClassName} resize-none`}
                    />
                  </div>

                  <div>
                    <label className={labelClassName}>Mô tả chi tiết</label>
                    <textarea
                      value={course.description}
                      onChange={(event) =>
                        updateCourseField("description", event.target.value)
                      }
                      placeholder="Mô tả mục tiêu học tập, dự án thực hành và đối tượng phù hợp."
                      rows={6}
                      className={`${inputClassName} resize-none`}
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <label className={labelClassName}>Tên giảng viên</label>
                      <input
                        type="text"
                        value={course.authorName}
                        onChange={(event) =>
                          updateCourseField("authorName", event.target.value)
                        }
                        placeholder="Cô Mai UI UX"
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>Danh mục</label>
                      <select
                        value={course.category}
                        onChange={(event) =>
                          updateCourseField("category", event.target.value)
                        }
                        className={inputClassName}
                      >
                        <option value="AI">AI</option>
                        <option value="Development">Product Manager</option>
                        <option value="Business">Business Analyst</option>
                        <option value="Design">UIUX</option>
                        <option value="Data">AI Tools</option>
                        <option value="General">Tổng quan</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClassName}>Cấp độ</label>
                      <select
                        value={course.level}
                        onChange={(event) =>
                          updateCourseField("level", event.target.value)
                        }
                        className={inputClassName}
                      >
                        <option value="Beginner">Cơ bản</option>
                        <option value="Intermediate">Trung cấp</option>
                        <option value="Advanced">Nâng cao</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClassName}>Ngôn ngữ</label>
                      <select
                        value={course.language}
                        onChange={(event) =>
                          updateCourseField("language", event.target.value)
                        }
                        className={inputClassName}
                      >
                        <option value="Vietnamese">Tiếng Việt</option>
                        <option value="English">English</option>
                        <option value="Bilingual">Song ngữ</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className={labelClassName}>Giá gốc</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={course.originalPrice}
                        onChange={(event) =>
                          updateCourseField("originalPrice", event.target.value)
                        }
                        placeholder="79.99"
                        className={inputClassName}
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        Giá trước khi giảm, ví dụ 1,709,000
                      </p>
                      {showOriginalPriceWarning ? (
                        <p className="mt-2 text-xs font-medium text-amber-600">
                          Giá gốc nên lớn hơn giá giảm
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label className={labelClassName}>Giá ưu đãi</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={course.discountPrice}
                        onChange={(event) =>
                          updateCourseField("discountPrice", event.target.value)
                        }
                        placeholder="49.99"
                        className={inputClassName}
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        Giá học viên sẽ trả
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className={labelClassName}>Ảnh đại diện khóa học</label>
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
                      <span className="text-2xl">🖼️</span>
                      <span className="mt-2 text-sm font-medium text-slate-700">
                        {isUploadingThumbnail
                          ? "Đang tải ảnh lên..."
                          : "Chọn ảnh"}
                      </span>
                      <span className="mt-1 text-xs text-slate-500">
                        PNG, JPG hoặc WEBP cho ảnh bìa khóa học
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailUpload}
                      />
                    </label>
                  </div>

                  {course.thumbnailUrl && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <Image
                        src={course.thumbnailUrl}
                        alt="Xem trước ảnh đại diện khóa học"
                        width={1200}
                        height={720}
                        className="h-64 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === "Curriculum" && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        Nội dung khóa học
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Thêm bài học, tải video lên và sắp xếp lộ trình học.
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      Bước 2 / 3
                    </span>
                  </div>

                  <div className="grid gap-5">
                    <div>
                      <label className={labelClassName}>Tên bài học</label>
                      <input
                        type="text"
                        value={lessonDraft.title}
                        onChange={(event) =>
                          updateLessonDraft("title", event.target.value)
                        }
                        placeholder="Giới thiệu về khóa học"
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>Mô tả bài học</label>
                      <textarea
                        value={lessonDraft.description}
                        onChange={(event) =>
                          updateLessonDraft("description", event.target.value)
                        }
                        placeholder="Học viên sẽ học được gì trong bài này?"
                        rows={4}
                        className={`${inputClassName} resize-none`}
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
                      <div>
                        <label className={labelClassName}>Thời lượng</label>
                        <input
                          type="text"
                          value={lessonDraft.duration}
                          onChange={(event) =>
                            updateLessonDraft("duration", event.target.value)
                          }
                          placeholder="12"
                          className={inputClassName}
                        />
                        <p className="mt-2 text-xs text-slate-500">
                          Local video sẽ tự lấy thời lượng thật. Bunny link có thể nhập thủ công, ví dụ `08:35` hoặc `01:02:18`.
                        </p>
                      </div>

                      <div className="flex items-end">
                        <label className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div>
                            <span className="block text-sm font-medium text-slate-700">
                              Cho học thử
                            </span>
                            <span className="mt-1 block text-xs text-slate-500">
                              Cho phép học viên xem bài học này trước khi đăng ký
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={lessonDraft.isFreePreview}
                            onChange={(event) =>
                              updateLessonDraft(
                                "isFreePreview",
                                event.target.checked,
                              )
                            }
                            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className={labelClassName}>Nguồn video</label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {([
                          { value: "local", label: "Local video" },
                          { value: "bunny", label: "Bunny link" },
                        ] as const).map((option) => {
                          const isActive = lessonDraft.videoSource === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                setLessonDraft((prev) => ({
                                  ...prev,
                                  videoSource: option.value,
                                  videoUrl:
                                    prev.videoSource === option.value
                                      ? prev.videoUrl
                                      : "",
                                }))
                              }
                              className={`rounded-2xl border px-4 py-3 text-left transition ${
                                isActive
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span className="block text-sm font-semibold">
                                {option.label}
                              </span>
                              <span className="mt-1 block text-xs text-slate-500">
                                {option.value === "local"
                                  ? "Upload video lên hệ thống."
                                  : "Dán Bunny embed URL cho bài học."}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {lessonDraft.videoSource === "local" ? (
                      <div>
                        <label className={labelClassName}>Video bài học</label>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
                          <span className="text-2xl">🎬</span>
                          <span className="mt-2 text-sm font-medium text-slate-700">
                            {isUploadingVideo
                              ? "Đang tải video lên..."
                              : "Chọn video bài học"}
                          </span>
                          <span className="mt-1 text-xs text-slate-500">
                            MP4 hoặc các định dạng video tương thích
                          </span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleVideoUpload}
                          />
                        </label>
                      </div>
                    ) : (
                      <div>
                        <label className={labelClassName}>Nhập Bunny embed URL</label>
                        <input
                          type="url"
                          value={lessonDraft.videoUrl}
                          onChange={(event) =>
                            updateLessonDraft("videoUrl", event.target.value)
                          }
                          placeholder="https://iframe.mediadelivery.net/embed/..."
                          className={inputClassName}
                        />
                        <p className="mt-2 text-xs text-slate-500">
                          Dán trực tiếp Bunny embed URL cho bài học này.
                        </p>
                      </div>
                    )}

                    {lessonDraft.videoUrl && (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                        {lessonDraft.videoSource === "bunny" ? (
                          <iframe
                            src={lessonDraft.videoUrl}
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                            allowFullScreen
                            className="h-64 w-full border-0"
                            title={lessonDraft.title || "Xem trước Bunny video"}
                          />
                        ) : (
                          <video
                            controls
                            src={lessonDraft.videoUrl}
                            className="h-64 w-full object-cover"
                          />
                        )}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddLesson}
                        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        Thêm bài học
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Danh sách bài học
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Đã thêm {lessons.length} bài học
                      </p>
                    </div>
                  </div>

                  {lessons.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                      <p className="text-sm text-slate-500">
                        Chưa có bài học nào. Hãy tải bài học đầu tiên để bắt đầu xây dựng nội dung khóa học.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lessons.map((lesson) => (
                        <div
                          key={lesson.order}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                  Bài học {lesson.order}
                                </span>
                                {lesson.isFreePreview ? (
                                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    Học thử
                                  </span>
                                ) : null}
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-slate-900">
                                  {lesson.title}
                                </h4>
                                <p className="mt-1 text-sm text-slate-600">
                                  {lesson.description || "Chưa có mô tả."}
                                </p>
                              </div>
                              <p className="text-sm text-slate-500">
                                Thời lượng: {lesson.duration || "--:--"}
                              </p>
                              <p className="text-sm text-slate-500">
                                Nguồn video: {lesson.videoSource === "bunny" ? "Bunny link" : "Local video"}
                              </p>
                              <label className="flex max-w-sm items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                <div>
                                  <span className="block text-sm font-medium text-slate-700">
                                    Cho học thử
                                  </span>
                                  <span className="mt-1 block text-xs text-slate-500">
                                    Học viên chưa mua vẫn xem được bài này
                                  </span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={lesson.isFreePreview}
                                  onChange={(event) =>
                                    handleToggleLessonPreview(
                                      lesson.order,
                                      event.target.checked,
                                    )
                                  }
                                  className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                              </label>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteLesson(lesson.order)}
                              className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                            >
                              Xóa
                            </button>
                          </div>

                          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                            {lesson.videoSource === "bunny" ? (
                              <iframe
                                src={lesson.videoUrl}
                                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                allowFullScreen
                                className="h-64 w-full border-0"
                                title={lesson.title}
                              />
                            ) : (
                              <video
                                controls
                                src={lesson.videoUrl}
                                className="h-64 w-full object-cover"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          <aside className="h-fit xl:sticky xl:top-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg transition-shadow hover:shadow-xl">
              {course.thumbnailUrl ? (
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <Image
                    src={course.thumbnailUrl}
                    alt="Ảnh xem trước khóa học"
                    fill
                    sizes="(max-width: 1280px) 100vw, 360px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative aspect-video overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.2),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#e2e8f0_100%)]">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.45)_52%,transparent_100%)]" />
                  <div className="relative flex h-full flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm backdrop-blur">
                        Xem trước khóa học
                      </span>
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        16:9
                      </span>
                    </div>
                    <div className="max-w-[13rem]">
                      <p className="text-lg font-semibold leading-6 text-slate-900">
                        Thêm ảnh đại diện khóa học
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Tải lên ảnh bìa nổi bật để thẻ khóa học trông hoàn chỉnh hơn.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6 p-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {formatCourseCategoryPreview(course.category)}
                  </p>
                  <h3 className="line-clamp-2 text-[1.35rem] font-bold leading-7 tracking-tight text-slate-950">
                    {course.title || "Khóa học chưa có tên"}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    {course.authorName.trim() || "Cô Mai UI UX"}
                  </p>
                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
                    {courseSummary ||
                      "Viết mô tả ngắn để học viên nhanh chóng hiểu giá trị của khóa học này."}
                  </p>
                </div>

                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2 text-sm">
                  <span className="font-medium text-amber-600">★ 4.8</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{lessons.length} bài học</span>
                </div>

                <div className="flex min-w-0 flex-wrap items-end gap-x-3 gap-y-1">
                  <p className="min-w-0 break-words text-2xl font-bold leading-tight tracking-tight text-slate-950">
                    {formatPreviewPriceVnd(discountedPriceValue)}
                  </p>
                  {originalPriceValue ? (
                    <p className="min-w-0 break-words pb-0.5 text-sm font-medium text-slate-400 line-through">
                      {formatPreviewPriceVnd(originalPriceValue)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

async function extractVideoDuration(file: File) {
  return new Promise<string>((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const durationSeconds =
        Number.isFinite(video.duration) && video.duration > 0
          ? Math.round(video.duration)
          : 0;
      URL.revokeObjectURL(objectUrl);
      resolve(durationSeconds > 0 ? formatVideoDuration(durationSeconds) : "");
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve("");
    };
    video.src = objectUrl;
  });
}

function formatVideoDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  }

  return [minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function formatPreviewPriceVnd(value: string) {
  const amount = Number(value);

  if (!value || !Number.isFinite(amount) || amount <= 0) {
    return "Miễn phí";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCourseCategoryPreview(category: string) {
  switch (category) {
    case "AI":
      return "AI Product Manager";
    case "Development":
      return "Product Manager";
    case "Business":
      return "Business Analyst";
    case "Design":
      return "UIUX";
    case "Data":
      return "AI Tools";
    default:
      return "Tổng quan";
  }
}

function formatTabLabel(tab: TabKey) {
  switch (tab) {
    case "Basic Info":
      return "Thông tin cơ bản";
    case "Curriculum":
      return "Nội dung khóa học";
    case "Publish":
      return "Xuất bản";
    default:
      return tab;
  }
}
