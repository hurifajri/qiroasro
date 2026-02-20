---
trigger: always_on
---

## Analytics

### Overview

Qiroasro uses **PostHog** for analytics all-in-one:
- Page views & traffic sources
- Custom events
- Session replay
- Heatmaps

### Environment Variables

```bash
# .env.local (optional - analytics disabled if not set)
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Custom Event Tracking

```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent('quiz_started', { mode: 'practice', difficulty: 'easy' });
trackEvent('quiz_completed', { score: 85, timeSpent: 120 });
```

### Best Practices

1. **Event Naming**: Use `snake_case` for event names
2. **Privacy**: Never track PII without consent
3. **Keep it simple**: Flat properties, no deep nesting

---