# Penpot Design Update Notes

`design-proposal.pen` is edited directly via the Pencil desktop app (MCP). This file tracks design changes — what has been applied and what remains outstanding.

---

## Applied changes

### Frames added

#### Login
Added screen at canvas x=460 reflecting `src/pages/auth/ui/LoginScreen.tsx` exactly:
- "Books" title (Inter 800, 40 px, centred) + "Track your reading journey" subtitle
- "Continue with Google" button (`$bg-card`, `$border` stroke, 12 px radius, globe icon)
- "Sign in with Apple" button (black fill, apple icon, 12 px radius)
- "or" divider with border-colour lines either side
- Email / Password inputs (`$bg-card`, `$border` stroke, 12 px radius)
- "Sign in" primary button (`$accent`)
- "No account? Create one" toggle link (`$font-secondary`)

#### Thread Detail
Full-screen reading view for an opened thread:
- Status bar + nav bar (back arrow, truncated title, `Trash2` icon in `$accent-red` — owner only)
- Thread card: 52×72 book cover (6 px radius), book context label, title (bold 17 px), `⚠ Spoilers` pill (`$accent-light`/`$accent`), body text (14 px, 1.57 line-height), footer with author avatar (28 px) + name + time + reply count + like count
- Replies section: "N Replies" header (bold 16 px) + reply cards (32 px avatar, name, time, body; `$bg-card`, `$border-light`, 12 px radius)
- Fixed reply bar: `$bg-secondary` text input (12 px radius) + 40 px `$accent` send button

#### Create Thread
Bottom-sheet-style modal frame:
- Header: `×` close icon, "New Thread" title (bold 16 px), "Post" pill (`$accent`, 20 px radius)
- Error banner (`#FDECEA` bg, `#C62828` text, 10 px radius) — conditionally visible
- Title field: semibold 14 px label + `$bg-secondary` input (12 px radius, 15 px regular) + `0 / 120` character counter
- Body field: same pattern, min-height 160 px, `0 / 2000` counter
- Link a Book: `(optional)` label suffix; book-selected card (44×60 cover, title, author, `×` dismiss) shown in frame
- Contains Spoilers: `$bg-card` card with border, label + hint text + Switch in ON state (`$accent-light` track)

---

### Discussion Threads (updated)

- **Active filter chip** changed from _All_ → **Recent** (`$accent` fill, `$font-inverse` text); _All_ is now inactive.
- **Author row** added to all three thread cards — 20 px `$accent-light` avatar ellipse + author handle in `$font-tertiary` 11 px.
- **Canvas annotations** added:
  - `+` button opens Create Thread modal
  - Empty state: centred text "No discussions yet. Be the first to start one!" — 14 px regular `$font-secondary`

### Reading Stats & Level (updated)

- **Badge icons** updated to match actual earned badge slugs: `book-open` ("Bookworm"), `flame` ("On Fire"), `star` ("Top Reader").
- **XP counter** updated to level-relative format: `250 / 400 XP` (was total-XP format `2,450 / 3,000 XP`).
- **Canvas annotations** added for loading state (activity indicator) and empty state ("No badges earned yet — keep reading!").

### Challenges & Competitions (updated)

- **Canvas annotation** on leaderboard section: leaderboard is per-challenge (first active challenge participants), not global.
- **Canvas annotation** on filter row: chips are visible but not yet functional for server-side filtering — planned feature.

---

## Code changes applied alongside design

| File | Change |
|------|--------|
| `src/entities/discussion/ui/ThreadCard.tsx` | Thread title `fontFamily` changed from `fontFamily.semibold` (600) to `fontFamily.bold` (700) to match `ThreadDetailScreen` |

---

## Design tokens unchanged

All 24 tokens in `colors.ts` remain unchanged from the original design.

---

## How to apply future updates

1. Open `docs/designs/design-proposal.pen` in the Pencil desktop app (or via MCP).
2. Make changes following existing frame conventions (spacing, tokens, Inter font family).
3. Record each change in this file under a new dated section.
