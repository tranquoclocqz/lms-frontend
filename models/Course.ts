// @ts-nocheck
import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface Lesson {
  title: string;
  description?: string;
  videoSource: "local" | "bunny";
  videoUrl?: string;
  duration?: string;
  isFreePreview: boolean;
  order: number;
}

export interface CourseDocument {
  title: string;
  shortDescription?: string;
  description?: string;
  thumbnailUrl?: string;
  authorName?: string;
  category?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language?: string;
  price?: number;
  originalPrice?: number;
  discountPrice?: number;
  status: "Draft" | "Published";
  lessons: Lesson[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type CourseModelDocument = Document<unknown, unknown, CourseDocument> &
  CourseDocument;

const LessonSchema = new Schema<Lesson>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    videoSource: {
      type: String,
      enum: ["local", "bunny"],
      default: "local",
    },
    videoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    duration: {
      type: String,
      default: "",
      trim: true,
    },
    isFreePreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const CourseSchema = new Schema<CourseDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      default: "",
      trim: true,
    },
    authorName: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    language: {
      type: String,
      default: "English",
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
    lessons: {
      type: [LessonSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Course: Model<CourseDocument> =
  (mongoose.models?.Course as Model<CourseDocument>) ||
  mongoose.model<CourseDocument>("Course", CourseSchema);

export default Course;
