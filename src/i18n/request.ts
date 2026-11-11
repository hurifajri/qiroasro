import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

type LocaleMessages = Record<string, string>;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [globalMessages, pageMessages, quizMessages] = await Promise.all([
    import(`./locales/${locale}/global.json`).then(
      (m) => m.default as LocaleMessages,
    ),
    import(`./locales/${locale}/page.json`).then(
      (m) => m.default as LocaleMessages,
    ),
    import(`./locales/${locale}/quiz.json`)
      .then((m) => m.default as LocaleMessages)
      .catch(() => ({}) as LocaleMessages),
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
