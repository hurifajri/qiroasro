---
trigger: always_on
---

## 6. SEO, Accessibility and Semantic HTML

### SEO Requirements

```typescript
// Every page.tsx must have generateMetadata
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('page.metadata');
  const locale = await getLocale();

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: '/page-path',
      languages: { id: '/page-path', en: '/page-path' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}
```

### Semantic HTML

```typescript
// ✅ Proper semantic structure
<>
  <header>
    <nav aria-label="Main navigation">
      {/* Navigation items */}
    </nav>
  </header>

  <main>
    <h1 className="sr-only">{t('title')}</h1>
    <article>
      <section aria-labelledby="section-heading">
        <h2 id="section-heading">{t('section.title')}</h2>
        {/* Content */}
      </section>
    </article>
  </main>

  <footer>
    {/* Footer content */}
  </footer>
</>
```

### Accessibility Checklist

- [ ] Every page has an `<h1>` (can be visually hidden with `sr-only`)
- [ ] Interactive elements are keyboard accessible
- [ ] Images have meaningful `alt` text
- [ ] Form inputs have associated `<label>` elements
- [ ] Buttons have accessible names (text content or `aria-label`)
- [ ] Color contrast meets WCAG 2.1 AA standards (4.5:1 for text)
- [ ] Focus states are visible
- [ ] No `userScalable: false` in viewport settings

```typescript
// ❌ Avoid
export const viewport: Viewport = {
  userScalable: false,  // Breaks accessibility!
};

// ✅ Allow user scaling
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
```

### Button Accessibility

```typescript
// ❌ Icon-only button without accessible name
<Button onClick={handleClick}>
  <TrashIcon />
</Button>

// ✅ With aria-label
<Button onClick={handleClick} aria-label={t('delete')}>
  <TrashIcon />
</Button>

// ✅ Or with sr-only text
<Button onClick={handleClick}>
  <TrashIcon />
  <span className="sr-only">{t('delete')}</span>
</Button>
```

---