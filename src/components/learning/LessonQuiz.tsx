'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface QuizQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_index: number;
}

interface LessonQuizProps {
  lessonId: string;
}

export function LessonQuiz({ lessonId }: { lessonId: string }) {
  const supabase = createClient();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tracks user's chosen option index for each question index: { [questionIndex]: chosenOptionIndex }
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Reset states whenever the student switches to a new lesson
  useEffect(() => {
    async function fetchQuiz() {
      setLoading(true);
      setSubmitted(false);
      setSelectedAnswers({});
      setScore(0);

      const { data, error } = await supabase
        .from('quiz_questions')
        .select('id, question_text, options, correct_index')
        .eq('lesson_id', lessonId);

      if (data && !error) {
        setQuestions(data);
      }
      setLoading(false);
    }

    if (lessonId) fetchQuiz();
  }, [lessonId, supabase]);

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (submitted) return; // Lock selections after submission
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitted) return;

    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_index) {
        finalScore++;
      }
    });

    setScore(finalScore);
    setSubmitted(true);
  };

  if (loading) return <div className="text-xs opacity-60 animate-pulse">Loading comprehension check...</div>;
  if (questions.length === 0) return null; // Hide silently if an instructor hasn't added a quiz yet

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800 space-y-6 bg-inherit">
      <div>
        <h3 className="text-xl font-bold tracking-tight">Comprehension Checkup</h3>
        <p className="text-xs opacity-60 mt-0.5">Test your retention of the concepts covered in this module.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, qIdx) => {
          const hasSelected = selectedAnswers[qIdx] !== undefined;
          
          return (
            <div key={q.id} className="space-y-4">
              <h4 className="text-base font-semibold leading-snug">
                {qIdx + 1}. {q.question_text}
              </h4>
              
              <div className="grid gap-3">
                {q.options.map((option, optIdx) => {
                  const isChosen = selectedAnswers[qIdx] === optIdx;
                  const isCorrect = q.correct_index === optIdx;
                  
                  // Dynamic class computation to match light and high-contrast dark contexts perfectly
                  let optionStyles = 'border-slate-200 dark:border-zinc-800 bg-inherit hover:bg-slate-500/5';
                  
                  if (isChosen && !submitted) {
                    optionStyles = 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500 dark:border-yellow-400 dark:bg-yellow-400/5 dark:ring-yellow-400';
                  } else if (submitted) {
                    if (isCorrect) {
                      // Highlight correct answer in bold green
                      optionStyles = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold';
                    } else if (isChosen && !isCorrect) {
                      // Highlight incorrect choice in soft red
                      optionStyles = 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 line-through';
                    } else {
                      optionStyles = 'border-slate-200 dark:border-zinc-800 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${optionStyles}`}
                    >
                      <span>{option}</span>
                      {submitted && isCorrect && <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>}
                      {submitted && isChosen && !isCorrect && <span className="text-rose-600 dark:text-rose-400 font-bold">✗</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* QUIZ SUBMISSION ACTIONS & FEEDBACK BANNER */}
        <div className="pt-2">
          {!submitted ? (
            <button
              type="submit"
              disabled={Object.keys(selectedAnswers).length < questions.length}
              className="px-6 py-3 bg-slate-900 text-white dark:bg-yellow-400 dark:text-black rounded-xl font-bold text-xs tracking-wider uppercase shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            >
              Submit Checkup Answers
            </button>
          ) : (
            <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:border-yellow-400/20 dark:bg-yellow-400/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold">
                  Review Complete: You scored {score} out of {questions.length}!
                </p>
                <p className="text-xs opacity-70 mt-0.5">
                  {score === questions.length 
                    ? 'Perfect marks! You are fully prepared to advance to the next tracking block.' 
                    : 'Review the modules highlighted in red above to reinforce your understanding.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setSelectedAnswers({});
                  setScore(0);
                }}
                className="px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs font-bold uppercase transition hover:bg-slate-500/5"
              >
                Retry Quiz
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}