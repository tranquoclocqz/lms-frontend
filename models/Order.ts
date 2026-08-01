// @ts-nocheck
import mongoose, { Schema, type Document, type Model } from "mongoose";
import { buildOrderPaymentCode } from "@/lib/sepay";

export interface OrderDocument {
  courseId: Schema.Types.ObjectId;
  userId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  orderCode: string;
  paymentCode: string;
  paymentMethod: string;
  transactionId?: string | null;
  paidAt?: Date | null;
  transactionInfo?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderModelDocument = Document<unknown, unknown, OrderDocument> &
  OrderDocument;

const OrderSchema = new Schema<OrderDocument>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: String,
      default: "demo-user",
      trim: true,
    },
    studentName: {
      type: String,
      default: "Học viên BrainCourse",
      trim: true,
    },
    studentEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    orderCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    paymentCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      default: "sepay",
      trim: true,
    },
    transactionId: {
      type: String,
      default: undefined,
      trim: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    transactionInfo: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

OrderSchema.index(
  { transactionId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      transactionId: { $type: "string" },
    },
  },
);

OrderSchema.pre("validate", function ensurePaymentCode(next) {
  if (!this.paymentCode && this._id) {
    this.paymentCode = buildOrderPaymentCode(String(this._id));
  }

  if (!this.orderCode && this.paymentCode) {
    this.orderCode = this.paymentCode;
  }

  next();
});

const Order: Model<OrderDocument> =
  (mongoose.models?.Order as Model<OrderDocument>) ||
  mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
