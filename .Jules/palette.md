## 2025-12-21 - [Accessibility Wins: Skip Links & Viewport]
**Learning:**
1. **Skip Links are Essential:** Even simple static sites need a way for keyboard users to bypass navigation. The pattern `position: absolute; left: -9999px` works well for hiding it visually until focused.
2. **Viewport Scaling:** Disabling zoom (`maximum-scale=1.0`) is a common legacy mobile pattern that actively harms accessibility. Removing it is a quick win that immediately improves usability for visually impaired users on mobile.

**Action:**
- Always check for "Skip to content" links in `default.html` or main layout files.
- Audit `meta[name="viewport"]` tags for zoom restrictions.

## 2025-12-23 - [Copy Link Button: Semantic HTML & Visual Feedback]
**Learning:**
1. **Use Semantic HTML:** When implementing interactive elements that perform actions (not navigation), use `<button>` instead of `<a>` tags. Buttons provide native keyboard support (Space and Enter keys) and proper accessibility semantics without requiring additional ARIA attributes or JavaScript event handlers.
2. **Visual Feedback Matters:** For actions like "Copy to Clipboard", providing immediate visual feedback (changing text to "Copied!" with a success color) significantly improves user experience. This micro-interaction confirms the action succeeded.
3. **Separation of Concerns:** Moving JavaScript to dedicated external files rather than inline scripts improves maintainability, reusability, and follows modern web development best practices.
4. **Prevent Race Conditions:** When dealing with timed state changes (like resetting button text after 2 seconds), clear any existing timeouts before setting new ones to handle rapid clicks gracefully.

**Action:**
- Use `<button>` elements for actions, `<a>` elements only for navigation
- Provide visual feedback for user actions with both text changes and color cues
- Use ARIA labels (`aria-label`) to enhance button descriptions for screen readers
- Extract inline scripts to external JS files for better code organization
- Handle edge cases like rapid clicks or multiple instances with proper state management

## 2026-01-09 - [Focus States & Dark Mode Contrast]
**Learning:**
1. **Custom Buttons Need Focus Rings:** Removing `outline: none` without providing a strong alternative makes keyboard navigation impossible. `focus-visible` is a great modern solution to keep mouse users happy while supporting keyboard users.
2. **Hardcoded Colors Break Dark Mode:** When elements (like the "Copy Link" button) have hardcoded colors in CSS, they become invisible in Dark Mode if the background changes but the text color doesn't. Always check custom components in both modes.

**Action:**
- Use `:focus-visible` instead of removing outlines entirely.
- Ensure custom interactive elements use CSS variables for colors to support theming automatically.

## 2026-01-11 - [Icon-Only Lists & Accessibility]
**Learning:**
1. **Empty List Items confuse Screen Readers:** Using an empty `<li>` with an icon class as a visual label for a list creates a confusing experience for screen reader users (reading "empty" or nothing).
2. **Lists need Labels:** When a list's purpose is visual (indicated by an icon), the `<ul>` element must have an `aria-label` to convey that meaning (e.g., "Categories", "Tags") to non-visual users.
3. **Hide Decorations:** Purely decorative icons used as list markers or labels should be hidden with `aria-hidden="true"` to prevent noise.

**Action:**
- Audit lists that use icons as headers/labels.
- Apply `aria-label` to the container `<ul>` or `<nav>`.
- Hide the decorative icon elements from assistive technology.
