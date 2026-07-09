import { notFound } from 'next/navigation';

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold text-slate-900">Lesson {id}</h1>
      <p className="mt-2 text-slate-600">This lesson content will be loaded here.</p>
    </main>
  );
}
