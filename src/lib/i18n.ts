import type { Language } from '../types';

const translations = {
  ru: {
    chooseLanguage: 'На каком языке\nбудем учиться?',
    russian: 'Русский',
    english: 'English',
    chooseClef: 'Какой ключ\nбудем учить?',
    bass: 'Басовый',
    treble: 'Скрипичный',
    bothClefs: 'Оба ключа',
    leftHand: 'ЛЕВАЯ РУКА',
    rightHand: 'ПРАВАЯ РУКА',
    mixedMode: 'СМЕШАНЫЙ РЕЖИМ',
    playNote: 'Сыграй ноту',
    purrfecto: 'Замурчательно!',
    tryAgain: 'Попробуй еще раз',
    lessonComplete: 'Замурчательно!',
    lessonCompleteSubtitle: 'Вы отлично справились',
    repeatLesson: 'ПОВТОРИТЬ УРОК',
    needRest: 'НАДО ОТДОХНУТЬ',
  },
  en: {
    chooseLanguage: 'Choose your\nlanguage',
    russian: 'Русский',
    english: 'English',
    chooseClef: 'Which clef\nto learn?',
    bass: 'Bass',
    treble: 'Treble',
    bothClefs: 'Both clefs',
    leftHand: 'LEFT HAND',
    rightHand: 'RIGHT HAND',
    mixedMode: 'MIXED MODE',
    playNote: 'Play note',
    purrfecto: 'Purrfecto!',
    tryAgain: 'Try again',
    lessonComplete: 'Purrfecto!',
    lessonCompleteSubtitle: 'You did great',
    repeatLesson: 'REPEAT LESSON',
    needRest: 'NEED A REST',
  },
} as const;

export type TranslationKey = keyof typeof translations.ru;

let currentLanguage: Language = (localStorage.getItem('pianinni_lang') as Language) || 'ru';

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  localStorage.setItem('pianinni_lang', lang);
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function t(key: TranslationKey): string {
  return translations[currentLanguage][key];
}
