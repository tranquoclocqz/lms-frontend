export interface ILesson {
  id: number | string;
  course_id: number;
  title: string;
  description: string;
  video_url: string;
  duration_seconds?: string | number;
  sort_order?: number;
  is_preview?: number;
  created_at?: string;
}

export interface ILessonResponse {
  success?: boolean;
  data?: ILesson;
  message?: string;
}