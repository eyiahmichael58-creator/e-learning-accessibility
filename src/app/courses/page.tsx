import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 0; // Ensure fresh data on every request

export default async function CoursesPage() {
  const supabase = await createClient();

  // Fetch courses along with the instructor's profile name
  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      profiles (full_name)
    `);

  if (error) {
    return (
      <div className="p-8 text-center text-rose-600">
        Error loading courses: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      <header className="border-b pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Available Courses</h1>
        <p className="text-slate-600 mt-2">Select a course to begin your personalized learning journey.</p>
      </header>

      {courses?.length === 0 ? (
        <div className="p-12 text-center bg-white border rounded-2xl text-slate-500">
          No courses have been created yet. Populate your `courses` table in the Supabase dashboard to see them here!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-800">{course.title}</h2>
                <p className="text-slate-600 text-sm line-clamp-3">{course.description}</p>
              </div>
              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  By: {(course.profiles as any)?.full_name || 'Guest Instructor'}
                </span>
                <Link href={`/lessons/${course.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  View Lessons
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}