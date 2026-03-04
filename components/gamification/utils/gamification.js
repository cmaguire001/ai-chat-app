/**
 * Pure utility functions for gamification logic.
 * No side effects. Easily unit-testable.
 */

import { LEVELS, BADGES, COINS_PER_MESSAGE, MULTIPLIER_THRESHOLDS } from '../constants/gamification';

/**
 * Given a total coin count, returns full level progression info.
 */
export function getLevelInfo(totalCoins) {
  let current = LEVELS[0];
  let next = LEVELS[1] || null;

  for (let i = 0; i < LEVELS.length; i++) {
    if (totalCoins >= LEVELS[i].coinsRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
    }
  }

  const coinsIntoLevel = totalCoins - current.coinsRequired;
  const coinsNeeded    = next ? next.coinsRequired - current.coinsRequired : 1;
  const progress       = next ? Math.min((coinsIntoLevel / coinsNeeded) * 100, 100) : 100;

  return { current, next, progress, coinsIntoLevel, coinsNeeded };
}

/**
 * Returns the current multiplier based on total message count.
 */
export function getMultiplier(totalMessages) {
  for (const { messagesStreak, multiplier } of MULTIPLIER_THRESHOLDS) {
    if (totalMessages % messagesStreak === 0 && totalMessages > 0) {
      return multiplier;
    }
  }
  return 1;
}

/**
 * Calculates coins earned for a single message, including multiplier.
 */
export function calculateCoinsEarned(multiplier) {
  const base = Math.floor(
    Math.random() * (COINS_PER_MESSAGE.max - COINS_PER_MESSAGE.min + 1) +
    COINS_PER_MESSAGE.min
  );
  return base * multiplier;
}

/**
 * Returns badges newly unlocked given previous and current stats.
 */
export function getNewlyUnlockedBadges(prevUnlockedIds, newStats) {
  return BADGES.filter(
    (b) => b.condition(newStats) && !prevUnlockedIds.includes(b.id)
  );
}

/**
 * Returns all currently unlocked badges for a stats object.
 */
export function getUnlockedBadges(stats) {
  return BADGES.filter((b) => b.condition(stats));
}

/**
 * Derives the full next stats object after a message is sent.
 */
export function deriveNextStats(prevStats, coinsEarned) {
  const totalCoins    = prevStats.totalCoins + coinsEarned;
  const totalMessages = prevStats.totalMessages + 1;
  const level         = getLevelInfo(totalCoins).current.level;

  return {
    ...prevStats,
    totalCoins,
    totalMessages,
    level,
  };
}
