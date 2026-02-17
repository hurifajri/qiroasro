'use client';

import { CheckIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { UserAvatar } from '../../../_components/user-avatar';
import {
  AVATAR_COLORS,
  AVATAR_GRADIENT_CODES,
  AVATAR_SOLID_CODES,
} from '../../../_lib/avatar';
import type { ProfileForm } from '../../_schemas/settings';
import { ProfileFieldRow } from './profile-field-row';
import { ProfilePasswordRow } from './profile-password-row';

interface ProfileProps {
  defaultProfile: ProfileForm;
}

export function Profile({ defaultProfile }: ProfileProps) {
  const t = useTranslations('settings_page.profile');

  // Profile form state
  const [profile, setProfile] = useState<ProfileForm>(defaultProfile);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveChanges = () => {
    // TODO: Implement save changes logic
    console.log('Save changes:', { profile, currentPassword, newPassword });
  };

  const handleExportData = () => {
    // TODO: Implement export data logic
    console.log('Export data');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement delete account logic
    console.log('Delete account');
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Avatar section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">{t('avatar.title')}</h2>
        <UserAvatar
          name={profile.name}
          colorCode={profile.avatarColorCode}
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
                  onClick={() =>
                    setProfile({ ...profile, avatarColorCode: colorCode })
                  }
                  className={cn(
                    'relative rounded-full transition-transform hover:scale-110',
                    AVATAR_COLORS[colorCode],
                  )}
                >
                  {profile.avatarColorCode === colorCode && (
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
                  onClick={() =>
                    setProfile({ ...profile, avatarColorCode: colorCode })
                  }
                  className={cn(
                    'relative rounded-full transition-transform hover:scale-110',
                    AVATAR_COLORS[colorCode],
                  )}
                >
                  {profile.avatarColorCode === colorCode && (
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
            value={profile.name}
            onChange={(value) => setProfile({ ...profile, name: value })}
          />
          <ProfileFieldRow
            id="username"
            labelKey="username"
            value={profile.username}
            onChange={(value) => setProfile({ ...profile, username: value })}
          />
          <ProfileFieldRow
            id="email"
            labelKey="email"
            type="email"
            value={profile.email}
            onChange={(value) => setProfile({ ...profile, email: value })}
          />
        </FieldGroup>
      </section>

      {/* Password section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">{t('password.title')}</h2>
        <Separator />
        <FieldGroup className="gap-4">
          <ProfilePasswordRow
            id="current_password"
            labelKey="current_password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <ProfilePasswordRow
            id="new_password"
            labelKey="new_password"
            value={newPassword}
            onChange={setNewPassword}
          />
        </FieldGroup>
      </section>

      {/* Save button */}
      <Button onClick={handleSaveChanges} className="w-fit">
        {t('save_changes')}
      </Button>

      {/* Footer actions */}
      <div className="flex flex-col">
        <Button
          variant="link"
          size="xs"
          onClick={handleExportData}
          className="no-underline! w-fit px-0 text-foreground uppercase"
        >
          {t('export_data')}
        </Button>
        <Button
          variant="link"
          size="lg"
          onClick={handleDeleteAccount}
          className="no-underline! w-fit px-0 text-destructive uppercase"
        >
          {t('delete_account')}
        </Button>
      </div>
    </div>
  );
}
