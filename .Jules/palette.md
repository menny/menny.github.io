## 2025-12-21 - [Accessibility Wins: Skip Links & Viewport]
**Learning:**
1. **Skip Links are Essential:** Even simple static sites need a way for keyboard users to bypass navigation. The pattern `position: absolute; left: -9999px` works well for hiding it visually until focused.
2. **Viewport Scaling:** Disabling zoom (`maximum-scale=1.0`) is a common legacy mobile pattern that actively harms accessibility. Removing it is a quick win that immediately improves usability for visually impaired users on mobile.

**Action:**
- Always check for "Skip to content" links in `default.html` or main layout files.
- Audit `meta[name="viewport"]` tags for zoom restrictions.
