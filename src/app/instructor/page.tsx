'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CourseOption {
  id: string;
  title: string;
}

interface LessonOption {
  id: string;
  title: string;
  course_id: string;
}

export default function InstructorPanel() {
  const supabase = createClient();

  // Database Option Maps
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [statusMessage, setStatusMessage] = useState({ text: '', isError: false });

  // 1. Course Creation Form States
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');

  // 2. Lesson Creation Form States
  const [targetCourseId, setTargetCourseId] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);

  // 3. Quiz Question Form States
  const [targetLessonId, setTargetLessonId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  // Sync relational lists from Supabase
  const refreshPublisherData = async () => {
    const { data: coursesData } = await supabase.from('courses').select('id, title').order('title');
    const { data: lessonsData } = await supabase.from('lessons').select('id, title, course_id').order('order_index');
    
    if (coursesData) {
      setCourses(coursesData);
      if (coursesData.length > 0 && !targetCourseId) setTargetCourseId(coursesData[0].id);
    }
    if (lessonsData) {
      setLessons(lessonsData);
      if (lessonsData.length > 0 && !targetLessonId) setTargetLessonId(lessonsData[0].id);
    }
  };

  useEffect(() => {
    refreshPublisherData();
  }, [supabase]);

  const triggerNotification = (text: string, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => setStatusMessage({ text: '', isError: false }), 5000);
  };

  // Deployment Handler: New Course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    const { error } = await supabase
      .from('courses')
      .insert([{ title: courseTitle, description: courseDesc }]);

    if (error) {
      triggerNotification(`Course creation failed: ${error.message}`, true);
    } else {
      triggerNotification('Course successfully deployed to catalog!');
      setCourseTitle('');
      setCourseDesc('');
      refreshPublisherData();
    }
  };

  // Deployment Handler: New Lesson Module
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCourseId || !lessonTitle.trim()) return;

    const { error } = await supabase
      .from('lessons')
      .insert([{ 
        course_id: targetCourseId, 
        title: lessonTitle, 
        content: lessonContent, 
        order_index: Number(orderIndex) 
      }]);

    if (error) {
      triggerNotification(`Lesson deployment failed: ${error.message}`, true);
    } else {
      triggerNotification(`Lesson "${lessonTitle}" added successfully!`);
      setLessonTitle('');
      setLessonContent('');
      setOrderIndex(prev => prev + 1);
      refreshPublisherData();
    }
  };

  // Deployment Handler: Quiz Array Question
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLessonId || !questionText.trim()) return;
    
    const filteredOptions = options.filter(opt => opt.trim() !== '');
    if (filteredOptions.length < 2) {
      triggerNotification('Quizzes require at least two functional answer choices.', true);
      return;
    }

    const { error } = await supabase
      .from('quiz_questions')
      .insert([{
        lesson_id: targetLessonId,
        question_text: questionText,
        options: filteredOptions,
        correct_index: correctIndex
      }]);

    if (error) {
      triggerNotification(`Quiz anchoring failed: ${error.message}`, true);
    } else {
      triggerNotification('Quiz query successfully anchored to tracking block!');
      setQuestionText('');
      setOptions(['', '', '']);
      setCorrectIndex(0);
    }
  };

  const handleOptionChange = (idx: number, value: string) => {
    const updated = [...options];
    updated[idx] = value;
    setOptions(updated);
  };

  const addOptionField = () => setOptions([...options, '']);

  // Filter lessons based on selected course for easier navigation inside the quiz form
  const filteredLessonsForQuiz = lessons.filter(l => !targetCourseId || l.course_id === targetCourseId);

  return (
    <div className="min-h-screen bg-inherit p-6 md:p-12 max-w-5xl mx-auto space-y-10">
      
      {/* PANEL TITLE */}
      <header className="border-b border-slate-200 dark:border-zinc-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Instructor CMS Hub</h1>
        <p className="opacity-70 mt-1 text-sm">Deploy courses, insert text markdown parameters, and build multiple-choice evaluation metrics.</p>
      </header>

      {/* NOTIFICATION TOAST */}
      {statusMessage.text && (
        <div className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
          statusMessage.isError 
            ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400' 
            : 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
        }`}>
          {statusMessage.text}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        
        {/* COLUMN 1: TRACK CREATOR */}
        <div className="space-y-8">
          {/* SECTION A: CREATE COURSE */}
          <section className="border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl bg-inherit space-y-4 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight">1. Deploy a New Course Track</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase opacity-60">Course Title</label>
                <input 
                  type="text" 
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g., Advanced Pedagogy Foundations"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 bg-inherit rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase opacity-60">Description</label>
                <textarea 
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="Summarize course content scopes and milestones..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 bg-inherit rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold text-xs tracking-wider uppercase rounded-xl hover:bg-blue-700 transition">
                Publish Course Track
              </button>
            </form>
          </section>

          {/* SECTION B: CREATE LESSON */}
          <section className="border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl bg-inherit space-y-4 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight">2. Insert Lesson Module Block</h2>
            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase opacity-60">Target Course Track</label>
                <select 
                  value={targetCourseId}
                  onChange={(e) => setTargetCourseId(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3 space-y-1">
                  <label className="text-xs font-bold uppercase opacity-60">Lesson Title</label>
                  <input 
                    type="text" 
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="e.g., Module 1: Core Mechanics"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 bg-inherit rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase opacity-60">Order</label>
                  <input 
                    type="number" 
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    min={1}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 bg-inherit rounded-xl text-sm focus:outline-none focus:border-blue-500 text-center"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase opacity-60">Lesson Content Text</label>
                <textarea 
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  placeholder="Paste complete lesson reading arrays here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 bg-inherit rounded-xl text-sm focus:outline-none focus:border-blue-500 whitespace-pre-wrap"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold text-xs tracking-wider uppercase rounded-xl hover:bg-emerald-700 transition">
                Deploy Lesson Module
              </button>
            </form>
          </section>
        </div>

        {/* COLUMN 2: EXAMINER BLOCK */}
        <div className="space-y-8">
          <section className="border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl bg-inherit space-y-4 shadow-sm h-full">
            <h2 className="text-lg font-bold tracking-tight">3. Anchor Multiple-Choice Quiz</h2>
            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase opacity-60">Filter Course context</label>
                <select 
                  value={targetCourseId} 
                  onChange={(e) => setTargetCourseId(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-sm focus:outline-none"
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase opacity-60">Target Lesson Module</label>
                <select 
                  value={targetLessonId}
                  onChange={(e) => setTargetLessonId(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                >
                  {filteredLessonsForQuiz.length === 0 ? <option value="">No matching lessons found</option> : null}
                  {filteredLessonsForQuiz.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase opacity-60">Question Text</label>
                <input 
                  type="text" 
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g., Which configuration best handles asset memory drops?"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 bg-inherit rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase opacity-60">Answer Options & Correct Key</label>
                  <button type="button" onClick={addOptionField} className="text-xs text-blue-500 dark:text-yellow-400 font-bold hover:underline">
                    + Add Field
                  </button>
                </div>
                
                {options.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="correct_index" 
                      checked={correctIndex === idx}
                      onChange={() => setCorrectIndex(idx)}
                      className="w-4 h-4 text-blue-600 accent-blue-600 dark:accent-yellow-400"
                    />
                    <input 
                      type="text" 
                      value={option}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Choice variant ${idx + 1}...`}
                      className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-zinc-800 bg-inherit rounded-xl text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full mt-2 py-3 bg-slate-900 text-white dark:bg-yellow-400 dark:text-black font-bold text-xs tracking-wider uppercase rounded-xl hover:opacity-95 transition">
                Anchor Quiz Question
              </button>
            </form>
          </section>
        </div>

      </div>
    </div>
  );
}