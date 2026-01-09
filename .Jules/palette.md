## 2025-12-21 - [Accessibility Wins: Skip Links & Viewport]
**Learning:**
1. **Skip Links are Essential:** Even simple static sites need a way for keyboard users to bypass navigation. The pattern `position: absolute; left: -9999px` works well for hiding it visually until focused.
2. **Viewport Scaling:** Disabling zoom (`maximum-scale=1.0`) is a common legacy mobile pattern that actively harms accessibility. Removing it is a quick win that immediately improves usability for visually impaired users on mobile.

**Action:**
- Always check for "Skip to content" links in `default.html` or main layout files.
- Audit `meta[name="viewport"]` tags for zoom restrictions.

## 2026-01-09 - [Focus States & Dark Mode Contrast]
**Learning:**
1. **Custom Buttons Need Focus Rings:** Removing `outline: none` without providing a strong alternative makes keyboard navigation impossible. `focus-visible` is a great modern solution to keep mouse users happy while supporting keyboard users.
2. **Hardcoded Colors Break Dark Mode:** When elements (like the "Copy Link" button) have hardcoded colors in CSS, they become invisible in Dark Mode if the background changes but the text color doesn't. Always check custom components in both modes.

**Action:**
- Use `:focus-visible` instead of removing outlines entirely.
- Ensure custom interactive elements use CSS variables for colors to support theming automatically.
