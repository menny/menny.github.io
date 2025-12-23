## 2025-12-21 - [Accessibility Wins: Skip Links & Viewport]
**Learning:**
1. **Skip Links are Essential:** Even simple static sites need a way for keyboard users to bypass navigation. The pattern `position: absolute; left: -9999px` works well for hiding it visually until focused.
2. **Viewport Scaling:** Disabling zoom (`maximum-scale=1.0`) is a common legacy mobile pattern that actively harms accessibility. Removing it is a quick win that immediately improves usability for visually impaired users on mobile.

**Action:**
- Always check for "Skip to content" links in `default.html` or main layout files.
- Audit `meta[name="viewport"]` tags for zoom restrictions.

## 2025-12-23 - [Accessible Custom Buttons & Feedback]
**Learning:**
1. **Semantic Upgrades for Anchors:** When `<a>` tags are used as buttons (e.g., `href="#"`), they require `role="button"` and `tabindex="0"`. Crucially, they lack native keyboard support for the Space key (unlike `<button>`), so a `keydown` handler for Space is mandatory for full accessibility.
2. **Feedback Loop:** For actions like "Copy to Clipboard", providing immediate visual feedback (changing text to "Copied!") is a high-value micro-interaction. Using `aria-live="polite"` ensures this feedback is also perceived by screen reader users.

**Action:**
- Convert action-only links to true `<button>` elements where possible, or add `role="button"`, `tabindex="0"`, and `keydown` handlers.
- Always couple visual feedback with `aria-live` announcements.
