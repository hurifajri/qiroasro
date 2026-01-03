import { getRequestConfig } from 'next-intl/server';
import { getPersistedGlobalStore } from '@/stores/global';

type LocaleMessages = Record<string, string>;

export default getRequestConfig(async () => {
  const { locale } = await getPersistedGlobalStore();
  const importedMessages = (await import(`./locales/${locale}.json`)) as {
    default: LocaleMessages;
  };
  const messages = importedMessages.default;

  return { locale, messages };
});
