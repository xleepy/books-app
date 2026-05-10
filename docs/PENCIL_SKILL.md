---
name: pencil-design
description: >
  Design patterns and conventions for creating and maintaining Pencil (.pen) UI designs in the books-app. Covers Material 3 (Android) and Glass UI (Apple) platform patterns, design token usage, screen structure, and the MCP-tool-based workflow for editing .pen files directly.
---

# Pencil Design Skill

This guide covers the **design patterns** and **editing workflow** for the `.pen` design files used in the books-app project. Designs are edited directly via MCP tools — there is no CLI or separate design agent involved.

## Design File

```
docs/designs/design-proposal.pen
```

All screens for both platforms live in this single `.pen` file as top-level frames (390x844 each). Screen frames are arranged horizontally across the canvas.

## Design Tokens (Variables)

All colors reference **theme variables** (never hardcoded hex except where explicitly noted below for Glass UI frosted effects). The variable set supports two platform themes:

| Variable | Android (M3) | iOS (Glass UI) |
|----------|-------------|----------------|
| `$accent` | `#AB3F2A` | `#FF6B35` |
| `$accent-red` | `#BA1A1A` | `#FF3B30` |
| `$accent-green` | `#2D6B43` | `#34C759` |
| `$bg-primary` | `#FFFBFF` | `#F2F2F7` |
| `$bg-secondary` | `#F1ECEA` | `#E5E5EACC` |
| `$bg-card` | `#F7F2F0` | `#FFFFFFB8` |
| `$font-primary` | `#1F1A18` | `#000000` |
| `$font-secondary` | `#53443F` | `#3C3C4399` |
| `$font-tertiary` | `#857470` | `#3C3C434D` |
| `$font-inverse` | `#FFFFFF` | `#FFFFFF` |
| `$border` | `#CBC0BA` | `#C6C6C8` |
| `$border-light` | `#E8DFD9` | `#E5E5EA` |
| `$tab-inactive` | `#857470` | `#8E8E93` |
| `$xp-purple` | `#735DB0` | `#AF52DE` |
| `$xp-purple-light` | `#EAE3F6` | `#F2E6FA` |
| `$badge-gold` | `#8D6100` | `#FFCC00` |
| `$badge-gold-light` | `#FFE9B7` | `#FFF8E0` |
| `$challenge-blue` | `#416B9E` | `#007AFF` |
| `$challenge-blue-light` | `#DCE6F4` | `#E5F1FF` |
| `$streak-orange` | `#C85C2A` | `#FF9500` |
| `$streak-orange-light` | `#FFEDE2` | `#FFF0E0` |

**Rule:** Always use `$variable` references for fills, stroke colors, and text fills. Only hardcode hex values for Glass UI frosted fills (see below) and the Glass UI nav bar inactive icon/label colors.

---

## Platform Patterns

Every screen has two variants: **Material 3 (Android)** and **Glass UI (Apple)**. The differences are limited to surface treatments, tab navigation, and shadow depth — structure and layout remain identical.

### Shared Structure (Both Platforms)

| Element | Pattern |
|---------|---------|
| **Screen frame** | `layout: "vertical"`, `width: 390`, `height: 844`, `fill: "$bg-primary"`, `clip: true` |
| **Status bar** | Horizontal, `justifyContent: "space_between"`, `padding: [0,24]`, `height: 62`, `alignItems: "center"` |
| **Status bar - time** | Text `"9:41"`, `fontFamily: "Inter"`, `fontSize: 15`, `fontWeight: "600"`, `fill: "$font-primary"` |
| **Status bar - icons** | Horizontal frame, `gap: 6`. Three icons (signal, wifi, battery-full), each `16x16`, `fill: "$font-primary"` |
| **Header** | Horizontal, `justifyContent: "space_between"`, `padding: [0,24]`, `height: 56`, `alignItems: "center"` |
| **Back button** | Horizontal frame, `gap: 8`, `alignItems: "center"`. Chevron-left icon (`22x22`) + `"Back"` text (`fontSize: 16`, `fontWeight: "500"`) |
| **Screen title** | `layoutPosition: "absolute"`, centered manually (typically `x: 158` for short titles), `fontSize: 18`, `fontWeight: "700"`, `fill: "$font-primary"` |
| **Scroll content** | Vertical, `height: "fill_container"`, `width: "fill_container"`, `clip: true`, `padding: [8,20,24,20]`, `gap` varies (16 for friend screens, 20 for settings) |
| **Section header** | Text, `fontSize: 12`, `fontWeight: "600"`, `fill: "$font-secondary"`, `letterSpacing: 0.8` |
| **Card row** | Horizontal, `justifyContent: "space_between"`, `alignItems: "center"`, `padding: [14,16]`, `width: "fill_container"` |
| **Card divider** | Frame, `height: 1`, `width: "fill_container"`, `fill: "$border-light"` |
| **Font** | All text uses `fontFamily: "Inter"` |
| **Icons** | All icons use `iconFontFamily: "lucide"` |

### Material 3 (Android) Specifics

| Element | Pattern |
|---------|---------|
| **Cards** | `cornerRadius: 16`, `fill: "$bg-card"`, `stroke: { fill: "$border-light", thickness: 1 }`, `effect: { type: "shadow", blur: 4, offset: { x: 0, y: 1 }, color: "#1F1A1810", shadowType: "outer" }` |
| **Tab bar** | `height: 80`, `fill: "$bg-primary"`, `padding: [12,16,28,16]`, `justifyContent: "space_between"`, `stroke: { align: "inside", fill: "$border", thickness: { top: 1 } }` |
| **Tab item** | Vertical frame, `justifyContent: "center"`, `alignItems: "center"`, `gap: 4`, `width: "fill_container"` |
| **Tab icon** | `24x24`, `fill: "$tab-inactive"` (or `"$accent"` for active) |
| **Tab label** | `fontSize: 12`, `fontWeight: "500"` (or `"600"` for active), `fill: "$tab-inactive"` (or `"$accent"` for active) |
| **Pill button (filled)** | `cornerRadius: 20`, `padding: [8,20]`, `fill: "$accent"`, text `fontWeight: "600"`, `fill: "$font-inverse"` |
| **Pill button (outline)** | `cornerRadius: 20`, `padding: [8,20]`, `fill: "$bg-secondary"`, text `fontWeight: "600"`, `fill: "$font-secondary"` |
| **Search bar** | `cornerRadius: 12`, `fill: "$bg-secondary"`, `padding: [12,16]`, horizontal, `gap: 10`, `alignItems: "center"`. Icon `18x18`, text `fontSize: 15`, `fill: "$font-tertiary"` |
| **Badge** | `cornerRadius: 10`, `fill: "$accent"`, `width: 24`, `height: 24`, centered text `fontSize: 13`, `fontWeight: "600"`, `fill: "$font-inverse"` |
| **Sign out button** | `cornerRadius: 12`, `fill: "#FFF0F0"`, same shadow as cards, icon + text in `"$accent-red"` |

### Glass UI (Apple) Specifics

| Element | Pattern |
|---------|---------|
| **Cards** | `cornerRadius: 20`, `fill: "#FFFFFFF0"` (frosted), `stroke: { fill: "$border-light", thickness: 1 }`, `effect: { type: "shadow", blur: 12, offset: { x: 0, y: 2 }, color: "#00000010", shadowType: "outer" }` |
| **Tab bar wrapper** | Vertical frame, `padding: [0,0,24,0]`, `width: "fill_container"`, `alignItems: "center"` |
| **Tab bar pill** | Horizontal, `cornerRadius: 28`, `fill: "#FFFFFFE6"`, `height: 56`, `width: 340`, `padding: 4`, `justifyContent: "space_between"`, `stroke: { align: "inside", fill: "#FFFFFF66", thickness: 0.5 }`, `effect: { type: "shadow", blur: 16, offset: { x: 0, y: 4 }, color: "#00000014", shadowType: "outer" }` |
| **Tab item** | Vertical frame, `justifyContent: "center"`, `alignItems: "center"`, `cornerRadius: 22`, `width: "fill_container"`, `height: "fill_container"` |
| **Tab item - active** | `fill: "#FF6B3526"` (iOS accent at 15% opacity) |
| **Tab icon** | `22x22`, `fill: "#8E8E93"` (or `"#FF6B35"` for active) |
| **Tab label** | `fontSize: 10`, `fontWeight: "500"` (or `"600"` for active), `fill: "#8E8E93"` (or `"#FF6B35"` for active) |
| **Accept button** | `cornerRadius: 8`, `fill: "$accent"`, `padding: [8,16]`, text `fontSize: 13`, `fontWeight: "600"`, `fill: "$font-inverse"` |
| **Reject button** | `cornerRadius: 8`, `fill: "$bg-secondary"`, `padding: [8,16]`, text `fontSize: 13`, `fontWeight: "600"`, `fill: "$font-secondary"` |
| **Cancel link** | Plain text, `fontSize: 14`, `fontWeight: "600"`, `fill: "$accent-red"` |
| **Sign out button** | `cornerRadius: 16`, `fill: "#FFF0F0F0"`, `effect: { type: "shadow", blur: 8, offset: { x: 0, y: 2 }, color: "#0000000D", shadowType: "outer" }` |

---

## Reusable Components in `design-proposal.pen`

All reusable components live inside the **Design System** frame (`E6HfZV`) at the right edge of the canvas. They are organized by platform section. Use `ref` objects to place instances inside screens.

### Usage Pattern

```javascript
// Insert a component instance
card=I(parentId,{type:"ref",ref:"h2twRr"})
// Override child properties (use path: instanceId/childId)
U(card+"/cardLabel",{content:"My Title"})
// Replace a slot's content
newContent=R(card+"/cardContent",{type:"frame",layout:"vertical"})
```

### Platform-Agnostic (Shared) Components

These use `$`-prefixed theme variables and work on both platforms without modification. Colors automatically switch between M3 and Glass UI based on the `platform` theme axis.

| Component | ID | Description | Overridable Children |
|-----------|-----|-------------|---------------------|
| `divider` | `Sl8KT` | Horizontal 1px line, `$border-light` fill, `fill_container` width | — |
| `sectHdr` | `hXUnO` | Section header text (12px, 600, `$font-secondary`, letterSpacing 0.8) | Content override via `U(inst, {content:"...})` |
| `notifBadge` | `StDs7` | 24×24 circle, `$accent` fill, centered count text | `badgeCount` (text) — number inside |
| `tagPillPri` | `f9faly` | Primary tag pill: `$accent-light` bg, cornerRadius 12, padding [4,12] | `pillLabel` (text) — tag text in `$accent` |
| `tagPillSec` | `gGgW1` | Secondary tag pill: `$bg-secondary` bg, `$font-secondary` text | `pillLabel` (text) |
| `spoilerPill` | `AgIiX` | Spoiler pill: `$accent-light` bg, 22h, cornerRadius 11, padding [0,8] | `pillLabel` (text) — "Spoiler" in `$accent` |
| `acceptBtn` | `xsTf1` | Accept button: `$accent` fill, cornerRadius 8, padding [8,16] | `btnLabel` (text) — "Accept" in `$font-inverse` |
| `rejectBtn` | `gSslp` | Reject button: `$bg-secondary` fill, cornerRadius 8, padding [8,16] | `btnLabel` (text) — "Reject" in `$font-secondary` |
| `cancelLink` | `Y7OCW9` | Plain text link in `$accent-red`, 14px, 600 | Content override |
| `backBtn` | `CDPOY` | 40×40 circle, chevron-left icon in `$font-primary` | `btnIcon` (icon_font) |
| `closeBtn` | `C3fDQ` | 40×40 circle, X icon in `$font-primary` | `btnIcon` (icon_font) |
| `sendBtn` | `jCla8` | 40×40 circle, `$accent` fill, send icon in `$font-inverse` | `btnIcon` (icon_font) |
| `addBtn` | `r5mWG` | 40×40 circle, `$accent` fill, plus icon in `$font-inverse` | `btnIcon` (icon_font) |
| `levelBadge` | `o4bfe` | 64×64 circle, `$xp-purple-light` fill, cornerRadius 32 | `levelNum` (text) — level number in `$xp-purple` |
| `levelBadgeSm` | `a6yeea` | 22×22 circle, `$xp-purple` fill, cornerRadius 11 | `levelNum` (text) — level number in `$font-inverse` |
| `streakBadge` | `dAU2G` | Pill badge: `$streak-orange-light` fill, 24h, cornerRadius 12, padding [0,10] | `streakLabel` (text) — streak text in `$streak-orange` |
| `badgeCircle` | `pUZGp` | 32×32 rounded square, `$accent-light` fill, cornerRadius 10, centered icon | `badgeIcon` (icon_font) — 16×16 icon in `$accent` |

### Material 3 (Android) Components

| Component | ID | Description | Overridable Children |
|-----------|-----|-------------|---------------------|
| `m3Card` | `h2twRr` | Card: cornerRadius 16, `$bg-card` fill, 1px `$border-light` stroke, shadow blur 4, clipped | `cardContent` (slot) — replace with content frame |
| `m3HeroCard` | `XFr8t` | Blue hero card: cornerRadius 12, `#4A82B8` fill, clipped (no shadow) | `heroContent` (slot) |
| `m3SearchBar` | `KX2si` | Search bar: cornerRadius 12, `$bg-secondary` fill, 44h, padding [0,14], gap 10 | `searchIcon` (icon_font), `searchPlaceholder` (text) |
| `m3FilledBtn` | `l020UU` | Filled CTA button: cornerRadius 20, `$accent` fill, padding [8,20] | `btnLabel` (text) — 16px, 600, `$font-inverse` |
| `m3OutlineBtn` | `cil2j` | Outline button: cornerRadius 20, `$bg-secondary` fill, padding [8,20] | `btnLabel` (text) — 16px, 600, `$font-secondary` |
| `m3SignOutBtn` | `M1xjW` | Sign out: cornerRadius 12, `#FFF0F0` fill, shadow blur 4, gap 8, padding [16,20], `fill_container` width | `btnIcon` (log-out icon in `$accent-red`), `btnLabel` ("Sign Out" in `$accent-red`) |
| `m3FilterChip` | `zTGvC` | Inactive filter chip: 34h, cornerRadius 17, `$bg-secondary` fill, padding [0,16] | `chipLabel` (text) — 13px, 500, `$font-secondary` |
| `m3FilterChipActive` | `DBH5M` | Active filter chip: 34h, cornerRadius 17, `$accent` fill | `chipLabel` (text) — 13px, 600, `$font-inverse` |
| `m3TabBar` | `ZAsRv` | Bottom nav bar: 80h, `$bg-primary` fill, top border 1px `$border`, padding [12,16,28,16], **4 tabs** (see below) | See tab activation pattern below |

### Glass UI (Apple) Components

| Component | ID | Description | Overridable Children |
|-----------|-----|-------------|---------------------|
| `iosCard` | `eHZ31` | Frosted card: cornerRadius 20, `#FFFFFFF0` fill, 0.5px `$border-light` stroke, shadow blur 12, clipped | `cardContent` (slot) |
| `iosHeroCard` | `o1UiKT` | Blue hero card: cornerRadius 20, `#4A82B8` fill, glow shadow blur 16 `#007AFF40`, clipped | `heroContent` (slot) |
| `iosSearchBar` | `Fvsms` | Search bar: cornerRadius 12, `#FFFFFFF0` fill, 0.5px `#E5E5EA` stroke, shadow blur 4, 44h | `searchIcon` (icon_font), `searchPlaceholder` (text) |
| `iosFilledBtn` | `uCbZC` | Filled CTA button: cornerRadius 16, `#FF6B35` fill, glow shadow blur 16 `#FF6B3530`, padding [14,24] | `btnLabel` (text) — 16px, 600, `$font-inverse` |
| `iosSignOutBtn` | `SacS5` | Sign out: cornerRadius 16, `#FFF0F0F0` fill, shadow blur 8, gap 8, padding [16,20], `fill_container` width | `btnIcon` (log-out icon in `$accent-red`), `btnLabel` ("Sign Out" in `$accent-red`) |
| `iosFilterChip` | `d91JTU` | Inactive filter chip: 36h, cornerRadius 18, `#FFFFFFF0` fill, 0.5px `#FFFFFF26` stroke, shadow blur 4 | `chipLabel` (text) — 13px, 500, `$font-secondary` |
| `iosFilterChipActive` | `Dz3ww` | Active filter chip: 36h, cornerRadius 18, `#FF6B35` fill | `chipLabel` (text) — 13px, 600, `$font-inverse` |
| `iosTabBar` | `gmSJZ` | Floating pill nav: wrapper with bottom padding 24; pill 340×56, cornerRadius 28, `#FFFFFFE6` fill, 0.5px stroke, shadow blur 16, **4 tabs** (see below) | See tab activation pattern below |

### Tab Bar Activation Pattern

Both `m3TabBar` and `iosTabBar` contain 4 tabs: `tab1` (Discover), `tab2` (Discussions/Discuss), `tab3` (Library), `tab4` (Compete). Each tab has `tabNIcon` and `tabNLabel` children. Activate a tab by overriding fills:

```javascript
// Activate tab 2 (Discussions) on M3
U(bar+"/tab2Icon",{fill:"$accent"})
U(bar+"/tab2Label",{fill:"$accent",fontWeight:"600"})
// Or for Glass UI
U(bar+"/tab2Icon",{fill:"#FF6B35"})
U(bar+"/tab2Label",{fill:"#FF6B35",fontWeight:"600"})
U(bar+"/tab2",{fill:"#FF6B3526"})  // iOS active background
```

### Component Child IDs (for Overrides)

When overriding descendants of component instances, use the origin's internal node IDs:

| Component | Internal IDs |
|-----------|-------------|
| `m3TabBar` (ZAsRv) | `tab1Icon`: V88XtH, `tab1Label`: CeJPY, `tab2Icon`: REnlw, `tab2Label`: RN3Ma, `tab3Icon`: UNdtP, `tab3Label`: sWazB, `tab4Icon`: Ghdsz, `tab4Label`: Qk6AS |
| `iosTabBar` (gmSJZ) | `tab1Icon`: WGm7d, `tab1Label`: meBiD, `tab1Frame`: jyVDI, `tab2Icon`: J5G8w, `tab2Label`: Ji8BL, `tab2Frame`: HECSZ, `tab3Icon`: qYCQ8, `tab3Label`: rXZba, `tab3Frame`: LeiIX, `tab4Icon`: O5sPsq, `tab4Label`: Uoot3, `tab4Frame`: b6gygF |
| `m3SearchBar` (KX2si) | `searchPlaceholder`: wtrBP (text) |
| `iosSearchBar` (Fvsms) | `searchPlaceholder`: r7FxA (text) |
| `m3Card` (h2twRr) | `cardContent`: WOV6s (slot — replace with content) |
| `iosCard` (eHZ31) | `cardContent`: w0KO6g (slot — replace with content) |
| Buttons (acceptBtn/rejectBtn/etc.) | `btnLabel` for text, `btnIcon` for icon_font |
| `notifBadge` (StDs7) | `badgeCount`: THJoT (text) |
| Filter chips | `chipLabel` for text |

### Card Retrofitting Pattern

Cards with complex internal content require slot replacement:

```javascript
// 1. Insert card instance
card=I(parentId,{type:"ref",ref:"h2twRr",width:"fill_container"})
// 2. Replace the slot with a new content frame
content=R(card+"/WOV6s",{type:"frame",layout:"vertical",gap:12,padding:16})
// 3. Copy the old card's children into the new content frame
C("oldCardChild1",content,{})
C("oldCardChild2",content,{})
// 4. Delete the old card
D("oldCardId")
// 5. Move the new card to the old card's position
M(card,"parentId",oldIndex)
```

### Retrofitting Status

Existing screens have been retrofitted with reusable components where practical:

| Retrofit | Screens | Status |
|----------|---------|--------|
| M3 tab bars | Discover, Library, Discussions, Book Detail, Challenges, Reading Stats, Settings, Friends List, Pending Requests | Done (9/9) |
| Glass UI tab bars | Discover, Library, Discussions, Book Detail, Challenges, Reading Stats, Settings, Friends List, Pending Requests | Done (9/10 — Challenge Detail uses actionBar) |
| Search bars | Discussions (M3 + Glass UI), Friends List (M3 + Glass UI) | Done (4/4) |
| Cards | All screens | Available for new screens; complex internal content makes retrofitting high-effort per screen |

### Copying a Screen Between Platforms

When creating the other-platform variant of a screen using reusable components:
1. `C` (Copy) the existing screen frame to a new position on the canvas
2. Replace M3 component refs with Glass UI equivalents (e.g., `ref:"h2twRr"` → `ref:"eHZ31"`)
3. Replace `m3TabBar` ref with `iosTabBar` ref
4. For inline elements (status bars, custom layouts), adapt manually per the platform patterns above
5. Set `alignItems: "center"` on the screen frame if using `iosTabBar`

---

## Workflow

All design editing uses MCP tools — there is no CLI, no generation, and no separate AI agent. You work directly with the `.pen` JSON node tree.

### Key MCP Tools

| Tool | Use |
|------|-----|
| `pencil_get_editor_state` | Check which `.pen` file is active, list top-level frames, get schema |
| `pencil_batch_get` | Read specific nodes by ID, search by pattern (e.g., find all reusable components) |
| `pencil_batch_design` | Insert, copy, update, replace, move, or delete nodes (max 25 ops per call) |
| `pencil_get_screenshot` | Visual verification of a frame or node |
| `pencil_snapshot_layout` | Check bounding boxes and layout structure |
| `pencil_get_variables` | Read the design token variables for the file |
| `pencil_find_empty_space_on_canvas` | Find an empty area to place a new screen frame |
| `pencil_open_document` | Open a `.pen` file or create a new one |
| `pencil_search_all_unique_properties` | Audit colors, font sizes, etc. across a subtree |
| `pencil_replace_all_matching_properties` | Bulk-replace properties like fill colors across a subtree |
| `pencil_export_nodes` | Export frames as PNG/JPEG/WEBP/PDF |
| `pencil_get_guidelines` | Load style guides or task-specific instructions |

### Typical Screen Creation Flow

1. **Find space** — `pencil_find_empty_space_on_canvas` for a 390×844 area
2. **Create placeholder** — `I(document, { type: "frame", ..., placeholder: true })` at the found position
3. **Build structure** — Status bar → Header → Scroll container → Content (using `ref` reusable components where applicable) → Tab bar (using `m3TabBar` or `iosTabBar` ref)
4. **Verify** — `pencil_snapshot_layout` to check bounding boxes, `pencil_get_screenshot` for visual review
5. **Remove placeholder** — `U(frameId, { placeholder: false })`
6. **Update AGENTS.md** — Add the new frame to the screen table

**Prefer reusable components over inline construction.** When building content sections, use `ref` instances of `m3Card`/`iosCard`, `m3SearchBar`/`iosSearchBar`, `sectHdr`, `divider`, `tagPillPri`/`tagPillSec`, and the button components rather than creating these patterns inline. Inline construction is only appropriate for truly unique elements.

### Designing for Both Platforms

Always create both variants. Start with Material 3, then copy the screen and swap component refs to Glass UI equivalents. The table in AGENTS.md tracks which frames correspond to which screen/platform.

---

## Screens Inventory

See the table in `AGENTS.md` under **Screens Currently in `design-proposal.pen`** for the full list of frames and their platform assignments.
