// @ts-nocheck
import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface TeacherSettingDocument {
  displayName: string;
  email?: string;
  avatarUrl?: string;
  supportEmail?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  defaultPaymentContent?: string;
  allowStudentSignup: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TeacherSettingModelDocument =
  Document<unknown, unknown, TeacherSettingDocument> & TeacherSettingDocument;

const TeacherSettingSchema = new Schema<TeacherSettingDocument>(
  {
    displayName: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    avatarUrl: {
      type: String,
      default: "",
      trim: true,
    },
    supportEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    bankName: {
      type: String,
      default: "",
      trim: true,
    },
    bankAccountNumber: {
      type: String,
      default: "",
      trim: true,
    },
    bankAccountHolder: {
      type: String,
      default: "",
      trim: true,
    },
    defaultPaymentContent: {
      type: String,
      default: "",
      trim: true,
    },
    allowStudentSignup: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const TeacherSetting: Model<TeacherSettingDocument> =
  (mongoose.models?.TeacherSetting as Model<TeacherSettingDocument>) ||
  mongoose.model<TeacherSettingDocument>(
    "TeacherSetting",
    TeacherSettingSchema,
  );

export default TeacherSetting;
