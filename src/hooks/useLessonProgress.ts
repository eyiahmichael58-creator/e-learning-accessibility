'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

export function useLessonProgress() {
  const supabase = createClient();
  const { user } = useAuth();
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Fetch all completed lessons for the logged-in user
  const fetchProgress = useCallback(async () => {
    if (!user) {
      setLoadingProgress(false);
      return;
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id);

    if (data && !error) {
      const ids = new Set(data.map((row: any) => row.lesson_id));
      setCompletedLessonIds(ids);
    }
    setLoadingProgress(false);
  }, [user, supabase]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Toggle completion status
  const toggleCompletion = async (lessonId: string, isCompleted: boolean) => {
    if (!user) return;

    if (isCompleted) {
      // Remove from DB (Mark as incomplete)
      const { error } = await supabase
        .from('lesson_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId);

      if (!error) {
        setCompletedLessonIds((prev) => {
          const updated = new Set(prev);
          updated.delete(lessonId);
          return updated;
        });
      }
    } else {
      // Insert into DB (Mark as complete)
      const { error } = await supabase
        .from('lesson_progress')
        .insert([{ user_id: user.id, lesson_id: lessonId }]);

      if (!error) {
        setCompletedLessonIds((prev) => {
          const updated = new Set(prev);
          updated.add(lessonId);
          return updated;
        });
      }
    }
  };

  return { completedLessonIds, loadingProgress, toggleCompletion };
}