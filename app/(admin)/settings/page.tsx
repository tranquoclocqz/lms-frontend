"use client";

import { useEffect, useState } from "react";
import { demoTeacherSettings } from "@/lib/ui-demo-data";
import type { TeacherSettings } from "@/typing";

type SettingsResponse = {
  success?: boolean;
  settings?: TeacherSettings;
  message?: string;
};

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

const textareaClassName =
  "min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

const initialSettings: TeacherSettings = {
  displayName: "",
  email: "",
  avatarUrl: "",
  supportEmail: "",
  bankName: "",
  bankAccountNumber: "",
  bankAccountHolder: "",
  defaultPaymentContent: "",
  allowStudentSignup: true,
};

function normalizeSettings(settings?: Partial<TeacherSettings>): TeacherSettings {
  return {
    ...initialSettings,
    ...settings,
    displayName: settings?.displayName || "",
    email: settings?.email || "",
    avatarUrl: settings?.avatarUrl || "",
    supportEmail: settings?.supportEmail || "",
    bankName: settings?.bankName || "",
    bankAccountNumber: settings?.bankAccountNumber || "",
    bankAccountHolder: settings?.bankAccountHolder || "",
    defaultPaymentContent: settings?.defaultPaymentContent || "",
    allowStudentSignup:
      typeof settings?.allowStudentSignup === "boolean"
        ? settings.allowStudentSignup
        : true,
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<TeacherSettings>(normalizeSettings(demoTeacherSettings));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchSettings() {
    try {
      setLoading(true);
      setError("");
      setSettings(normalizeSettings(demoTeacherSettings));
    } catch (fetchError) {
      console.error(fetchError);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Không thể tải cài đặt giảng viên",
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof TeacherSettings>(
    field: K,
    value: TeacherSettings[K],
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      setSettings(normalizeSettings(settings));
      setSuccess("Đã lưu cài đặt thành công.");
    } catch (saveError) {
      console.error(saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Không thể lưu cài đặt giảng viên",
      );
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSettings();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Cài đặt
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Cập nhật thông tin giảng viên, thanh toán và cấu hình học viên ở
            mức cơ bản.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
            Đang tải cài đặt...
          </div>
        ) : (
          <>
            {success ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 shadow-sm">
                {success}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600 shadow-sm">
                {error}
              </div>
            ) : null}

            <div className="space-y-5">
              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">
                  Hồ sơ giảng viên
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Thông tin cơ bản hiển thị cho tài khoản giảng viên.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Tên hiển thị
                    </span>
                    <input
                      type="text"
                      value={settings.displayName}
                      onChange={(event) =>
                        updateField("displayName", event.target.value)
                      }
                      className={inputClassName}
                      placeholder="Nhập tên hiển thị"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </span>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      className={inputClassName}
                      placeholder="giangvien@example.com"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Ảnh đại diện URL
                    </span>
                    <input
                      type="url"
                      value={settings.avatarUrl}
                      onChange={(event) =>
                        updateField("avatarUrl", event.target.value)
                      }
                      className={inputClassName}
                      placeholder="https://..."
                    />
                  </label>
                </div>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">
                  Thông tin thanh toán
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Dùng cho các luồng thanh toán và hướng dẫn chuyển khoản sau
                  này.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Ngân hàng
                    </span>
                    <input
                      type="text"
                      value={settings.bankName}
                      onChange={(event) =>
                        updateField("bankName", event.target.value)
                      }
                      className={inputClassName}
                      placeholder="Ví dụ: Sacombank"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Số tài khoản
                    </span>
                    <input
                      type="text"
                      value={settings.bankAccountNumber}
                      onChange={(event) =>
                        updateField("bankAccountNumber", event.target.value)
                      }
                      className={inputClassName}
                      placeholder="Nhập số tài khoản"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Chủ tài khoản
                    </span>
                    <input
                      type="text"
                      value={settings.bankAccountHolder}
                      onChange={(event) =>
                        updateField("bankAccountHolder", event.target.value)
                      }
                      className={inputClassName}
                      placeholder="Nhập tên chủ tài khoản"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Nội dung chuyển khoản mặc định
                    </span>
                    <textarea
                      value={settings.defaultPaymentContent}
                      onChange={(event) =>
                        updateField("defaultPaymentContent", event.target.value)
                      }
                      className={textareaClassName}
                      placeholder="Ví dụ: THANH TOAN KHOA HOC"
                    />
                  </label>
                </div>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">
                  Cấu hình học viên
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Thiết lập thông tin hỗ trợ và quyền tự đăng ký của học viên.
                </p>

                <div className="mt-5 grid gap-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Email hỗ trợ
                    </span>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(event) =>
                        updateField("supportEmail", event.target.value)
                      }
                      className={inputClassName}
                      placeholder="support@example.com"
                    />
                  </label>

                  <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Cho phép học viên tự đăng ký
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Bật để học viên có thể tự tạo tài khoản và tham gia hệ
                        thống.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "allowStudentSignup",
                          !settings.allowStudentSignup,
                        )
                      }
                      className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
                        settings.allowStudentSignup
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      {settings.allowStudentSignup ? "Đang bật" : "Đang tắt"}
                    </button>
                  </div>
                </div>
              </article>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {saving ? "Đang lưu..." : "Lưu cài đặt"}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
