type LessonLike = {
  order?: number;
};

export function resolveLessonIndex(
  lessons: LessonLike[],
  lessonId: string,
) {
  const numericLessonId = Number(lessonId);

  if (!Number.isInteger(numericLessonId)) {
    return -1;
  }

  if (numericLessonId >= 0 && numericLessonId < lessons.length) {
    return numericLessonId;
  }

  return lessons.findIndex((lesson) => lesson.order === numericLessonId);
}
