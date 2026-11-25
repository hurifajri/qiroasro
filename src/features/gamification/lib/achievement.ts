import type { Achievement } from '../schemas/achievement';

/**
 * Achievements
 * TODO: Move to db
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'consistency_streak',
    titleKey: 'consistency_streak.title',
    descriptionKey: 'consistency_streak.description',
    emoji: '🔥', // Api Istiqamah (Semangat yang menyala)
    emojiColorCode: 'orange_red2', // Warna api (Oranye ke Merah)
    levels: [3, 7, 30, 100, 365],
    level: 1,
  },
  {
    id: 'perfectionist',
    titleKey: 'perfectionist.title',
    descriptionKey: 'perfectionist.description',
    emoji: '💎', // Itqan (Berlian/Sempurna/Berharga)
    emojiColorCode: 'sky_blue2', // Warna berlian (Biru Kristal)
    levels: [10, 50, 100],
    level: 3,
  },
  {
    id: 'xp_milestone',
    titleKey: 'xp_milestone.title',
    descriptionKey: 'xp_milestone.description',
    emoji: '⚡', // Al-Mahir (Energi/Keahlian Tinggi)
    emojiColorCode: 'yellow_amber2', // Warna energi (Kuning Emas)
    levels: [1000, 5000, 20000],
    level: 10,
  },
  {
    id: 'early_bird',
    titleKey: 'early_bird.title',
    descriptionKey: 'early_bird.description',
    emoji: '🌅', // Fajr Seeker (Matahari Terbit)
    emojiColorCode: 'rose_orange', // Warna pagi (Pink ke Oranye Lembut)
    levels: [1, 10, 50],
    level: 10,
  },
  {
    id: 'night_owl',
    titleKey: 'night_owl.title',
    descriptionKey: 'night_owl.description',
    emoji: '🌙', // Tahajjud Warrior (Bulan Sabit)
    emojiColorCode: 'indigo_purple', // Warna malam syahdu (Ungu Gelap)
    levels: [1, 10, 50],
    level: 10,
  },
  {
    id: 'social_connector',
    titleKey: 'social_connector.title',
    descriptionKey: 'social_connector.description',
    emoji: '🤝', // Ukhuwah (Jabat Tangan/Persaudaraan)
    emojiColorCode: 'emerald_teal2', // Warna persaudaraan (Hijau Islami)
    levels: [1, 3, 10],
    level: 10,
  },
  {
    id: 'error_corrector',
    titleKey: 'error_corrector.title',
    descriptionKey: 'error_corrector.description',
    emoji: '🛠️', // Tawwabin (Alat Perbaikan/Memperbaiki Diri)
    emojiColorCode: 'slate_gray', // Warna perbaikan (Abu-abu Solid)
    levels: [10, 50, 100],
    level: 10,
  },
  {
    id: 'weekend_warrior',
    titleKey: 'weekend_warrior.title',
    descriptionKey: 'weekend_warrior.description',
    emoji: '⚔️', // Holiday Hafiz (Pedang Ganda/Perjuangan di Hari Libur)
    emojiColorCode: 'red_rose', // Warna perjuangan (Merah Berani)
    levels: [1, 4, 12],
    level: 10,
  },
];
