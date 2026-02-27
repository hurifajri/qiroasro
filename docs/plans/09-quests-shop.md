# Task 9: Quests & Shop

> Sistem daily quests dan in-app shop untuk gems/hearts/powerups.

## Status: `[ ]` Belum dimulai

**Depends on:** Task 7 (Gamification)

---

## Subtasks

### 9.1 Buat Schema DB — Quests & Shop
- [ ] Buat `docs/schemas/quest.sql`
- [ ] Buat `docs/schemas/shop.sql`

```sql
-- Quest definitions (admin-managed)
CREATE TABLE qst_definitions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
    target_type VARCHAR(50) NOT NULL, -- 'earn_xp', 'complete_lessons', 'high_accuracy', 'maintain_streak'
    target_value INT NOT NULL, -- e.g., 10 for "earn 10 XP"
    xp_reward INT NOT NULL,
    gem_reward INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User quest progress (reset daily/weekly/monthly)
CREATE TABLE qst_user_progress (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quest_id INT NOT NULL REFERENCES qst_definitions(id) ON DELETE CASCADE,
    current_value INT NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT false,
    claimed BOOLEAN NOT NULL DEFAULT false,
    period_start DATE NOT NULL, -- When this quest instance started
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, quest_id, period_start)
);

-- Shop items (admin-managed)
CREATE TABLE shp_items (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL, -- 'hearts', 'powerup', 'cosmetic'
    price_gems INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    max_equipped INT NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 1
);

-- User inventory
CREATE TABLE shp_user_inventory (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES shp_items(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    equipped BOOLEAN NOT NULL DEFAULT false,
    purchased_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### 9.2 Tambah ke Drizzle ORM
- [ ] Tambah tabel quests + shop ke `src/db/schema.ts`
- [ ] Buat Valibot schemas dan transformers

### 9.3 Services — Quests
- [ ] `getDailyQuests(userId)` — Get/create daily quest instances
- [ ] `updateQuestProgress(userId, targetType, incrementBy)` — Auto-called after activities
- [ ] `claimQuestReward(userId, questId)` — Claim XP + gem reward
- [ ] `resetDailyQuests()` — Scheduled function for daily reset

### 9.4 Services — Shop
- [ ] `getShopItems()` — All available items
- [ ] `getUserInventory(userId)` — User's purchased items
- [ ] `purchaseItem(userId, itemId)` — Buy with gems
- [ ] `equipItem(userId, itemId)` / `unequipItem`

### 9.5 Connect ke UI
- [ ] Replace `MOCK_QUESTS` → real daily quests with progress
- [ ] Replace `MOCK_MONTHLY_QUEST` → real monthly quest
- [ ] Replace `MOCK_HEARTS_ITEMS` + `MOCK_POWERUP_ITEMS` → real shop items
- [ ] Add purchase flow with gem deduction

---

## New Schema Files

| File | Deskripsi |
|---|---|
| `docs/schemas/quest.sql` | `qst_definitions`, `qst_user_progress` |
| `docs/schemas/shop.sql` | `shp_items`, `shp_user_inventory` |
