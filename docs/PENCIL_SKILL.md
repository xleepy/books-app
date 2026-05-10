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

The file has no formal reusable components. Common patterns (card rows, dividers, tab items) are created inline per screen. When adding a new screen, copy an existing screen of the target platform and adapt its content.

### Copying a Screen Between Platforms

To create the other-platform variant of a screen:
1. `C` (Copy) the existing screen frame to a new position on the canvas
2. Update cards: `fill: "$bg-card"` → `"#FFFFFFF0"`, `cornerRadius: 16` → `20`, shadow `blur: 4` → `12`, shadow `color: "#1F1A1810"` → `"#00000010"`
3. `D` (Delete) the old tab bar
4. `I` (Insert) a new floating pill tab bar matching the Glass UI pattern
5. Set `alignItems: "center"` on the floatNav wrapper

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

1. **Find space** — `pencil_find_empty_space_on_canvas` for a 390x844 area
2. **Create placeholder** — `I(document, { type: "frame", ..., placeholder: true })` at the found position
3. **Build structure** — Status bar → Header → Scroll container → Content → Tab bar (in multiple `batch_design` calls, max 25 ops each)
4. **Verify** — `pencil_snapshot_layout` to check bounding boxes, `pencil_get_screenshot` for visual review
5. **Remove placeholder** — `U(frameId, { placeholder: false })`
6. **Update AGENTS.md** — Add the new frame to the screen table

### Designing for Both Platforms

Always create both variants. Start with Material 3, then copy-and-adapt for Glass UI. The table in AGENTS.md tracks which frames correspond to which screen/platform.

---

## Screens Inventory

See the table in `AGENTS.md` under **Screens Currently in `design-proposal.pen`** for the full list of frames and their platform assignments.
