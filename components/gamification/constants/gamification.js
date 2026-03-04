export const LEVELS = Object.freeze([
  { level: 1,  name: 'Sea Cadet',     coinsRequired: 0    },
  { level: 2,  name: 'Coral Scout',   coinsRequired: 50   },
  { level: 3,  name: 'Tide Walker',   coinsRequired: 120  },
  { level: 4,  name: 'Reef Ranger',   coinsRequired: 220  },
  { level: 5,  name: 'Wave Rider',    coinsRequired: 350  },
  { level: 6,  name: 'Deep Diver',    coinsRequired: 520  },
  { level: 7,  name: 'Pearl Hunter',  coinsRequired: 730  },
  { level: 8,  name: 'Shark Tamer',   coinsRequired: 990  },
  { level: 9,  name: 'Kraken Caller', coinsRequired: 1300 },
  { level: 10, name: 'Ocean Master',  coinsRequired: 1700 },
]);
export const BADGES = Object.freeze([
  { id: 'first_message',  icon: '💬', name: 'First Words',      desc: 'Send your first message',         condition: (s) => s.totalMessages >= 1  },
  { id: 'five_messages',  icon: '🐠', name: 'Chatty Fish',      desc: 'Send 5 messages',                  condition: (s) => s.totalMessages >= 5  },
  { id: 'ten_messages',   icon: '🌊', name: 'Wave Maker',       desc: 'Send 10 messages',                 condition: (s) => s.totalMessages >= 10 },
  { id: 'twenty_five',    icon: '🐙', name: 'Octopus Mind',     desc: 'Send 25 messages',                 condition: (s) => s.totalMessages >= 25 },
  { id: 'fifty',          icon: '🦈', name: 'Shark Mode',       desc: 'Send 50 messages',                 condition: (s) => s.totalMessages >= 50 },
  { id: 'level_5',        icon: '⭐', name: 'Rising Star',      desc: 'Reach Level 5',                    condition: (s) => s.level >= 5          },
  { id: 'level_10',       icon: '🏆', name: 'Ocean Master',     desc: 'Reach Level 10',                   condition: (s) => s.level >= 10         },
  { id: 'big_coins',      icon: '💰', name: 'Coin Hoarder',     desc: 'Earn 500 coins total',             condition: (s) => s.totalCoins >= 500   },
  { id: 'farmer_unlock',  icon: '🌾', name: 'Down on the Farm', desc: 'Unlock the Farmer theme',          condition: (s) => s.totalMessages >= 2  },
  { id: 'farmer_seeds',   icon: '🌱', name: 'Seed Sower',       desc: 'Send 3 messages in Farmer mode',   condition: (s) => s.farmerMessages >= 3 },
  { id: 'farmer_harvest', icon: '🌽', name: 'Harvest Time',     desc: 'Send 10 messages in Farmer mode',  condition: (s) => s.farmerMessages >= 10},
  { id: 'farmer_rooster', icon: '🐓', name: 'Early Riser',      desc: 'Earn 100 coins in Farmer mode',    condition: (s) => s.farmerCoins >= 100  },
]);
export const THEMES = Object.freeze([
  { id: 'light',      label: '☀️ Light',      locked: false, unlockMessages: 0 },
  { id: 'dark',       label: '🌙 Dark',       locked: false, unlockMessages: 0 },
  { id: 'underwater', label: '🌊 Underwater', locked: false, unlockMessages: 0 },
  { id: 'farmer',     label: '🌾 Farmer',     locked: true,  unlockMessages: 2 },
]);
export const MULTIPLIER_THRESHOLDS = Object.freeze([
  { messagesStreak: 10, multiplier: 3 },
  { messagesStreak: 5,  multiplier: 2 },
  { messagesStreak: 1,  multiplier: 1 },
]);
export const COINS_PER_MESSAGE = Object.freeze({ min: 10, max: 20 });
export const MAX_COIN_STACK = 12;
export const FARMER_THEME_UNLOCK_AT = 2;
