'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface CourseCardData {
  id: string;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const supabase = createClient();

  const [courses, setCourses] = useState<CourseCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCompleted: 0, activeTracks: 0 });

  useEffect(() => {
    async function compileDashboardMetrics() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch all system courses
        const { data: coursesData, error: coursesErr } = await supabase
          .from('courses')
          .select('id, title, description');

        // 2. Fetch all system lessons to build layout maps
        const { data: lessonsData, error: lessonsErr } = await supabase
          .from('lessons')
          .select('id, course_id');

        // 3. Fetch current student's completion data
        const { data: progressData, error: progressErr } = await supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', user.id);

        if (coursesErr || lessonsErr || progressErr) throw coursesErr || lessonsErr || progressErr;

        // Build a quick lookup set for completed lesson tracking IDs
        const completedSet = new Set((progressData || []).map((p) => p.lesson_id));

        // 4. Map records into layout metrics
        let tracksStarted = 0;
        const compiledCourses: CourseCardData[] = (coursesData || []).map((course) => {
          const courseLessons = (lessonsData || []).filter((l) => l.course_id === course.id);
          const total = courseLessons.length;
          
          const completed = courseLessons.filter((l) => completedSet.has(l.id)).length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

          if (completed > 0) tracksStarted++;

          return {
            id: course.id,
            title: course.title,
            description: course.description,
            totalLessons: total,
            completedLessons: completed,
            percentage: pct,
          };
        });

        setCourses(compiledCourses);
        setStats({
          totalCompleted: completedSet.size,
          activeTracks: tracksStarted,
        });
      } catch (err) {
        console.error('Error compiling student metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    compileDashboardMetrics();
  }, [user, supabase]);

  if (!user) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium bg-inherit">
        Access Denied. Please log in to view your learning dashboard metrics.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium bg-inherit animate-pulse">
        Compiling your syllabus layout matrix...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-inherit p-6 md:p-12 max-w-6xl mx-auto space-y-10">
      
      {/* HEADER PANELS */}
      <header className="border-b border-slate-200 dark:border-zinc-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Student Workspace</h1>
          <p className="opacity-70 mt-1 text-sm">Review your active course tracking progress arrays and learning milestones.</p>
        </div>
        <div className="flex gap-4">
          <div className="border border-slate-200 dark:border-zinc-800 px-4 py-2 rounded-2xl bg-inherit text-center min-w-[100px]">
            <span className="block text-2xl font-black text-blue-500">{stats.activeTracks}</span>
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">Active Tracks</span>
          </div>
          <div className="border border-slate-200 dark:border-zinc-800 px-4 py-2 rounded-2xl bg-inherit text-center min-w-[100px]">
            <span className="block text-2xl font-black text-emerald-500">{stats.totalCompleted}</span>
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">Modules Done</span>
          </div>
        </div>
      </header>

      {/* CORE SYLLABUS TRACK CARDS GRID */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Your Course Catalog</h2>
          <p className="text-xs opacity-60 mt-0.5">Select an individual module block row container to resume reading tracks.</p>
        </div>

        {courses.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl p-12 text-center text-slate-400">
            No courses have been deployed by instructors yet. 
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 bg-inherit flex flex-col justify-between shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-yellow-400/50 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-blue-500 dark:text-blue-400">
                      Syllabus Track
                    </span>
                    <span className="text-xs font-bold px-2 py-1 bg-slate-500/10 rounded-lg opacity-80">
                      {course.totalLessons} Lessons
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-xs opacity-70 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* INTEGRATED PROGRESS ROW */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-900 space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="opacity-70">
                      {course.completedLessons} of {course.totalLessons} Complete
                    </span>
                    <span className="text-blue-500 dark:text-yellow-400 font-bold">
                      {course.percentage}%
                    </span>
                  </div>
                  
                  {/* Progress Line Track */}
                  <div className="w-full h-2 bg-slate-500/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 dark:bg-yellow-400 transition-all duration-500 ease-out"
                      style={{ width: `${course.percentage}%` }}
                    />
                  </div>

                  <Link 
                    href={`/lessons/${course.id}`}
                    className="mt-4 w-full block text-center py-3 bg-slate-500/10 hover:bg-blue-600 hover:text-white dark:hover:bg-yellow-400 dark:hover:text-black rounded-xl text-xs font-bold tracking-wide transition-all uppercase"
                  >
                    {course.percentage === 100 ? 'Review Syllabus' : course.percentage > 0 ? 'Resume Course' : 'Enter Classroom'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}