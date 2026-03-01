import { get, set } from 'idb-keyval';
import type { LessonResult, UserProgress, ClefMode } from '../types';

const PROGRESS_KEY = 'pianinni_progress';
const HISTORY_KEY = 'pianinni_history';

export async function getProgress(): Promise<Record<ClefMode, UserProgress>> {
  const data = await get<Record<ClefMode, UserProgress>>(PROGRESS_KEY);
  return data ?? {
    treble: { totalLessons: 0, totalCorrect: 0, totalWrong: 0, lastPlayedAt: null },
    bass: { totalLessons: 0, totalCorrect: 0, totalWrong: 0, lastPlayedAt: null },
    mixed: { totalLessons: 0, totalCorrect: 0, totalWrong: 0, lastPlayedAt: null },
  };
}

export async function saveLessonResult(result: LessonResult): Promise<void> {
  const progress = await getProgress();
  const mode = result.clefMode;

  progress[mode] = {
    totalLessons: progress[mode].totalLessons + 1,
    totalCorrect: progress[mode].totalCorrect + result.score,
    totalWrong: progress[mode].totalWrong + (result.total - result.score),
    lastPlayedAt: result.playedAt,
  };

  await set(PROGRESS_KEY, progress);

  const history = (await get<LessonResult[]>(HISTORY_KEY)) ?? [];
  history.push(result);
  await set(HISTORY_KEY, history);
}

export async function getLessonHistory(): Promise<LessonResult[]> {
  return (await get<LessonResult[]>(HISTORY_KEY)) ?? [];
}
