# React Patterns Guide

This guide establishes React component patterns for the books-app frontend, grounded in [react.dev](https://react.dev) best practices. Follow these patterns to keep components predictable, testable, and free of common bugs.

---

## 1. Data Loading vs. Presentation — Separate Concerns

**A component should either load data or render UI, not both.**

When a page needs to fetch data and also render an interactive form, split it:

- **Screen component** (`*Screen.tsx`): Loads data, handles loading/error states, passes derived values as props.
- **Form/Presentation component**: Receives all data as props. Manages local editing state with `useState`. Submits mutations.

### ✅ Correct — Screen loads, Form edits

```tsx
// pages/reading-detail/ui/ReadingDetailScreen.tsx
export function ReadingDetailScreen() {
  const { data: book, isLoading } = useGetBooksByIdQuery(bookId);
  const { data: libraryData } = useGetLibraryQuery({});

  if (isLoading) return <ActivityIndicator />;
  if (!book) return <Text>Book not found</Text>;

  const pageCount = book.pageCount ?? 300;
  const initialPage = libraryData?.data.find(b => b.id === bookId)?.currentPage ?? 0;

  return (
    <ReadingProgressForm
      bookId={bookId}
      pageCount={pageCount}
      initialPage={initialPage}
      onUpdated={() => navigation.goBack()}
    />
  );
}

// pages/reading-detail/ui/ReadingProgressForm.tsx
export function ReadingProgressForm({ bookId, pageCount, initialPage, onUpdated }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  // ... editing logic, no data fetching
}
```

### ❌ Incorrect — Screen mixes loading and form logic

```tsx
export function ReadingDetailScreen() {
  const { data: book } = useGetBooksByIdQuery(bookId);
  const [currentPage, setCurrentPage] = useState(0);

  // ❌ useEffect to sync fetched data into local state
  useEffect(() => {
    setCurrentPage(book?.currentPage ?? 0);
  }, [book]);

  // ...
}
```

---

## 2. You Might Not Need an Effect

[Read the full guide on react.dev](https://react.dev/learn/you-might-not-need-an-effect)

React effects (`useEffect`) are for **synchronization with external systems** (browser APIs, subscriptions, non-React widgets). They are NOT for:

- Transforming data for rendering
- Handling user events
- Syncing props into state
- Resetting state when props change

### ❌ Don't use useEffect to sync props → state

```tsx
// BAD — unnecessary effect
const [currentPage, setCurrentPage] = useState(0);

useEffect(() => {
  setCurrentPage(serverPage);
}, [serverPage]);
```

This creates a "source of truth" problem. The state doesn't reflect the prop immediately, causing flicker and stale values.

### ✅ Pass initial values as props; reset with `key`

```tsx
// GOOD — parent controls initial value, child owns edits
<ReadingProgressForm
  key={bookId}           // React recreates component when book changes
  initialPage={serverPage}
  pageCount={pageCount}
/>
```

Inside the form:

```tsx
export function ReadingProgressForm({ initialPage, pageCount }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  // No effect needed — initialPage is set once at mount
}
```

Using `key={bookId}` tells React to **unmount and remount** the component when the book changes. The new instance gets fresh props and fresh state. No synchronization logic required.

### ✅ Modals: conditionally render the body component inside the Modal

`Modal` needs to stay mounted to drive `animationType` (fade / slide), but its inner content should only render when visible so state reinitializes naturally. Extract the body into a nested component and conditionally render it inside the `Modal`:

```tsx
// Parent
<GenrePickerModal visible={isVisible} selectedGenres={genres} ... />

// Modal shell — stays mounted so animation works
export function GenrePickerModal({ visible, selectedGenres, onSave, onClose }) {
  return (
    <Modal visible={visible} animationType="fade">
      {visible && (
        <GenrePickerBody
          initialSelected={selectedGenres}
          onSave={onSave}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}

// Inner body — only mounts when visible opens; no useEffect needed
function GenrePickerBody({ initialSelected, onSave, onClose }) {
  const [localSelected, setLocalSelected] = useState(new Set(initialSelected));
  // ...
}
```

This gives you both the animation behavior (Modal tracks `visible`) and the reset behavior (inner component mounts/unmounts with `visible`).

### When you DO need useEffect

```tsx
// ✅ External system synchronization
useEffect(() => {
  const connection = createConnection(serverUrl);
  connection.connect();
  return () => connection.disconnect();
}, [serverUrl]);
```

---

## 3. Wait for Data Before Rendering

**Always show a loading state while ANY required data is loading.** Don't partially render with `undefined` data.

### ✅ Correct — single loading gate

```tsx
const { data: book, isLoading: isLoadingBook } = useGetBooksByIdQuery(bookId);
const { data: libraryData, isLoading: isLoadingLibrary } = useGetLibraryQuery({});

const isLoading = isLoadingBook || isLoadingLibrary;

if (isLoading) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator color={colors.accent} size="large" />
    </View>
  );
}

if (!book) return <Text>Book not found</Text>;

// Now TypeScript knows `book` is defined
return <ReadingProgressForm pageCount={book.pageCount} ... />;
```

### ❌ Incorrect — partial render with missing data

```tsx
const { data: book } = useGetBooksByIdQuery(bookId);

// ❌ `book` might be undefined here
return (
  <View>
    <Text>{book.title}</Text>  {/* crash if book is undefined */}
  </View>
);
```

---

## 4. Form State Management

### Local form state with `useState`

For single-screen forms, use React state directly:

```tsx
export function ReadingProgressForm({ initialPage, pageCount }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isEditing, setIsEditing] = useState(false);
  const [draftPage, setDraftPage] = useState(String(initialPage));

  // local adjustments don't need to go up until submit
  function adjust(delta: number) {
    setCurrentPage(p => Math.max(0, Math.min(pageCount, p + delta)));
  }

  async function handleSubmit() {
    await patchLibrary({ bookId, body: { currentPage } }).unwrap();
    onUpdated();
  }
}
```

### When to use a local slice

Use a Redux slice only when:
- The form spans multiple screens (wizard flow)
- Draft state must survive unmount (e.g., background save)
- Multiple features need to read the same draft state

For simple forms, `useState` is always preferred.

---

## 5. Mutation Patterns

### Always `await .unwrap()` and handle errors

```tsx
async function handleSubmit() {
  try {
    await patchLibrary({ bookId, body: { currentPage } }).unwrap();
    navigation.goBack();
  } catch {
    Alert.alert('Error', 'Failed to update progress. Please try again.');
  }
}
```

### Disable UI while submitting

```tsx
<Pressable
  onPress={handleSubmit}
  disabled={isPatching}
  style={[styles.button, isPatching && styles.disabled]}
>
  {isPatching ? <ActivityIndicator /> : <Text>Update</Text>}
</Pressable>
```

---

## 6. Component Props Pattern

### Pass derived values, not raw data

The screen should compute derived values so the child doesn't need to know about data shapes:

```tsx
// ✅ Screen derives values; Form receives primitives
<ReadingProgressForm
  pageCount={book.pageCount ?? libraryItem?.pageCount ?? 300}
  initialPage={libraryItem?.currentPage ?? 0}
/>

// ❌ Form shouldn't have to look up library items
<ReadingProgressForm bookId={bookId} libraryData={libraryData} />
```

### Callback props for side effects

The form should NOT know about navigation. The screen decides what happens after success:

```tsx
// Screen owns navigation
<ReadingProgressForm onUpdated={() => navigation.goBack()} />

// Form just calls the callback
async function handleSubmit() {
  await patchLibrary({ ... }).unwrap();
  onUpdated(); // "I'm done, parent decides what next"
}
```

---

## 7. FlatList Patterns

Follow the [React Native FlatList docs](https://reactnative.dev/docs/flatlist) for rendering scrollable lists. FlatList is a `PureComponent` that windowizes content for performance — use it instead of `ScrollView` whenever you render an array of items.

### ✅ Use FlatList for lists; ScrollView only for static content

```tsx
// ✅ FlatList with pull-to-refresh
<FlatList
  data={challenges}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ChallengeCard challenge={item} />}
  refreshing={isFetching}
  onRefresh={refetch}
  ListEmptyComponent={<Text>No challenges yet.</Text>}
  ListHeaderComponent={<Text style={styles.title}>Active Challenges</Text>}
/>

// ❌ ScrollView mapping an array — loads everything into memory
<ScrollView>
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</ScrollView>
```

### Required props

- **`data`**: the array to render.
- **`renderItem`**: receives `{ item, index, separators }` and returns a React element.
- **`keyExtractor`**: always provide this so React can track re-ordering correctly.

### PureComponent behavior — use `extraData`

FlatList only re-renders when `data` or `extraData` change shallowly. If `renderItem` depends on external state (e.g. `selectedId`), pass it via `extraData`:

```tsx
<FlatList
  data={challenges}
  extraData={selectedId}   // triggers re-render when selection changes
  renderItem={({ item }) => (
    <ChallengeCard
      challenge={item}
      selected={item.id === selectedId}
    />
  )}
/>
```

### List header, footer, and empty states

Use built-in props instead of manual conditional rendering:

| Prop | Purpose |
|------|---------|
| `ListHeaderComponent` | Renders above the list, scrolls with it |
| `ListFooterComponent` | Renders below the list |
| `ListEmptyComponent` | Shown when `data` is empty |
| `ItemSeparatorComponent` | Rendered between items |

### Pull-to-refresh

Bind `refreshing` and `onRefresh` to RTK Query's `isFetching` and `refetch`:

```tsx
const { data, isFetching, refetch } = useGetChallengesQuery(undefined);

<FlatList
  data={data?.data ?? []}
  refreshing={isFetching}
  onRefresh={refetch}
/>
```

### Don't nest FlatList inside ScrollView

Nesting a scrolling container inside another scrolling container breaks windowing and causes gesture conflicts. Keep headers/filters fixed outside the list, and let only the FlatList scroll:

```tsx
// ✅ Header fixed, only FlatList scrolls
<Screen>  {/* plain View, not ScrollView */}
  <View>{/* fixed header */}</View>
  <View>{/* fixed filters */}</View>
  <FlatList data={...} />
</Screen>

// ❌ Nested scroll containers
<ScrollView>
  <Header />
  <FlatList data={...} />  {/* breaks virtualization */}
</ScrollView>
```

---

## 8. Error Boundaries — Every Screen Must Have One

**Every screen must be wrapped in an `ErrorBoundary`** so runtime render errors don't cause blank screens. React Navigation swallows uncaught errors inside its internal view hierarchy, so without per-screen boundaries, a component crash results in an empty white screen with no feedback.

### `ErrorBoundary` component (`shared/ui/ErrorBoundary.tsx`)

- Shows the error **name** and **message** so developers can debug without log access
- Displays the **screen name** so you know which screen crashed
- Has a **Show/Hide details** toggle that reveals the full stack trace (selectable for copy/paste)
- Has a **Try Again** button that resets the boundary and remounts children
- Logs to `console.error` as well

### Pattern: `wrapScreen` helper

Both the root stack navigator and the tab navigator use a `wrapScreen` helper to wrap every screen component in an error boundary:

```tsx
// RootNavigator.tsx — wraps stack screens
import { ErrorBoundary } from '@shared/ui/ErrorBoundary';

function makeScreen<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  name: string,
) {
  return function WrappedScreen(props: T) {
    return (
      <ErrorBoundary screenName={name}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

<Stack.Screen name="BookDetail" component={makeScreen(BookDetailScreen, "BookDetail")} />
```

```tsx
// TabNavigator.tsx — wraps tab screens (same pattern, different helper name)
function wrapScreen<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  name: string,
) {
  return function WrappedScreen(props: T) {
    return (
      <ErrorBoundary screenName={name}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

<Tab.Screen name="Library" component={wrapScreen(LibraryScreen, "Library")} />
```

### Why per-screen boundaries matter

- React Navigation's internal rendering layer can swallow errors thrown by screen components, producing a blank screen instead of the ErrorBoundary UI.
- Stack screens are wrapped via `makeScreen` in `RootNavigator.tsx`. Tab screens are wrapped via `wrapScreen` in `TabNavigator.tsx`.
- When adding a **new screen**, always use the appropriate wrapper. When adding a **new tab**, use `wrapScreen` in `TabNavigator.tsx`.

### Safe data access with optional chaining

When accessing RTK Query response data, always chain `?.` through every nullable level. RTK Query's `data` is `undefined` until the first fetch completes, and can briefly be `undefined` during cache invalidation/refetch cycles:

```tsx
// ❌ WRONG — crashes if data or data.pagination is undefined
const totalBooks = data?.pagination.total ?? 0;

// ✅ CORRECT — chains ?. through every level
const totalBooks = data?.pagination?.total ?? 0;

// ❌ WRONG — crashes if libraryData?.data is undefined
const libraryItem = libraryData?.data.find((b) => b.id === bookId);

// ✅ CORRECT
const libraryItem = libraryData?.data?.find((b) => b.id === bookId);
```

This is especially important after mutations that invalidate cache tags — the library data can temporarily be `undefined` while RTK Query refetches in the background.

---

## 9. Quick Reference: When to use...

| Pattern | Use when | Don't use when |
|---------|---------|---------------|
| `useState` | Single-screen form, toggle flags, counters | Server data caching |
| `useEffect` | Sync with external systems (APIs, subscriptions) | Transforming data, syncing props→state, handling clicks |
| Conditional inner component inside `Modal` | Reset local state when a modal opens without `useEffect` | When the Modal itself can unmount (no animation needed) |
| `key` prop | Reset component state when data identity changes | Force re-render for arbitrary reasons |
| `useMemo` | Expensive calculations derived from state/props | Premature optimization of cheap operations |
| `useCallback` | Passing callbacks to optimized child components | Every callback "just in case" |
| FlatList | Rendering arrays of scrollable items | Static content (use ScrollView) |
| RTK Query | Server state, caching, invalidation | Local UI-only state |
| Redux slice | Cross-screen state, auth, complex feature logic | Form drafts, temporary flags |
| ErrorBoundary | Every screen component (via `makeScreen`/`wrapScreen`) | Event handler errors (use try/catch instead) |

---

## 10. Checklist for Page Components

Before submitting a PR for a new page/screen:

- [ ] Data fetching and presentation are in separate components (Screen + Form/Widget)
- [ ] Screen shows loading state until ALL required data is ready
- [ ] Screen shows error state when data fails to load
- [ ] Every screen is wrapped in an `ErrorBoundary` (stack screens via `makeScreen`, tab screens via `wrapScreen`)
- [ ] No `useEffect` used to sync props into `useState` (use `key` instead)
- [ ] Form/component receives data as primitive props (not raw API responses)
- [ ] Form/component calls `onXxx` callbacks instead of direct navigation
- [ ] Mutations use `await .unwrap()` with `try/catch`
- [ ] UI is disabled while mutations are in flight
- [ ] Lists use `FlatList` (not `ScrollView` with `.map()`), with `keyExtractor` provided
- [ ] `FlatList` is not nested inside another scrolling container (`ScrollView` or another `FlatList`)
- [ ] RTK Query data accessed with `?.` at every nullable level (e.g., `data?.pagination?.total`, not `data?.pagination.total`)

---

## Related Guides

- [Feature-Sided Design (FSD) Guide](./FSD_GUIDE.md) — Directory structure and import rules
- [Redux & RTK Query Guide](./REDUX_GUIDE.md) — Server state management patterns
