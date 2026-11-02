import { IUser } from "@/typing/user";
import { ICategory } from "@/typing/category";
export interface GetCourseParams {
  highlight?: number;
  category_id?: number;
  order_by?: "price" | "title" | "id";
  order_type?: "asc" | "desc";
}

export interface ICourse {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  price: number;
  original_price: number;
  is_published?: number;
  is_highlighted?: number;
  is_deleted?: number;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  user?: IUser;
  category?: ICategory;
  meta_data?: MetaData;
  total_lessons?: number;
}

export interface MetaData {
  outcome?: string[]
}