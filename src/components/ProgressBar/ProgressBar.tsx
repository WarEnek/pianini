import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div class={styles.track}>
      <div class={styles.fill} style={{ width: `${pct}%` }} />
    </div>
  );
}
