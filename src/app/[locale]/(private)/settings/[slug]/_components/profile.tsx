'use client';

import { PencilIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
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
        <Avatar size="lg">
          <AvatarImage src={profile.avatarUrl} alt={profile.name} />
          <AvatarFallback>
            {profile.name.charAt(0).toUpperCase()}
          </AvatarFallback>
          <AvatarBadge>
            <PencilIcon />
          </AvatarBadge>
        </Avatar>
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
