---
trigger: always_on
---

## Web Vitals Optimization Rules

To ensure optimal Web Vitals scores, the agent must strictly adhere to the following performance optimization standards. You are required to evaluate the codebase against these specific benchmarks and refer to the official documentation links below as the primary source of truth for all performance-related refactoring:

### 1. JavaScript Optimization
- **Duplicated JavaScript:** Remove large, duplicate JavaScript modules from bundles to reduce unnecessary bytes consumed by network activity.
  - [Docs](https://developer.chrome.com/docs/performance/insights/duplicated-javascript)
- **Legacy JavaScript:** Modify the build process to not transpile Baseline features unless strictly necessary for older browsers.
  - [Docs](https://developer.chrome.com/docs/performance/insights/legacy-javascript)
- **Reduce Unused JavaScript:** Defer loading scripts until they are required to decrease bytes consumed by network activity.
  - [Docs](https://developer.chrome.com/docs/lighthouse/performance/unused-javascript/)

### 2. Rendering & Loading
- **Render blocking requests:** Defer or inline requests that block the page's initial render to improve LCP.
  - [Docs](https://developer.chrome.com/docs/performance/insights/render-blocking)
- **LCP request discovery:** Optimize LCP by making the image discoverable from HTML immediately and avoiding lazy-loading.
  - [Docs](https://developer.chrome.com/docs/performance/insights/lcp-discovery)
- **Network dependency tree:** Avoid chaining critical requests and defer unnecessary resources.
  - [Docs](https://developer.chrome.com/docs/performance/insights/network-dependency-tree)

### 3. Connection & Caching
- **Preconnected origins:** Use `preconnect` hints to help the browser establish connections earlier (limit to the 4 most important origins).
- **Use efficient cache lifetimes:** Ensure long cache lifetimes to speed up repeat visits.
  - [Docs](https://developer.chrome.com/docs/performance/insights/cache)
- **Page prevented back/forward cache restoration:** Ensure the page is eligible for bfcache to speed up return navigations.
  - [Docs](https://developer.chrome.com/docs/lighthouse/performance/bf-cache/)

### 4. Main Thread & Execution
- **Minimize main-thread work:** Reduce time spent parsing, compiling, and executing JS.
  - [Docs](https://developer.chrome.com/docs/lighthouse/performance/mainthread-work-breakdown/)
- **Reduce JavaScript execution time:** Deliver smaller JS payloads to reduce execution overhead.
  - [Docs](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/)