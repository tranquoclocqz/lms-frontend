// @ts-nocheck
import mongoose, { Schema, type Document, type Model } from "mongoose";
import {
  calculateEnrollmentProgress,
  deriveStudentName,
  ENROLLMENT_STATUSES,
  type EnrollmentStatus,
} from "@/lib/enrollment-utils";

export interface EnrollmentDocument {
  courseId: Schema.Types.ObjectId;
  studentName: string;
  studentEmail: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: Date;
  completedAt?: Date | null;
  userId?: string | null;
  orderId?: Schema.Types.ObjectId | null;
  activatedByCode: boolean;
  activationCodeId?: Schema.Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type EnrollmentModelDocument =
  Document<unknown, unknown, EnrollmentDocument> & EnrollmentDocument;

const EnrollmentSchema = new Schema<EnrollmentDocument>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    studentName: {
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

    status: {
      type: String,
      enum: ENROLLMENT_STATUSES,
      default: "active",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    userId: {
      type: String,
      default: null,
      trim: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    activatedByCode: {
      type: Boolean,
      default: false,
    },

    activationCodeId: {
      type: Schema.Types.ObjectId,
      ref: "ActivationCode",
      default: null,
    },
  },
  { timestamps: true },
);

EnrollmentSchema.index({ courseId: 1, studentEmail: 1 }, { unique: true });

EnrollmentSchema.pre("validate", function syncDerivedFields(next) {
  this.studentName = deriveStudentName(this.studentName);
  this.progress = calculateEnrollmentProgress(this.progress, this.status);

  if (this.status === "completed") {
    this.completedAt = this.completedAt || new Date();
  } else if (this.progress < 100) {
    this.completedAt = null;
  }

  next();
});

const Enrollment: Model<EnrollmentDocument> =
  (mongoose.models?.Enrollment as Model<EnrollmentDocument>) ||
  mongoose.model<EnrollmentDocument>("Enrollment", EnrollmentSchema);

export default Enrollment;
