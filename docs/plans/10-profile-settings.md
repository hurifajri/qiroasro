# Task 10: Profile & Settings

> Menghubungkan Profile dan Settings page ke data riil.

## Status: `[/]` Partial done

**Depends on:** Task 8 (Leaderboard & Social), Task 9 (Quests & Shop)

---

## Subtasks

### 10.1 Profile Page — Real Data
- [ ] Replace `MOCK_USER_PROFILE` → fetch dari `user_profiles` table
- [ ] Replace `MOCK_STATISTICS` → fetch dari `usr_stats`
- [ ] Replace `MOCK_FRIEND_SUGGESTIONS` → real suggestions
- [ ] Tampilkan achievements riil (berdasarkan badges earned)

### 10.2 Profile Edit (✅ Selesai)
- [x] Edit display name
- [x] Edit avatar color
- [x] Edit username (with uniqueness check)
- [ ] Upload avatar image (optional, future)

### 10.3 Achievement System
- [ ] Define achievements di DB (or constants file)
- [ ] Track achievement unlock conditions:
  - Complete first lesson
  - 7-day streak
  - Complete all letters in a makhraj area
  - Score 100% accuracy
  - dll
- [ ] Tampilkan di profile

### 10.4 Settings Page — Real Data
- [ ] Sound effects on/off → persist ke user preferences
- [ ] Notification preferences → persist
- [ ] Language preference → already handled by `next-intl`
- [ ] Account management (delete account) — *Note: password auth disable (Google OAuth array)*
- [ ] Privacy settings

### 10.5 Buat Schema DB — Settings (jika perlu)
- [ ] Tabel `usr_preferences` (key-value per user)

```sql
CREATE TABLE usr_preferences (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    value JSONB NOT NULL DEFAULT '{}',
    PRIMARY KEY (user_id, key)
);
```

### 10.6 Sections Page — Real Data
- [ ] Replace `MOCK_SECTIONS` → fetch dari `cur_sections` + user progress
- [ ] Tampilkan section progress bars riil
- [ ] Link ke learn page filtered by section

---

## Files yang Akan Ditambah/Modify

| File | Perubahan |
|---|---|
| `src/app/[locale]/(private)/profile/[username]/page.tsx` | Real data fetch |
| `src/app/[locale]/(private)/settings/page.tsx` | Real preferences |
| `src/app/[locale]/(private)/sections/page.tsx` | Real section progress |
