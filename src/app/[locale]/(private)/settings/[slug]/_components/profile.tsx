'use client';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
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
  DEFAULT_AVATAR_COLOR_CODE,
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

type UsernameStatus = {
  type: 'idle' | 'checking' | 'taken' | 'invalid' | 'available';
  message?: string;
  variant?: 'default' | 'success' | 'error';
};

type SaveStatus = { type: 'idle' | 'error' | 'success'; message?: string };

export function Profile({ userId }: ProfileProps) {
  const t = useTranslations('settings_page.profile');
  const queryClient = useQueryClient();

  // Fetch real user profile from cache (prefetched in page.tsx)
  const { data: userProfile } = useSuspenseQuery(
    getUserProfileByUserIdOpt(userId),
  );

  // Local form state — seeded from real profile data
  const [avatarColorCode, setAvatarColorCode] = useState<AvatarColorCode>(
    userProfile?.avatarColorCode ?? DEFAULT_AVATAR_COLOR_CODE,
  );
  const [displayName, setDisplayName] = useState(
    userProfile?.displayName ?? '',
  );
  const [username, setUsername] = useState(userProfile?.username ?? '');

  // Username availability state
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>({
    type: 'idle',
  });
  const usernameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ type: 'idle' });
  const [isPending, startTransition] = useTransition();

  function handleUsernameChange(value: string) {
    setUsername(value);

    // Reset status immediately
    setUsernameStatus({ type: 'idle' });

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
      avatarColorCode,
      displayName,
      username: value,
    });

    if (!validation.success) {
      const issueMessage = validation.issues[0]?.message;
      setUsernameStatus({
        type: 'invalid',
        message: t(`validation.${issueMessage}`),
        variant: 'error',
      });
      return;
    }

    // Valid form input — now check availability in DB
    usernameDebounceRef.current = setTimeout(async () => {
      setUsernameStatus({
        type: 'checking',
        message: t('validation.username_checking'),
        variant: 'default',
      });
      try {
        const result = await checkUsernameAvailability(
          validation.output.username,
          userId,
        );

        if (result.available) {
          setUsernameStatus({
            type: 'available',
            message: t('validation.username_available'),
            variant: 'success',
          });
        } else if (result.reason === 'taken') {
          setUsernameStatus({
            type: 'taken',
            message: t('validation.username_taken'),
            variant: 'error',
          });
        } else {
          setUsernameStatus({
            type: 'invalid',
            message: t('validation.check_failed'),
            variant: 'error',
          });
        }
      } catch {
        setUsernameStatus({
          type: 'invalid',
          message: t('validation.check_failed'),
          variant: 'error',
        });
      }
    }, 500);
  }

  function handleSaveChanges() {
    startTransition(async () => {
      // Validate before sending
      const validation = safeParse(UpdateUserProfileSchema, {
        avatarColorCode,
        displayName,
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
        const message =
          result.error === 'username_taken'
            ? t('validation.username_taken')
            : t('validation.save_failed');
        setSaveStatus({ type: 'error', message });
        return;
      }

      // Invalidate cache so profile link + profile page reflect new data
      await queryClient.invalidateQueries(getUserProfileByUserIdOpt(userId));

      setSaveStatus({ type: 'success', message: t('validation.save_success') });

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
            hint={usernameStatus.message}
            hintVariant={usernameStatus.variant}
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
          disabled={isPending}
          className="w-fit"
        >
          {t('save_changes')}
        </Button>

        {saveStatus.message && (
          <p
            className={cn(
              'text-sm',
              saveStatus.type === 'error' && 'text-destructive',
              saveStatus.type === 'success' &&
                'text-green-600 dark:text-green-400',
            )}
          >
            {saveStatus.message}
          </p>
        )}
      </div>
    </div>
  );
}
