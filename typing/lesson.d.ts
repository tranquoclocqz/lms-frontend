export interface ILesson {
  id: number | string;
  course_id: number;
  title: string;
  description: string;
  video_url: string;
  duration_seconds?: number;
  sort_order?: number;
  lesson_section_id?: number | string;
  section?: {
    id: number | string;
    title: string;
    sort_order?: number;
  };
  is_preview?: number;
  created_at?: string;
}

export interface ILessonResponse {
  status: number;
  data: ILesson[];
  message: string;
}