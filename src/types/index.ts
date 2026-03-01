export type Language = 'ru' | 'en';
export type ClefMode = 'treble' | 'bass' | 'mixed';

export interface NoteDefinition {
  id: string;
  midi: number;
  staffPosition: number;
  clef: 'treble' | 'bass';
  name: { ru: string; en: string };
  octave: { ru: string; en: string };
  isBlack: boolean;
}

export interface KeyDefinition {
  noteId: string;
  midi: number;
  isBlack: boolean;
  label: { ru: string; en: string };
}

export interface LessonAttempt {
  noteId: string;
  correct: boolean;
}

export interface LessonResult {
  clefMode: ClefMode;
  score: number;
  total: number;
  attempts: LessonAttempt[];
  playedAt: string;
}

export interface UserProgress {
  totalLessons: number;
  totalCorrect: number;
  totalWrong: number;
  lastPlayedAt: string | null;
}

export type GamePhase = 'playing' | 'correct' | 'wrong' | 'finished';
