'use client';
import React, { useEffect, useState, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FontAdjuster } from '@/components/accessibility/FontAdjuster';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { SpeechControl } from '@/components/accessibility/SpeechControl';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { ThemeToggler } from '@/components/accessibility/ThemeToggler';
import { LessonQuiz } from '@/components/learning/LessonQuiz';

interface Lesson {
  id: string;
  title: string;
  content: string;
  order_index: number;
}

export default function LessonRoom({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  
  const supabase = createClient();
  const { speak, stop, isPlaying } = useTextToSpeech();
  const { completedLessonIds, toggleCompletion } = useLessonProgress();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      const { data, error } = await supabase
        .from('lessons')
        .select('id, title, content, order_index')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (data && !error) {
        setLessons(data);
        if (data.length > 0) setActiveLesson(data[0]);
      }
      setLoading(false);
    }
    if (courseId) fetchLessons();
  }, [courseId, supabase]);

  useEffect(() => {
    stop();
  }, [activeLesson, stop]);

  if (loading) return <div className="p-12 text-center text-slate-500 font-medium">Loading lesson layout...</div>;
  if (lessons.length === 0) return <div className="p-12 text-center text-slate-500">No lessons discovered.</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-inherit">
      
      {/* LEFT SIDEBAR: Course Syllabus Map */}
      <aside className="w-full md:w-80 bg-inherit border-r border-slate-200 dark:border-zinc-800 p-6 space-y-6 flex-shrink-0">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider opacity-70">Course Syllabus</h2>
        </div>
        <nav className="space-y-2">
          {lessons.map((lesson) => {
            const isCompleted = completedLessonIds.has(lesson.id);
            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left p-4 rounded-xl border transition-all text-sm font-medium flex justify-between items-center ${
                  activeLesson?.id === lesson.id
                    ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'bg-inherit border-slate-200 dark:border-zinc-800 hover:bg-slate-500/10'
                }`}
              >
                <span>{lesson.order_index}. {lesson.title}</span>
                {isCompleted && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base" title="Lesson Completed">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* RIGHT MAIN CORE: Classroom Frame */}
      <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto space-y-6 w-full">
        
        {/* Voice Command Controller */}
        <SpeechControl 
          onReadAction={() => activeLesson && speak(activeLesson.content)}
          onStopAction={stop}
        />

        {/* Manual Configuration Controls Bar */}
        <section className="flex flex-wrap items-center justify-between gap-4 p-4 bg-inherit border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <FontAdjuster />
            <ThemeToggler /> 
          </div>
          
          <div className="flex gap-3">
            {!isPlaying ? (
              <button onClick={() => activeLesson && speak(activeLesson.content)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition">
                🔊 Read Aloud
              </button>
            ) : (
              <button onClick={stop} className="px-6 py-3 bg-rose-600 text-white rounded-xl font-semibold text-sm hover:bg-rose-700 transition">
                ⏹️ Stop Reading
              </button>
            )}
          </div>
        </section>

        {/* Content Display */}
        {activeLesson && (
          <article className="border border-slate-200 dark:border-zinc-800 p-8 md:p-12 rounded-3xl shadow-sm bg-inherit space-y-8">
            <header className="border-b border-slate-200 dark:border-zinc-800 pb-4 flex justify-between items-start gap-4">
              <div>
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Module {activeLesson.order_index}</span>
                <h1 className="text-3xl font-extrabold mt-1">{activeLesson.title}</h1>
              </div>
            </header>
          
            <div className="leading-relaxed space-y-4 whitespace-pre-line">
              {activeLesson.content}
            </div>

            {/* INTEGRATED QUIZ SECTION */}
            <LessonQuiz lessonId={activeLesson.id} />

            {/* PROGRESS TOGGLE CONTROL BUTTON */}
            <footer className="border-t border-slate-200 dark:border-zinc-800 pt-6 flex justify-end">
              {completedLessonIds.has(activeLesson.id) ? (
                <button
                  onClick={() => toggleCompletion(activeLesson.id, true)}
                  className="px-6 py-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl font-semibold text-sm hover:bg-rose-500/20 transition"
                >
                  ↩ Mark as Incomplete
                </button>
              ) : (
                <button
                  onClick={() => toggleCompletion(activeLesson.id, false)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 shadow-sm transition"
                >
                  ✓ Mark Lesson as Completed
                </button>
              )}
            </footer>
          </article>
        )}
      </main>
    </div>
  );
}