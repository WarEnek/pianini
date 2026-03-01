import { CatMascot } from '../components/CatMascot/CatMascot';
import type { ClefMode, Language } from '../types';
import { t } from '../lib/i18n';
import styles from './ClefSelectScreen.module.css';

interface ClefSelectScreenProps {
  lang: Language;
  onSelect: (mode: ClefMode) => void;
}

const MUSIC_FONT = "'Noto Music', serif";

function BassClefIcon() {
  return (
    <span style={{ fontFamily: MUSIC_FONT, fontSize: '48px', color: 'var(--color-primary)', lineHeight: 1 }}>
      {'\u{1D122}'}
    </span>
  );
}

function TrebleClefIcon() {
  return (
    <span style={{ fontFamily: MUSIC_FONT, fontSize: '56px', color: 'var(--color-primary)', lineHeight: 1 }}>
      {'\u{1D11E}'}
    </span>
  );
}

export function ClefSelectScreen({ lang: _lang, onSelect }: ClefSelectScreenProps) {
  return (
    <div class={styles.container}>
      <div class={styles.top}>
        <CatMascot size={120} />
        <h1 class={styles.title}>{t('chooseClef')}</h1>
      </div>

      <div class={styles.options}>
        <div class={styles.row}>
          <button class={styles.card} onClick={() => onSelect('bass')}>
            <BassClefIcon />
            <span class={styles.cardLabel}>{t('bass')}</span>
            <span class={styles.cardSub}>{t('leftHand')}</span>
          </button>
          <button class={styles.card} onClick={() => onSelect('treble')}>
            <TrebleClefIcon />
            <span class={styles.cardLabel}>{t('treble')}</span>
            <span class={styles.cardSub}>{t('rightHand')}</span>
          </button>
        </div>
        <button class={styles.wideCard} onClick={() => onSelect('mixed')}>
          <span class={styles.cardLabel}>{t('bothClefs')}</span>
          <span class={styles.cardSub}>{t('mixedMode')}</span>
        </button>
      </div>

      <div class={styles.brand}>Pianinni</div>
    </div>
  );
}
