export async function GET() {
  const students = [
    {
      id: 1,
      name: "Nguyễn An",
      email: "an@gmail.com",
      course: "React Basic",
      progress: 72,
      status: "Đang học",
    },
    {
      id: 2,
      name: "Trần Bình",
      email: "binh@gmail.com",
      course: "UI/UX Design",
      progress: 45,
      status: "Đang học",
    },
  ];

  return Response.json(students);
}
