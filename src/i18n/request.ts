import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

type LocaleMessages = Record<string, string>;

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const importedMessages = (await import(`./locales/${locale}.json`)) as {
    default: LocaleMessages;
  };
  const messages = importedMessages.default;

  return { locale, messages };
});
