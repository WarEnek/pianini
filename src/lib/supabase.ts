import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { get, set } from 'idb-keyval';
import type { LessonResult, ClefMode, UserProgress } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}

export function isSupabaseConfigured(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
}

export async function signUp(email: string, password: string) {
  const client = getClient();
  if (!client) throw new Error('Supabase not configured');
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const client = getClient();
  if (!client) throw new Error('Supabase not configured');
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = getClient();
  if (!client) return;
  await client.auth.signOut();
}

export async function getUser(): Promise<User | null> {
  const client = getClient();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  return data.user;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  const client = getClient();
  if (!client) return { unsubscribe: () => {} };

  const { data } = client.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return { unsubscribe: () => data.subscription.unsubscribe() };
}

const SYNC_QUEUE_KEY = 'pianinni_sync_queue';

interface SyncQueueItem {
  type: 'lesson_result';
  data: LessonResult;
  createdAt: string;
}

export async function queueForSync(result: LessonResult): Promise<void> {
  const queue = (await get<SyncQueueItem[]>(SYNC_QUEUE_KEY)) ?? [];
  queue.push({
    type: 'lesson_result',
    data: result,
    createdAt: new Date().toISOString(),
  });
  await set(SYNC_QUEUE_KEY, queue);
}

export async function syncToCloud(): Promise<void> {
  const client = getClient();
  if (!client) return;

  const { data: userData } = await client.auth.getUser();
  if (!userData.user) return;

  const userId = userData.user.id;
  const queue = (await get<SyncQueueItem[]>(SYNC_QUEUE_KEY)) ?? [];
  if (queue.length === 0) return;

  for (const item of queue) {
    if (item.type === 'lesson_result') {
      const result = item.data;
      await client.from('lesson_history').insert({
        user_id: userId,
        clef_mode: result.clefMode,
        score: result.score,
        total: result.total,
        notes_played: result.attempts,
        played_at: result.playedAt,
      });
    }
  }

  const progressData = await get<Record<ClefMode, UserProgress>>('pianinni_progress');
  if (progressData) {
    for (const mode of ['treble', 'bass', 'mixed'] as ClefMode[]) {
      const p = progressData[mode];
      await client.from('progress').upsert(
        {
          user_id: userId,
          clef_mode: mode,
          total_lessons: p.totalLessons,
          total_correct: p.totalCorrect,
          total_wrong: p.totalWrong,
          last_played_at: p.lastPlayedAt,
        },
        { onConflict: 'user_id,clef_mode' },
      );
    }
  }

  await set(SYNC_QUEUE_KEY, []);
}
