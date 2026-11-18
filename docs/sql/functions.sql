-- =====================================================================
-- ADAPTIVE SRS & ATOMIC GAMIFICATION PL/pgSQL FUNCTIONS
-- =====================================================================
-- Execution order: Run `pnpm db:push`, then `pnpm db:seed`.

BEGIN;

-- 1. Record a practice attempt with SM-2 spaced-repetition scheduling
CREATE OR REPLACE FUNCTION fn_record_practice_attempt(
    p_user_id TEXT,
    p_target_type practice_target_type,
    p_target_slug TEXT,
    p_is_correct BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT p_is_correct THEN
        INSERT INTO user_mistake_items (
            user_id,
            target_type,
            target_slug,
            mistake_count,
            consecutive_correct,
            ease_factor,
            interval_days,
            last_mistake_at,
            next_review_at,
            is_resolved,
            resolved_at
        ) VALUES (
            p_user_id,
            p_target_type,
            p_target_slug,
            1,
            0,
            2500,
            1,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP + INTERVAL '1 day',
            FALSE,
            NULL
        )
        ON CONFLICT ON CONSTRAINT uq_user_mistake_target DO UPDATE SET
            mistake_count       = user_mistake_items.mistake_count + 1,
            consecutive_correct = 0,
            ease_factor         = GREATEST(1300, user_mistake_items.ease_factor - 200),
            interval_days       = 1,
            last_mistake_at     = CURRENT_TIMESTAMP,
            next_review_at      = CURRENT_TIMESTAMP + INTERVAL '1 day',
            is_resolved         = FALSE,
            resolved_at         = NULL,
            updated_at          = CURRENT_TIMESTAMP;
    ELSE
        UPDATE user_mistake_items
        SET
            consecutive_correct = consecutive_correct + 1,
            ease_factor         = LEAST(3000, ease_factor + 100),
            interval_days       = CASE
                WHEN consecutive_correct = 0 THEN 1
                WHEN consecutive_correct = 1 THEN 6
                ELSE LEAST(32767, ROUND(interval_days * (LEAST(3000, ease_factor + 100) / 1000.0))::INT)::SMALLINT
            END,
            next_review_at      = CURRENT_TIMESTAMP + (
                CASE
                    WHEN consecutive_correct = 0 THEN 1
                    WHEN consecutive_correct = 1 THEN 6
                    ELSE LEAST(32767, ROUND(interval_days * (LEAST(3000, ease_factor + 100) / 1000.0))::INT)
                END || ' days'
            )::INTERVAL,
            is_resolved         = (consecutive_correct + 1 >= 3),
            resolved_at         = CASE
                WHEN consecutive_correct + 1 >= 3 THEN COALESCE(resolved_at, CURRENT_TIMESTAMP)
                ELSE NULL
            END,
            updated_at          = CURRENT_TIMESTAMP
        WHERE user_id = p_user_id
          AND target_type = p_target_type
          AND target_slug = p_target_slug;
    END IF;
END;
$$;

-- 2. Atomic lesson completion: progress + XP ledger + streak + quests + league XP
CREATE OR REPLACE FUNCTION fn_complete_lesson_with_rewards(
    p_user_id TEXT,
    p_topic_slug TEXT,
    p_unit_slug TEXT,
    p_lesson_order SMALLINT,
    p_score INT,
    p_xp_earned INT,
    p_time_spent_sec INT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_safe_xp INT := GREATEST(0, COALESCE(p_xp_earned, 0));
    v_safe_score INT := LEAST(100, GREATEST(0, COALESCE(p_score, 0)));
    v_safe_time INT := GREATEST(0, COALESCE(p_time_spent_sec, 0));
    v_today DATE := CURRENT_DATE;
    v_week_start DATE := date_trunc('week', CURRENT_DATE)::DATE;
BEGIN
    -- 1. Upsert lesson progress (matches user_lesson_progress composite PK ulp_pk)
    INSERT INTO user_lesson_progress (
        user_id,
        topic_slug,
        unit_slug,
        lesson_order,
        is_completed,
        score,
        completed_at
    ) VALUES (
        p_user_id,
        p_topic_slug,
        p_unit_slug,
        p_lesson_order,
        TRUE,
        v_safe_score,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (user_id, topic_slug, unit_slug, lesson_order) DO UPDATE SET
        is_completed = TRUE,
        score        = GREATEST(COALESCE(user_lesson_progress.score, 0), EXCLUDED.score),
        completed_at = COALESCE(user_lesson_progress.completed_at, CURRENT_TIMESTAMP),
        updated_at   = CURRENT_TIMESTAMP;

    -- 2. Record immutable XP audit ledger entry
    INSERT INTO user_xp_ledger (
        user_id,
        source_type,
        source_ref,
        xp_amount,
        accuracy_score,
        time_spent_sec
    ) VALUES (
        p_user_id,
        'lesson',
        p_topic_slug || ':' || p_unit_slug || ':' || p_lesson_order::TEXT,
        v_safe_xp,
        v_safe_score,
        v_safe_time
    );

    -- 3. Atomically update XP, derived level, and daily streak
    INSERT INTO user_gamification (
        user_id,
        total_xp,
        level,
        current_streak,
        longest_streak,
        last_active_date
    ) VALUES (
        p_user_id,
        v_safe_xp,
        GREATEST(1, (v_safe_xp / 100) + 1)::SMALLINT,
        1,
        1,
        v_today
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_xp       = user_gamification.total_xp + v_safe_xp,
        level          = GREATEST(1, ((user_gamification.total_xp + v_safe_xp) / 100) + 1)::SMALLINT,
        current_streak = CASE
            WHEN user_gamification.last_active_date IS NULL THEN 1
            WHEN user_gamification.last_active_date = v_today THEN GREATEST(1, user_gamification.current_streak)
            WHEN user_gamification.last_active_date = (v_today - 1) THEN user_gamification.current_streak + 1
            ELSE 1
        END,
        longest_streak = GREATEST(
            user_gamification.longest_streak,
            CASE
                WHEN user_gamification.last_active_date IS NULL THEN 1
                WHEN user_gamification.last_active_date = v_today THEN GREATEST(1, user_gamification.current_streak)
                WHEN user_gamification.last_active_date = (v_today - 1) THEN user_gamification.current_streak + 1
                ELSE 1
            END
        ),
        last_active_date = v_today,
        updated_at       = CURRENT_TIMESTAMP;

    -- 4. Update today's active quests (earn_xp, complete_lessons, high_accuracy)
    UPDATE user_daily_quests
    SET
        current_value = LEAST(
            target_value,
            current_value + CASE quest_slug
                WHEN 'earn_xp' THEN v_safe_xp
                WHEN 'complete_lessons' THEN 1
                WHEN 'high_accuracy' THEN CASE WHEN v_safe_score >= 90 THEN 1 ELSE 0 END
                ELSE 0
            END
        ),
        is_completed  = (
            LEAST(
                target_value,
                current_value + CASE quest_slug
                    WHEN 'earn_xp' THEN v_safe_xp
                    WHEN 'complete_lessons' THEN 1
                    WHEN 'high_accuracy' THEN CASE WHEN v_safe_score >= 90 THEN 1 ELSE 0 END
                    ELSE 0
                END
            ) >= target_value
        ),
        updated_at    = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id
      AND quest_date = v_today
      AND quest_slug IN ('earn_xp', 'complete_lessons', 'high_accuracy');

    -- 5. Increment weekly leaderboard XP in current active league cohort (if enrolled)
    UPDATE league_participants lp
    SET
        weekly_xp  = lp.weekly_xp + v_safe_xp,
        updated_at = CURRENT_TIMESTAMP
    FROM league_cohorts lc
    WHERE lp.cohort_id = lc.id
      AND lp.user_id = p_user_id
      AND lc.week_start_date = v_week_start
      AND lc.is_processed = FALSE;
END;
$$;

-- 3. Adaptive practice item selector (SRS due mistakes -> saved bookmarks -> fresh items)
CREATE OR REPLACE FUNCTION fn_get_adaptive_practice_items(
    p_user_id TEXT,
    p_target_type practice_target_type,
    p_limit INT DEFAULT 10
)
RETURNS TABLE (
    target_type practice_target_type,
    target_slug TEXT,
    priority_reason TEXT,
    mistake_count INT,
    next_review_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
    WITH candidates AS (
        -- Priority 1: Unresolved SRS items due now
        SELECT
            umi.target_type,
            umi.target_slug,
            'srs_due_mistake'::TEXT AS priority_reason,
            umi.mistake_count,
            umi.next_review_at,
            1 AS priority_rank,
            umi.mistake_count AS sort_hint_int,
            umi.next_review_at AS sort_hint_ts
        FROM user_mistake_items umi
        WHERE umi.user_id = p_user_id
          AND umi.target_type = p_target_type
          AND umi.is_resolved = FALSE
          AND umi.next_review_at <= CURRENT_TIMESTAMP

        UNION ALL

        -- Priority 2: User-bookmarked items
        SELECT
            usi.target_type,
            usi.target_slug,
            'saved_bookmark'::TEXT AS priority_reason,
            0 AS mistake_count,
            NULL::TIMESTAMPTZ AS next_review_at,
            2 AS priority_rank,
            0 AS sort_hint_int,
            usi.created_at AS sort_hint_ts
        FROM user_saved_items usi
        WHERE usi.user_id = p_user_id
          AND usi.target_type = p_target_type

        UNION ALL

        -- Priority 3: Upcoming unresolved mistakes (if due queue is smaller than limit)
        SELECT
            umi.target_type,
            umi.target_slug,
            'srs_upcoming_mistake'::TEXT AS priority_reason,
            umi.mistake_count,
            umi.next_review_at,
            3 AS priority_rank,
            umi.mistake_count AS sort_hint_int,
            umi.next_review_at AS sort_hint_ts
        FROM user_mistake_items umi
        WHERE umi.user_id = p_user_id
          AND umi.target_type = p_target_type
          AND umi.is_resolved = FALSE
          AND umi.next_review_at > CURRENT_TIMESTAMP

        UNION ALL

        -- Priority 4: Fresh curriculum / master items matched to target_type
        SELECT
            p_target_type AS target_type,
            fresh.slug AS target_slug,
            'fresh_curriculum'::TEXT AS priority_reason,
            0 AS mistake_count,
            NULL::TIMESTAMPTZ AS next_review_at,
            4 AS priority_rank,
            -fresh.sort_order AS sort_hint_int,
            NULL::TIMESTAMPTZ AS sort_hint_ts
        FROM (
            SELECT slug, sort_order FROM hij_letters WHERE p_target_type = 'letter'
            UNION ALL
            SELECT slug, sort_order FROM hij_articulation_points WHERE p_target_type = 'point'
            UNION ALL
            SELECT slug, sort_order FROM hij_traits WHERE p_target_type = 'trait'
            UNION ALL
            SELECT slug, sort_order FROM taj_rules WHERE p_target_type = 'rule'
            UNION ALL
            SELECT slug, sort_order FROM taj_examples WHERE p_target_type = 'example'
            UNION ALL
            SELECT (rs.slug || '-' || rv.verse_number::TEXT) AS slug, rv.id AS sort_order
            FROM ref_verses rv
            JOIN ref_sources rs ON rs.id = rv.source_id
            WHERE p_target_type = 'verse'
            UNION ALL
            SELECT slug, sort_order FROM cur_questions WHERE p_target_type = 'question'
        ) AS fresh
    ),
    deduplicated AS (
        SELECT DISTINCT ON (c.target_type, c.target_slug)
            c.target_type,
            c.target_slug,
            c.priority_reason,
            c.mistake_count,
            c.next_review_at,
            c.priority_rank,
            c.sort_hint_int,
            c.sort_hint_ts
        FROM candidates c
        ORDER BY c.target_type, c.target_slug, c.priority_rank ASC
    )
    SELECT
        d.target_type,
        d.target_slug,
        d.priority_reason,
        d.mistake_count,
        d.next_review_at
    FROM deduplicated d
    ORDER BY
        d.priority_rank ASC,
        d.sort_hint_int DESC,
        d.sort_hint_ts ASC NULLS LAST,
        d.target_slug ASC
    LIMIT GREATEST(1, COALESCE(p_limit, 10));
$$;

COMMIT;
