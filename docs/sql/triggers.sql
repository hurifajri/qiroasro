-- =====================================================================
-- NATIVE POSTGRESQL TRIGGERS & TRIGGER FUNCTIONS
-- =====================================================================
-- Single Source of Truth (DRY):
--   Tables, enums, CHECK constraints, foreign keys, and regular indexes
--   are managed in Drizzle (src/db/*-schema.ts) via `pnpm db:push`.
--   This file defines ONLY trigger functions and table triggers.
-- Execution order: Run `pnpm db:push`, then `pnpm db:seed`.

BEGIN;

-- =====================================================================
-- 1. HELPER TRIGGER FUNCTIONS
-- =====================================================================

-- Automatically maintain updated_at timestamps on row updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Synchronize followers_count & following_count on user_profiles
CREATE OR REPLACE FUNCTION sync_user_follow_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE user_profiles
        SET following_count = following_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.follower_id;

        UPDATE user_profiles
        SET followers_count = followers_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.following_id;

        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE user_profiles
        SET following_count = GREATEST(0, following_count - 1),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.follower_id;

        UPDATE user_profiles
        SET followers_count = GREATEST(0, followers_count - 1),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.following_id;

        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$;

-- =====================================================================
-- 2. TABLE TRIGGERS
-- =====================================================================

DROP TRIGGER IF EXISTS update_ref_sources_modtime ON ref_sources;
CREATE TRIGGER update_ref_sources_modtime
    BEFORE UPDATE ON ref_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ref_verses_modtime ON ref_verses;
CREATE TRIGGER update_ref_verses_modtime
    BEFORE UPDATE ON ref_verses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_taj_rules_modtime ON taj_rules;
CREATE TRIGGER update_taj_rules_modtime
    BEFORE UPDATE ON taj_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_taj_rule_definitions_modtime ON taj_rule_definitions;
CREATE TRIGGER update_taj_rule_definitions_modtime
    BEFORE UPDATE ON taj_rule_definitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_taj_examples_modtime ON taj_examples;
CREATE TRIGGER update_taj_examples_modtime
    BEFORE UPDATE ON taj_examples
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_taj_rule_citations_modtime ON taj_rule_citations;
CREATE TRIGGER update_taj_rule_citations_modtime
    BEFORE UPDATE ON taj_rule_citations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hij_articulation_citations_modtime ON hij_articulation_citations;
CREATE TRIGGER update_hij_articulation_citations_modtime
    BEFORE UPDATE ON hij_articulation_citations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hij_trait_citations_modtime ON hij_trait_citations;
CREATE TRIGGER update_hij_trait_citations_modtime
    BEFORE UPDATE ON hij_trait_citations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cur_questions_modtime ON cur_questions;
CREATE TRIGGER update_cur_questions_modtime
    BEFORE UPDATE ON cur_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_mistake_items_modtime ON user_mistake_items;
CREATE TRIGGER update_user_mistake_items_modtime
    BEFORE UPDATE ON user_mistake_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_saved_items_modtime ON user_saved_items;
CREATE TRIGGER update_user_saved_items_modtime
    BEFORE UPDATE ON user_saved_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_gamification_modtime ON user_gamification;
CREATE TRIGGER update_user_gamification_modtime
    BEFORE UPDATE ON user_gamification
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_daily_quests_modtime ON user_daily_quests;
CREATE TRIGGER update_user_daily_quests_modtime
    BEFORE UPDATE ON user_daily_quests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_achievements_modtime ON user_achievements;
CREATE TRIGGER update_user_achievements_modtime
    BEFORE UPDATE ON user_achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_monthly_badges_modtime ON user_monthly_badges;
CREATE TRIGGER update_user_monthly_badges_modtime
    BEFORE UPDATE ON user_monthly_badges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_league_cohorts_modtime ON league_cohorts;
CREATE TRIGGER update_league_cohorts_modtime
    BEFORE UPDATE ON league_cohorts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_league_participants_modtime ON league_participants;
CREATE TRIGGER update_league_participants_modtime
    BEFORE UPDATE ON league_participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_sync_user_follow_counts ON user_follows;
CREATE TRIGGER trg_sync_user_follow_counts
    AFTER INSERT OR DELETE ON user_follows
    FOR EACH ROW EXECUTE FUNCTION sync_user_follow_counts();

COMMIT;
