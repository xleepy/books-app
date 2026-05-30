# User Theme Settings - Frontend Specification

> Status: Draft | Target: Post-MVP
> Pattern: Spec-Driven Development (SDD) - design first, API contract second, implementation later.

---

## 1. Overview

Allow users to personalize the app theme from Settings. Users can choose a preset palette, customize key colors, preview changes before saving, and reset to the app default.

This feature should not be implemented until the design flow is approved in Pencil.

---

## 2. Design-First Requirement

Before backend or frontend implementation starts, create and review Pencil designs for:

1. Theme Settings entry point inside Settings.
2. Theme Settings screen with presets, custom color controls, preview, save, reset, and error states.
3. Theme Preview panel showing representative UI: book card, button, chip, tab bar, and text hierarchy.
4. Unsaved changes flow for leaving the screen with pending edits.
5. Platform variants for Material 3 and Glass UI.

Designs must be added to `docs/designs/design-proposal.pen` as top-level frames before implementation.

Design review must confirm:

- Which presets ship initially.
- Which colors are user-editable.
- How custom themes behave across Android and iOS variants.
- Accessibility constraints for contrast and readability.
- Whether theme changes apply instantly or only after tapping Save.

---

## 3. Product Scope

### 3.1 In Scope

- Settings entry row: `Theme`.
- Theme Settings screen.
- Preset theme selection.
- Custom accent color selection.
- Background mode selection.
- Live preview before saving.
- Save, reset, and cancel behavior.
- Persisted theme preference per user account.
- Local fallback so selected theme applies before remote sync completes.

### 3.2 Out of Scope

- Full per-token theme editor.
- Theme marketplace.
- Per-book or per-list themes.
- Typography customization.
- Animated seasonal themes.
- Dark mode, unless explicitly folded into this feature later.

---

## 4. Initial Theme Model

### 4.1 Presets

| Preset | Purpose |
|---|---|
| `system` | Uses app default and platform appearance |
| `ink-sage` | Calm literary default candidate |
| `blue-ink` | Cooler reading/tracking style |
| `plum-mist` | Softer social/discovery style |
| `forest-gold` | Classic library/achievement style |
| `custom` | User-edited accent/background settings |

### 4.2 Editable Values

| Field | Description |
|---|---|
| `accent` | Primary action, selected nav, active chips |
| `accentLight` | Accent tint backgrounds |
| `backgroundMode` | `paper`, `mist`, or `system` |
| `useHighContrast` | Optional accessibility boost |

Derived values such as text colors, destructive colors, borders, gold badges, success, and error states should remain system-controlled.

---

## 5. API Contract

### 5.1 Endpoints

| Method | Route | Auth | Body | Response | Description |
|---|---|---|---|---|---|
| `GET` | `/me/theme` | Bearer | - | `UserThemePreference` | Get saved theme |
| `PUT` | `/me/theme` | Bearer | `UpdateThemePreferencePayload` | `UserThemePreference` | Save theme |
| `DELETE` | `/me/theme` | Bearer | - | `204` | Reset to default |

### 5.2 Types

```typescript
type ThemePreset =
  | 'system'
  | 'ink-sage'
  | 'blue-ink'
  | 'plum-mist'
  | 'forest-gold'
  | 'custom';

type BackgroundMode = 'paper' | 'mist' | 'system';

type UserThemePreference = {
  preset: ThemePreset;
  custom?: {
    accent?: string;
    accentLight?: string;
    backgroundMode?: BackgroundMode;
    useHighContrast?: boolean;
  };
  updatedAt: string;
};

type UpdateThemePreferencePayload = {
  preset: ThemePreset;
  custom?: {
    accent?: string;
    accentLight?: string;
    backgroundMode?: BackgroundMode;
    useHighContrast?: boolean;
  };
};
```

### 5.3 Validation

- `preset` is required.
- `custom` is only accepted when `preset === 'custom'`.
- Hex colors must be valid 6-digit RGB values.
- Backend should reject colors that cannot meet minimum contrast requirements.

---

## 6. State Management

Implement backend first, export OpenAPI, then run frontend codegen.

Expected generated hooks:

```typescript
useGetMeThemeQuery()
usePutMeThemeMutation()
useDeleteMeThemeMutation()
```

Do not manually write frontend API endpoints.

Use a small local theme slice because the app needs theme values before and during remote loading:

```typescript
type ThemeState = {
  effectiveTheme: ResolvedTheme;
  draftTheme?: UserThemePreference;
  source: 'default' | 'local' | 'remote';
};
```

Save flow:

1. User edits draft locally.
2. Preview updates immediately inside Theme Settings.
3. User taps Save.
4. `PUT /me/theme` persists changes.
5. On success, app-wide theme updates.
6. On error, keep draft visible and show retryable error.

Mutations must use `.unwrap()` with `try/catch`.

---

## 7. Navigation

Add to Settings stack:

```text
SettingsScreen
  -> ThemeSettingsScreen
```

If unsaved changes exist, intercept back navigation and show discard confirmation.

---

## 8. UI/UX Specification

Settings row:

- Leading icon: palette or paintbrush.
- Title: `Theme`.
- Subtitle: current selection, e.g. `Ink + Sage`.
- Trailing chevron.

Theme Settings layout:

```text
Header
Preview
Presets
Customize
Actions
```

Preview should include:

- Book card.
- Primary button.
- Secondary chip row.
- Mini tab bar.
- Text hierarchy sample.

Actions:

- `Reset to Default`.
- `Save Changes`.

App-wide theme should update only after Save unless design review decides otherwise.

---

## 9. Accessibility

- Text contrast must meet WCAG AA.
- Primary buttons must remain readable on custom accents.
- Selected tab/chip states must not rely only on hue.
- High contrast mode increases text and border contrast without changing layout.
- Swatches must have accessible labels.

---

## 10. Component Breakdown

```text
pages/settings/ui/ThemeSettingsScreen.tsx
pages/settings/ui/components/
  ThemePreview.tsx
  ThemePresetCard.tsx
  AccentSwatchRow.tsx
  BackgroundModeControl.tsx
  ThemeActionBar.tsx
features/theme-settings/
  model/themeSlice.ts
  lib/resolveTheme.ts
  lib/validateThemeContrast.ts
entities/theme/
  model/types.ts
```

---

## 11. Acceptance Criteria

- User can open Theme Settings from Settings.
- User can select a preset and see preview update.
- User can customize allowed theme fields.
- User can save theme changes with backend persistence.
- Saved theme applies on next app launch.
- User can reset to default.
- Unsaved changes prompt appears when leaving.
- Theme API is generated from backend OpenAPI.
- No manual frontend API endpoint files are introduced.
- Theme screen has both Material 3 and Glass UI Pencil designs approved before implementation.

---

## 12. Implementation Order

1. Draft Pencil designs in `docs/designs/design-proposal.pen`.
2. Review and approve the design flow.
3. Implement backend routes and persistence in `../books-app-backend/`.
4. Export OpenAPI from backend.
5. Run frontend `npm run codegen`.
6. Implement frontend screen, local slice, theme resolution, and tests.
7. Run `npm run typecheck`, `npm run lint`, and focused tests.

---

## 13. Open Questions

- Should theme changes apply app-wide immediately or only after Save?
- Should custom themes sync across devices?
- Should unauthenticated users be allowed to choose a local-only theme?
- Should high contrast be a theme option or a separate accessibility setting?
- Should dark mode be included now or deferred?
