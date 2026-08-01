// @ts-nocheck
import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ActivationCodeDocument {
  code: string;
  courseId: Schema.Types.ObjectId;
  isUsed: boolean;
  usedBy?: string | null;
  usedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ActivationCodeModelDocument =
  Document<unknown, unknown, ActivationCodeDocument> & ActivationCodeDocument;

const ActivationCodeSchema = new Schema<ActivationCodeDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedBy: {
      type: String,
      default: null,
      trim: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const ActivationCode: Model<ActivationCodeDocument> =
  (mongoose.models?.ActivationCode as Model<ActivationCodeDocument>) ||
  mongoose.model<ActivationCodeDocument>("ActivationCode", ActivationCodeSchema);

export default ActivationCode;
