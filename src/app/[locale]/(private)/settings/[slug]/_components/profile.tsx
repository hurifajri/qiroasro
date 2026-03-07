'use client';

import { useForm } from '@tanstack/react-form';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  AVATAR_COLORS,
  AVATAR_GRADIENT_CODES,
  AVATAR_SOLID_CODES,
  DEFAULT_AVATAR_COLOR_CODE,
} from '@/lib/avatar';
import { translateErrors } from '@/lib/form';
import { cn } from '@/lib/utils';
import { UserAvatar } from '../../../_components/user-avatar';
import { getUserProfileByUserIdOpt } from '../../../_queries/user-profile';
import { UpdateUserProfileSchema } from '../../../_schemas/user-profile';
import {
  checkUsernameAvailability,
  updateUserProfile,
} from '../../../_services/user-profile';

interface ProfileProps {
  userId: string;
}

type SaveStatus =
  | { type: 'idle' }
  | { type: 'error' | 'success'; messageKey: string };

export function Profile({ userId }: ProfileProps) {
  const t = useTranslations('settings_page.profile');
  const queryClient = useQueryClient();

  const { data: userProfile } = useSuspenseQuery(
    getUserProfileByUserIdOpt(userId),
  );

  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ type: 'idle' });

  const form = useForm({
    defaultValues: {
      avatarColorCode:
        userProfile?.avatarColorCode ?? DEFAULT_AVATAR_COLOR_CODE,
      displayName: userProfile?.displayName ?? '',
      username: userProfile?.username ?? '',
    },
    validators: {
      onSubmit: UpdateUserProfileSchema,
    },
    onSubmit: async ({ value }) => {
      setSaveStatus({ type: 'idle' });

      const result = await updateUserProfile(userId, value);

      if (result.success) {
        await queryClient.invalidateQueries(getUserProfileByUserIdOpt(userId));

        setSaveStatus({ type: 'success', messageKey: 'save_success' });
        setTimeout(() => setSaveStatus({ type: 'idle' }), 3000);
      } else {
        setSaveStatus({ type: 'error', messageKey: 'save_failed' });
      }
    },
  });

  return (
    <form
      id="profile-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-12"
    >
      {/* Avatar section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">{t('avatar.title')}</h2>

        <form.Field name="avatarColorCode">
          {(field) => {
            return (
              <>
                <UserAvatar
                  name={form.getFieldValue('displayName')}
                  colorCode={field.state.value}
                  className="size-20"
                  textClassName="font-bold text-3xl"
                />

                {/* Solid colors */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">
                    {t('avatar.solid_colors')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_SOLID_CODES.map((colorCode) => (
                      <Button
                        size="icon-lg"
                        key={colorCode}
                        onClick={() => field.handleChange(colorCode)}
                        className={cn(
                          'relative rounded-full transition-transform hover:scale-110',
                          AVATAR_COLORS[colorCode],
                        )}
                      >
                        {field.state.value === colorCode && (
                          <CheckIcon className="absolute inset-0 m-auto size-5 text-white" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Gradient colors */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">
                    {t('avatar.gradient_colors')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_GRADIENT_CODES.map((colorCode) => (
                      <Button
                        size="icon-lg"
                        key={colorCode}
                        onClick={() => field.handleChange(colorCode)}
                        className={cn(
                          'relative rounded-full transition-transform hover:scale-110',
                          AVATAR_COLORS[colorCode],
                        )}
                      >
                        {field.state.value === colorCode && (
                          <CheckIcon className="absolute inset-0 m-auto size-5 text-white" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            );
          }}
        </form.Field>
      </section>

      {/* Personal info section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">{t('personal_info.title')}</h2>

        <FieldGroup className="gap-4">
          {/* Display name */}
          <form.Field name="displayName">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {t('personal_info.name')}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError
                      errors={translateErrors(field.state.meta.errors, (key) =>
                        t(`validation.${key}`),
                      )}
                    />
                  )}
                </Field>
              );
            }}
          </form.Field>

          {/* Username */}
          <form.Field
            name="username"
            validators={{
              onChange: UpdateUserProfileSchema.entries.username,
              onChangeAsync: async ({ value }) => {
                // Skip check if same as current username
                if (!value || value === userProfile?.username) return;

                try {
                  const result = await checkUsernameAvailability(value, userId);

                  if (result.available) return;
                  if (result.reason === 'taken') return 'username_taken';
                  return 'check_failed';
                } catch {
                  return 'check_failed';
                }
              },
              onChangeAsyncDebounceMs: 500,
            }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const isAvailable =
                field.state.meta.isTouched &&
                field.state.meta.isValid &&
                field.state.value !== userProfile?.username;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {t('personal_info.username')}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError
                      errors={translateErrors(field.state.meta.errors, (key) =>
                        t(`validation.${key}`),
                      )}
                    />
                  )}
                  {isAvailable && !isInvalid && (
                    <FieldDescription className="text-green-600 dark:text-green-400">
                      {t('validation.username_available')}
                    </FieldDescription>
                  )}
                </Field>
              );
            }}
          </form.Field>

          {/* Email (read-only) */}
          <Field>
            <FieldLabel htmlFor="email">{t('personal_info.email')}</FieldLabel>
            <Input
              id="email"
              type="email"
              value={userProfile?.email ?? ''}
              disabled
            />
          </Field>
        </FieldGroup>
      </section>

      {/* Save button + status */}
      <Field orientation="responsive">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              form="profile-form"
              disabled={isSubmitting}
              className="w-fit"
            >
              {t('save_changes')}
            </Button>
          )}
        </form.Subscribe>

        {'messageKey' in saveStatus && (
          <p
            className={cn(
              'text-sm',
              saveStatus.type === 'error' && 'text-destructive',
              saveStatus.type === 'success' &&
                'text-green-600 dark:text-green-400',
            )}
          >
            {t(`validation.${saveStatus.messageKey}`)}
          </p>
        )}
      </Field>
    </form>
  );
}
