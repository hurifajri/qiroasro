import { cookies } from 'next/headers';
import { locale as getRootLocale } from 'next/root-params';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

type LocaleMessages = Record<string, string>;

async function resolveLocale(explicitLocale?: string) {
  if (hasLocale(routing.locales, explicitLocale)) {
    return explicitLocale;
  }

  try {
    const paramLocale = await getRootLocale();
    if (hasLocale(routing.locales, paramLocale)) {
      return paramLocale;
    }
  } catch {
    // Fallback for contexts without root params (e.g. Route Handlers)
  }

  try {
    const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
    if (hasLocale(routing.locales, cookieLocale)) {
      return cookieLocale;
    }
  } catch {
    // Fallback when cookies() is unavailable during static generation
  }

  return routing.defaultLocale;
}

export default getRequestConfig(async ({ locale: explicitLocale }) => {
  const locale = await resolveLocale(explicitLocale);

  const [globalMessages, pageMessages, quizMessages] = await Promise.all([
    import(`./locales/${locale}/global.json`).then(
      (m: { default: LocaleMessages }) => m.default,
    ),
    import(`./locales/${locale}/page.json`).then(
      (m: { default: LocaleMessages }) => m.default,
    ),
    import(`./locales/${locale}/quiz.json`)
      .then((m: { default: LocaleMessages }) => m.default)
      .catch((): LocaleMessages => ({})),
  ]);

  return {
    locale,
    messages: {
      ...globalMessages,
      ...pageMessages,
      ...quizMessages,
    },
  };
});
