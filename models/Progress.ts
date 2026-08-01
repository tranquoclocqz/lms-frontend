// @ts-nocheck
import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ProgressDocument {
  courseId: Schema.Types.ObjectId;
  lessonId: string;
  studentEmail: string;
  completed: boolean;
  completedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProgressModelDocument =
  Document<unknown, unknown, ProgressDocument> & ProgressDocument;

const ProgressSchema = new Schema<ProgressDocument>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessonId: {
      type: String,
      required: true,
      trim: true,
    },
    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

ProgressSchema.index(
  { courseId: 1, lessonId: 1, studentEmail: 1 },
  { unique: true },
);

const Progress: Model<ProgressDocument> =
  (mongoose.models?.Progress as Model<ProgressDocument>) ||
  mongoose.model<ProgressDocument>("Progress", ProgressSchema);

export default Progress;
