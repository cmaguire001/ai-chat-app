import { useState, useCallback, useRef } from 'react';
import { calculateCoinsEarned, deriveNextStats, getMultiplier, getNewlyUnlockedBadges } from '../utils/gamification.js';

const INITIAL_STATS = { totalCoins: 0, totalMessages: 0, level: 1, unlockedBadgeIds: [], farmerMessages: 0, farmerCoins: 0 };

export function useGameStats() {
  const [stats, setStats]           = useState(INITIAL_STATS);
  const [multiplier, setMultiplier] = useState(1);
  const [coinBurst, setCoinBurst]   = useState({ visible: false, amount: 0 });
  const [badgeToast, setBadgeToast] = useState({ visible: false, badge: null });
  const coinBurstTimerRef  = useRef(null);
  const badgeToastTimerRef = useRef(null);

  const showCoinBurst = useCallback((amount) => {
    clearTimeout(coinBurstTimerRef.current);
    setCoinBurst({ visible: true, amount });
    coinBurstTimerRef.current = setTimeout(() => setCoinBurst((p) => ({ ...p, visible: false })), 1800);
  }, []);

  const showBadgeToast = useCallback((badge) => {
    clearTimeout(badgeToastTimerRef.current);
    badgeToastTimerRef.current = setTimeout(() => {
      setBadgeToast({ visible: true, badge });
      badgeToastTimerRef.current = setTimeout(() => setBadgeToast({ visible: false, badge }), 3000);
    }, 600);
  }, []);

  const onMessageSent = useCallback((isFarmerMode = false) => {
    setStats((prev) => {
      const nextCount     = prev.totalMessages + 1;
      const newMultiplier = getMultiplier(nextCount);
      setMultiplier(newMultiplier);
      const coinsEarned = calculateCoinsEarned(newMultiplier);
      const newStats    = deriveNextStats(prev, coinsEarned);
      if (isFarmerMode) {
        newStats.farmerMessages = (prev.farmerMessages || 0) + 1;
        newStats.farmerCoins    = (prev.farmerCoins || 0) + coinsEarned;
      }
      const newBadges = getNewlyUnlockedBadges(prev.unlockedBadgeIds, newStats);
      newStats.unlockedBadgeIds = [...prev.unlockedBadgeIds, ...newBadges.map((b) => b.id)];
      setTimeout(() => { showCoinBurst(coinsEarned); if (newBadges.length > 0) showBadgeToast(newBadges[0]); }, 0);
      return newStats;
    });
  }, [showCoinBurst, showBadgeToast]);

  return { stats, multiplier, coinBurst, badgeToast, onMessageSent };
}
