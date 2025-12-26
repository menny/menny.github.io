## 2025-12-21 - [Accessibility Wins: Skip Links & Viewport]
**Learning:**
1. **Skip Links are Essential:** Even simple static sites need a way for keyboard users to bypass navigation. The pattern `position: absolute; left: -9999px` works well for hiding it visually until focused.
2. **Viewport Scaling:** Disabling zoom (`maximum-scale=1.0`) is a common legacy mobile pattern that actively harms accessibility. Removing it is a quick win that immediately improves usability for visually impaired users on mobile.

**Action:**
- Always check for "Skip to content" links in `default.html` or main layout files.
- Audit `meta[name="viewport"]` tags for zoom restrictions.

## 2025-12-26 - [Interaction: Header Anchors]
**Learning:**
On content-heavy pages (like blog posts), users often want to share specific sections. Automatically generating anchor links for headers (h2-h6) is a high-impact, low-effort UX win. Crucially, ensuring these links are keyboard accessible (visible on focus) and have descriptive aria-labels makes them accessible to everyone, not just mouse users.

**Action:**
- When auditing content-heavy sites, check if headers have permalinks.
- Implement anchor links with hover-reveal patterns, but ensure `focus` visibility for keyboard users.
- Use `aria-label` to describe where the anchor link goes (e.g., "Permalink to [Header Text]").
