'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

interface ProfilePasswordRowProps {
  id: string;
  labelKey: string;
  value: string;
  onChange: (value: string) => void;
}

export function ProfilePasswordRow({
  id,
  labelKey,
  value,
  onChange,
}: ProfilePasswordRowProps) {
  const t = useTranslations('settings_page.profile.password');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field>
      <FieldContent>
        <FieldLabel htmlFor={id} className="text-base">
          {t(labelKey)}
        </FieldLabel>
      </FieldContent>
      <InputGroup>
        <InputGroupInput
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => setShowPassword(!showPassword)}
            aria-label={t(showPassword ? 'hide_password' : 'show_password')}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
