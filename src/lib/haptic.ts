/**
 * Haptic feedback utilities for tactile responses
 */

/**
 * Check if device supports vibration
 */
function supportsVibration(): boolean {
  return 'vibrate' in navigator && typeof navigator.vibrate === 'function';
}

/**
 * Trigger a light vibration for correct answer
 */
export function vibrateCorrect(): void {
  if (!supportsVibration()) return;
  navigator.vibrate(50);
}

/**
 * Trigger a double vibration pattern for wrong answer
 */
export function vibrateWrong(): void {
  if (!supportsVibration()) return;
  navigator.vibrate([50, 50, 50]);
}
