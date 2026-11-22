import type { InferOutput } from 'valibot';
import { minLength, object, pipe, string } from 'valibot';

export const ToggleFollowInputSchema = object({
  targetUserId: pipe(string(), minLength(1)),
});

export type ToggleFollowInput = InferOutput<typeof ToggleFollowInputSchema>;

export type ToggleFollowResult =
  { ok: true; isFollowing: boolean } | { ok: false; error: string };
