# Task 8: Leaderboard & Social

> Sistem competitive dan social antar user.

## Status: `[ ]` Belum dimulai

**Depends on:** Task 7 (Gamification)

---

## Subtasks

### 8.1 Buat Schema DB — Social
- [ ] Buat `docs/schemas/social.sql`

```sql
-- Follows
CREATE TABLE usr_follows (
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- League memberships (weekly reset)
CREATE TABLE usr_league_members (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    league_tier INT NOT NULL DEFAULT 1, -- 1=Bronze, 2=Silver, ...
    weekly_xp INT NOT NULL DEFAULT 0,
    week_start DATE NOT NULL, -- ISO week start
    rank INT,
    UNIQUE(user_id, week_start)
);

-- Activity feed
CREATE TABLE usr_activity_feed (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    -- 'completed_streak', 'earned_badge', 'level_up', 'completed_section'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Activity reactions
CREATE TABLE usr_activity_reactions (
    activity_id INT NOT NULL REFERENCES usr_activity_feed(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (activity_id, user_id)
);
```

### 8.2 Tambah ke Drizzle ORM
- [ ] Tambah tabel social ke `src/db/schema.ts`
- [ ] Buat Valibot schemas dan transformers

### 8.3 Services — Leaderboard
- [ ] `getWeeklyLeaderboard(userId)` — Top users + current user position
- [ ] `updateWeeklyXp(userId, xp)` — Called after each activity
- [ ] Weekly reset cron job / scheduled function
- [ ] League promotion/demotion logic

### 8.4 Services — Social
- [ ] `followUser(followerId, followingId)`
- [ ] `unfollowUser(followerId, followingId)`
- [ ] `getFollowing(userId)` / `getFollowers(userId)`
- [ ] `getFriendSuggestions(userId)`
- [ ] `getActivityFeed(userId)` — Feed from followed users
- [ ] `reactToActivity(activityId, userId, emoji)`

### 8.5 Connect ke UI
- [ ] Replace `MOCK_FULL_LEADERBOARD` → real leaderboard
- [ ] Replace `MOCK_FOLLOWING` / `MOCK_FOLLOWERS` → real data
- [ ] Replace `MOCK_ACTIVITY_FEED` → real activity feed
- [ ] Replace `MOCK_FRIEND_SUGGESTIONS` → real suggestions

---

## New Schema Files

| File | Deskripsi |
|---|---|
| `docs/schemas/social.sql` | `usr_follows`, `usr_league_members`, `usr_activity_feed`, `usr_activity_reactions` |
