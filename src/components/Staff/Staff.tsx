import type { NoteDefinition } from '../../types';
import styles from './Staff.module.css';

interface StaffProps {
  note: NoteDefinition;
  feedback: 'none' | 'correct' | 'wrong';
}

const STAFF_WIDTH = 360;
const STAFF_HEIGHT = 160;
const LINE_SPACING = 14;
const TOP_MARGIN = 40;
const NOTE_X = STAFF_WIDTH / 2 + 20;

function staffLineY(lineIndex: number): number {
  return TOP_MARGIN + (4 - lineIndex) * LINE_SPACING;
}

function noteY(staffPosition: number): number {
  const bottomLineY = staffLineY(0);
  return bottomLineY - staffPosition * (LINE_SPACING / 2);
}

const MUSIC_FONT = "'Noto Music', serif";

function TrebleClef() {
  const x = 40;
  const y = staffLineY(2);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        font-size="72"
        font-family={MUSIC_FONT}
        fill="var(--color-primary)"
        text-anchor="middle"
        dominant-baseline="central"
        y="-2"
      >
        {'\u{1D11E}'}
      </text>
    </g>
  );
}

function BassClef() {
  const x = 40;
  const y = staffLineY(2);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        font-size="52"
        font-family={MUSIC_FONT}
        fill="var(--color-primary)"
        text-anchor="middle"
        dominant-baseline="central"
        y="2"
      >
        {'\u{1D122}'}
      </text>
    </g>
  );
}

function LedgerLines({ staffPosition, x }: { staffPosition: number; x: number }) {
  const lines: number[] = [];

  if (staffPosition < 0) {
    for (let pos = -2; pos >= staffPosition; pos -= 2) {
      lines.push(pos);
    }
  }
  if (staffPosition > 8) {
    for (let pos = 10; pos <= staffPosition; pos += 2) {
      lines.push(pos);
    }
  }
  if (staffPosition === 0 || staffPosition === 8) {
    // Note sits exactly on bottom or top line - no extra needed
  }

  return (
    <>
      {lines.map((pos) => {
        const y = noteY(pos);
        return (
          <line
            key={pos}
            x1={x - 18}
            y1={y}
            x2={x + 18}
            y2={y}
            stroke="var(--color-staff-line)"
            stroke-width="1.5"
          />
        );
      })}
    </>
  );
}

export function Staff({ note, feedback }: StaffProps) {
  const ny = noteY(note.staffPosition);

  let noteColor = 'var(--color-text)';
  if (feedback === 'correct') noteColor = 'var(--color-success-note)';
  if (feedback === 'wrong') noteColor = 'var(--color-error-note)';

  return (
    <div class={styles.staffContainer}>
      <svg
        viewBox={`0 0 ${STAFF_WIDTH} ${STAFF_HEIGHT}`}
        class={styles.staffSvg}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Staff lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="20"
            y1={staffLineY(i)}
            x2={STAFF_WIDTH - 20}
            y2={staffLineY(i)}
            stroke="var(--color-staff-line)"
            stroke-width="1.5"
          />
        ))}

        {/* Clef */}
        {note.clef === 'treble' ? <TrebleClef /> : <BassClef />}

        {/* Ledger lines for notes outside staff */}
        <LedgerLines staffPosition={note.staffPosition} x={NOTE_X} />

        {/* Note (whole note) */}
        <text
          x={NOTE_X}
          y={ny}
          font-size="32"
          font-family={MUSIC_FONT}
          fill={noteColor}
          text-anchor="middle"
          dominant-baseline="central"
          class={feedback !== 'none' ? styles.noteAnimate : ''}
        >
          {'\u{1D15D}'}
        </text>
      </svg>
    </div>
  );
}
