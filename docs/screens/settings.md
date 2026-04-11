# Settings Screen

**Route:** `Settings` (stack, no params)
**File:** [src/pages/settings/ui/SettingsScreen.tsx](../../src/pages/settings/ui/SettingsScreen.tsx)
**Design frame:** _User Settings Screen_ in `docs/designs/design-proposal.pen`

## Purpose

User profile and preferences. Groups settings into three sections (Reading, Notifications, Privacy & Account) with a destructive Sign Out action at the bottom.

## Layout

```
┌──────────────────────────────┐
│  ← Back   "Settings"   [👤] │
├──────────────────────────────┤
│  ┌──────────────────────────┐│
│  │  [avatar]                ││
│  │  Jane Doe                ││  ← profile card
│  │  Lv.12 · Bookworm        ││
│  │  [Edit Profile]          ││
│  └──────────────────────────┘│
│                              │
│  READING                     │
│  ┌──────────────────────────┐│
│  │  🎯 Daily Reading Goal   ││  ← ChevronRow
│  │  🔔 Reading Reminders    ││
│  │  🔖 Preferred Genres     ││
│  └──────────────────────────┘│
│                              │
│  NOTIFICATIONS               │
│  ┌──────────────────────────┐│
│  │  🔔 Push Notifications ◉ ││  ← ToggleRow (on)
│  │  ✉  Weekly Digest      ○ ││  ← ToggleRow (off)
│  │  🏆 Challenge Updates  ◉ ││  ← ToggleRow (on)
│  └──────────────────────────┘│
│                              │
│  PRIVACY & ACCOUNT           │
│  ┌──────────────────────────┐│
│  │  👁 Profile Visibility   ││
│  │  🛡 Data & Privacy       ││
│  │  🔒 Change Password      ││
│  └──────────────────────────┘│
│                              │
│  [Sign Out]                  │  ← red destructive button
└──────────────────────────────┘
```

## User flow

1. Arrived from `Progress` via the settings icon.
2. **Profile card** — displays avatar, display name, level badge, and an "Edit Profile" button (edit flow not yet implemented).
3. **Reading section** — three `ChevronRow` items that would push to sub-settings screens (not yet implemented):
   - Daily Reading Goal (currently 30 min)
   - Reading Reminders (currently 9:00 PM daily)
   - Preferred Genres (currently Fiction, Philosophy)
4. **Notifications section** — three `ToggleRow` items with live `Switch` controls:
   - Push Notifications (default: on)
   - Weekly Digest Email (default: off)
   - Challenge Updates (default: on)
   Toggle state is local (`useState`) — not yet persisted.
5. **Privacy & Account section** — three `ChevronRow` items for visibility, data, and password (sub-screens not yet implemented).
6. **Sign Out button** — red destructive CTA (action not yet implemented).
7. **Back button** → `navigation.goBack()` returns to `Progress`.

## Navigation targets

| Trigger | Destination |
|---------|-------------|
| Back button | `Progress` |
| Settings rows (chevron) | Sub-settings screens (not yet implemented) |

## Internal sub-components

| Component | Role |
|-----------|------|
| `SectionLabel` | Uppercased section heading (`READING`, etc.) |
| `ChevronRow` | Icon + title + subtitle + optional value + `>` chevron |
| `ToggleRow` | Icon + title + subtitle + `Switch` |
| `IconBox` | Tinted square icon container |
| `Divider` | 1 px separator between rows |

All sub-components are defined inline within the screen file.
