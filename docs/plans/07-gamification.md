# Task 7: Gamification (XP, Hearts, Streak, Gems)

> Sistem reward dan motivasi user.

## Status: `[ ]` Belum dimulai

**Depends on:** Task 1 (Auth), Task 4 (Learn)

---

## Subtasks

### 7.1 Buat Schema DB — Gamification
- [ ] Buat `docs/schemas/gamification.sql`

```sql
-- User stats table
CREATE TABLE usr_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    xp INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    hearts INT NOT NULL DEFAULT 5,
    max_hearts INT NOT NULL DEFAULT 5,
    gems INT NOT NULL DEFAULT 0,
    streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- XP transaction log
CREATE TABLE usr_xp_log (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    source VARCHAR(50) NOT NULL, -- 'lesson', 'practice', 'quest', 'streak_bonus'
    source_id INT, -- lesson_id, quest_id, etc.
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Streak history
CREATE TABLE usr_streak_log (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    streak_date DATE NOT NULL,
    activity_count INT NOT NULL DEFAULT 1,
    UNIQUE(user_id, streak_date)
);

-- Mistake log (untuk Practice → Mistakes mode)
CREATE TABLE usr_mistake_log (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    letter_id INT REFERENCES hij_letters(id),
    question_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Saved items (untuk Practice → Saved mode)
CREATE TABLE usr_saved_items (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    letter_id INT NOT NULL REFERENCES hij_letters(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, letter_id)
);
```

### 7.2 Tambah ke Drizzle ORM
- [ ] Tambah tabel gamification ke `src/db/schema.ts`
- [ ] Buat Valibot schemas
- [ ] Buat transformers

### 7.3 Services — Gamification
- [ ] `src/services/gamification.ts`:
  - `getUserStats(userId)` — Get user XP, hearts, streak, gems
  - `awardXp(userId, amount, source)` — Add XP + log
  - `updateStreak(userId)` — Check & update daily streak
  - `useHeart(userId)` — Decrement heart
  - `refillHearts(userId)` — Refill hearts (free or gem cost)

### 7.4 Leveling System
- [ ] Define XP thresholds per level
- [ ] Auto level-up saat XP threshold tercapai
- [ ] Tampilkan level up celebration

### 7.5 Streak System
- [ ] Track daily activity
- [ ] Reset streak jika skip 1 hari
- [ ] Streak freeze (dari shop) mencegah reset
- [ ] Tampilkan streak calendar di profile

### 7.6 Hearts System
- [ ] 5 hearts default, berkurang saat jawab salah
- [ ] Natural refill setiap 5 jam (atau konfigurasi)
- [ ] Refill via gems di shop
- [ ] Unlimited hearts (premium/subscribe)

### 7.7 Connect ke UI
- [ ] Update sidebar stats (`StatList`) dengan real data
- [ ] Update header stats
- [ ] Real-time update saat XP berubah

---

## New Schema Files

| File | Deskripsi |
|---|---|
| `docs/schemas/gamification.sql` | `usr_stats`, `usr_xp_log`, `usr_streak_log`, `usr_mistake_log`, `usr_saved_items` |
