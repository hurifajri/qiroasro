import type { userXpLedger } from '@/db/gamification-schema';

export type XpLedgerEntry = typeof userXpLedger.$inferSelect;
