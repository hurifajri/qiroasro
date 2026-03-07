'use client';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState, useTransition } from 'react';
import { safeParse } from 'valibot';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import {
  AVATAR_COLORS,
  AVATAR_GRADIENT_CODES,
  AVATAR_SOLID_CODES,
  type AvatarColorCode,
} from '@/lib/avatar';
import { cn } from '@/lib/utils';
import { UserAvatar } from '../../../_components/user-avatar';
import { getUserProfileByUserIdOpt } from '../../../_queries/user-profile';
import { UpdateUserProfileSchema } from '../../../_schemas/user-profile';
import {
  checkUsernameAvailability,
  updateUserProfile,
} from '../../../_services/user-profile';
import { ProfileFieldRow } from './profile-field-row';

interface ProfileProps {
  userId: string;
}

type SaveStatus =
  | { type: 'idle' }
  | { type: 'saving' }
  | { type: 'success' }
  | { type: 'error'; message: string };

export function Profile({ userId }: ProfileProps) {
  const t = useTranslations('settings_page.profile');
  const queryClient = useQueryClient();

  // Fetch real user profile from cache (prefetched in page.tsx)
  const { data: userProfile } = useSuspenseQuery(
    getUserProfileByUserIdOpt(userId),
  );

  // Local form state — seeded from real profile data
  const [displayName, setDisplayName] = useState(
    userProfile?.displayName ?? '',
  );
  const [username, setUsername] = useState(userProfile?.username ?? '');
  const [avatarColorCode, setAvatarColorCode] = useState<AvatarColorCode>(
    (userProfile?.avatarColorCode ?? '') as AvatarColorCode,
  );

  // Username availability state
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken' | 'invalid'
  >('idle');
  const usernameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ type: 'idle' });
  const [isPending, startTransition] = useTransition();

  function handleUsernameChange(value: string) {
    setUsername(value);

    // Reset status immediately
    setUsernameStatus('idle');

    // Debounce availability check
    if (usernameDebounceRef.current) {
      clearTimeout(usernameDebounceRef.current);
    }

    // Skip check if same as current username
    if (value === userProfile?.username) return;
    if (!value) return;

    // Validate against the schema rules (length, pattern, etc)
    // We pass dummy values for other required schema fields
    const validation = safeParse(UpdateUserProfileSchema, {
      displayName: userProfile?.displayName ?? '',
      avatarColorCode:
        userProfile?.avatarColorCode ?? ('blue' as AvatarColorCode),
      username: value,
    });

    if (!validation.success) {
      setUsernameStatus('invalid');
      return;
    }

    // Valid form input — now check availability in DB
    usernameDebounceRef.current = setTimeout(async () => {
      setUsernameStatus('checking');
      try {
        const result = await checkUsernameAvailability(
          validation.output.username,
          userId,
        );
        setUsernameStatus(result.available ? 'available' : result.reason);
      } catch {
        setUsernameStatus('invalid');
      }
    }, 500);
  }

  function handleSaveChanges() {
    startTransition(async () => {
      setSaveStatus({ type: 'saving' });

      // Validate before sending
      const validation = safeParse(UpdateUserProfileSchema, {
        displayName,
        avatarColorCode,
        username,
      });

      if (!validation.success) {
        const issueMessage = validation.issues[0]?.message;
        setSaveStatus({
          type: 'error',
          message: t(`validation.${issueMessage}`),
        });
        return;
      }

      const result = await updateUserProfile(userId, validation.output);

      if (!result.success) {
        const msg =
          result.error === 'username_taken'
            ? 'Username is already taken'
            : 'Failed to save changes. Please try again.';
        setSaveStatus({ type: 'error', message: msg });
        return;
      }

      // Invalidate cache so profile link + profile page reflect new data
      await queryClient.invalidateQueries(getUserProfileByUserIdOpt(userId));

      setSaveStatus({ type: 'success' });

      // Auto-clear success message after 3 seconds
      setTimeout(() => setSaveStatus({ type: 'idle' }), 3000);
    });
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Avatar section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">{t('avatar.title')}</h2>
        <UserAvatar
          name={displayName}
          colorCode={avatarColorCode}
          className="size-20"
          textClassName="font-bold text-3xl"
        />

        {/* Color picker */}
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">
            {t('avatar.choose_color')}
          </p>

          {/* Solid colors */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">{t('avatar.solid_colors')}</p>
            <div className="flex flex-wrap gap-2">
              {AVATAR_SOLID_CODES.map((colorCode) => (
                <Button
                  size="icon-lg"
                  key={colorCode}
                  onClick={() => setAvatarColorCode(colorCode)}
                  className={cn(
                    'relative rounded-full transition-transform hover:scale-110',
                    AVATAR_COLORS[colorCode],
                  )}
                >
                  {avatarColorCode === colorCode && (
                    <CheckIcon className="absolute inset-0 m-auto size-5 text-white" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Gradient colors */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">{t('avatar.gradient_colors')}</p>
            <div className="flex flex-wrap gap-2">
              {AVATAR_GRADIENT_CODES.map((colorCode) => (
                <Button
                  size="icon-lg"
                  key={colorCode}
                  onClick={() => setAvatarColorCode(colorCode)}
                  className={cn(
                    'relative rounded-full transition-transform hover:scale-110',
                    AVATAR_COLORS[colorCode],
                  )}
                >
                  {avatarColorCode === colorCode && (
                    <CheckIcon className="absolute inset-0 m-auto size-5 text-white" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Personal info section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">{t('personal_info.title')}</h2>
        <Separator />
        <FieldGroup className="gap-4">
          <ProfileFieldRow
            id="name"
            labelKey="name"
            value={displayName}
            onChange={setDisplayName}
          />
          <ProfileFieldRow
            id="username"
            labelKey="username"
            value={username}
            onChange={handleUsernameChange}
            hint={
              usernameStatus === 'checking'
                ? 'Checking availability…'
                : usernameStatus === 'available'
                  ? '✓ Username is available'
                  : usernameStatus === 'taken'
                    ? 'Username is already taken'
                    : usernameStatus === 'invalid'
                      ? 'Invalid username format'
                      : undefined
            }
            hintVariant={
              usernameStatus === 'available'
                ? 'success'
                : usernameStatus === 'taken' || usernameStatus === 'invalid'
                  ? 'error'
                  : 'default'
            }
          />
          <ProfileFieldRow
            id="email"
            labelKey="email"
            type="email"
            value={userProfile?.email ?? ''}
            disabled
          />
        </FieldGroup>
      </section>

      {/* Save button + status */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleSaveChanges}
          disabled={
            isPending ||
            saveStatus.type === 'saving' ||
            usernameStatus === 'taken' ||
            usernameStatus === 'checking'
          }
          className="w-fit"
        >
          {(isPending || saveStatus.type === 'saving') && (
            <Loader2Icon className="mr-2 size-4 animate-spin" />
          )}
          {t('save_changes')}
        </Button>

        {saveStatus.type === 'success' && (
          <p className="text-green-600 text-sm dark:text-green-400">
            ✓ Changes saved successfully
          </p>
        )}
        {saveStatus.type === 'error' && (
          <p className="text-destructive text-sm">{saveStatus.message}</p>
        )}
      </div>
    </div>
  );
}
