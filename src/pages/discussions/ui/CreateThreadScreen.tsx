import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BookOpen, Search, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCreateThreadMutation } from "@shared/api/discussionsApi.generated";
import { useGetBooksQuery, Book } from "@shared/api/booksApi.generated";
import { BookCover } from "@entities/book/ui/BookCover";
import { colors, fontFamily } from "@shared/theme";
import { RootStackParamList } from "@app/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function CreateThreadScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [postThread, { isLoading }] = useCreateThreadMutation();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Book picker state ────────────────────────────────────────────────────
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bookSearch, setBookSearch] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQ(bookSearch), 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [bookSearch]);

  const { data: booksData, isFetching: booksLoading } = useGetBooksQuery(
    { q: debouncedQ, limit: 6 },
    { skip: debouncedQ.trim().length < 2 },
  );
  const bookResults = booksData?.data ?? [];

  function handleSelectBook(book: Book) {
    setSelectedBook(book);
    setPickerOpen(false);
    setBookSearch("");
    setDebouncedQ("");
  }

  function handleClearBook() {
    setSelectedBook(null);
    setPickerOpen(false);
    setBookSearch("");
    setDebouncedQ("");
  }

  // ─── Submit ───────────────────────────────────────────────────────────────
  const canSubmit =
    title.trim().length > 0 && body.trim().length > 0 && !isLoading;

  async function handleCreate() {
    if (!canSubmit) return;
    setError(null);
    try {
      await postThread({
        title: title.trim(),
        body: body.trim(),
        spoiler,
        bookId: selectedBook?.id ?? null,
      }).unwrap();
      navigation.goBack();
    } catch {
      setError("Failed to create thread. Please try again.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top + 56}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X size={22} color={colors.fontPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>New Thread</Text>
        <Pressable
          style={[styles.postBtn, !canSubmit && styles.postBtnDisabled]}
          onPress={handleCreate}
          disabled={!canSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.fontInverse} />
          ) : (
            <Text style={styles.postBtnText}>Post</Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="What's your thread about?"
            placeholderTextColor={colors.fontTertiary}
            style={styles.titleInput}
            maxLength={200}
            returnKeyType="next"
          />
          <Text style={styles.counter}>{title.length}/200</Text>
        </View>

        {/* Body */}
        <View style={styles.field}>
          <Text style={styles.label}>Body</Text>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Share your thoughts, questions, or discoveries..."
            placeholderTextColor={colors.fontTertiary}
            style={styles.bodyInput}
            multiline
            maxLength={10000}
            textAlignVertical="top"
          />
          <Text style={styles.counter}>{body.length}/10000</Text>
        </View>

        {/* Book picker */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Link a Book <Text style={styles.optional}>(optional)</Text>
          </Text>

          {/* Selected book card */}
          {selectedBook && !pickerOpen && (
            <View style={styles.selectedCard}>
              <BookCover
                coverUrl={selectedBook.coverUrl}
                width={44}
                height={60}
                radius={6}
                shadow={false}
              />
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedTitle} numberOfLines={2}>
                  {selectedBook.title}
                </Text>
                <Text style={styles.selectedAuthor} numberOfLines={1}>
                  {selectedBook.author}
                </Text>
              </View>
              <Pressable
                style={styles.clearBookBtn}
                onPress={handleClearBook}
                accessibilityLabel="Remove book"
              >
                <X size={16} color={colors.fontSecondary} />
              </Pressable>
            </View>
          )}

          {/* Open / close picker toggle */}
          {!pickerOpen && (
            <Pressable
              style={styles.addBookRow}
              onPress={() => setPickerOpen(true)}
            >
              <BookOpen size={16} color={colors.accent} />
              <Text style={styles.addBookText}>
                {selectedBook ? "Change book" : "Search for a book"}
              </Text>
            </Pressable>
          )}

          {/* Search input + results */}
          {pickerOpen && (
            <View style={styles.pickerWrap}>
              {/* Search bar */}
              <View style={styles.searchBar}>
                <Search size={16} color={colors.fontTertiary} />
                <TextInput
                  autoFocus
                  value={bookSearch}
                  onChangeText={setBookSearch}
                  placeholder="Search by title or author…"
                  placeholderTextColor={colors.fontTertiary}
                  style={styles.searchInput}
                  returnKeyType="search"
                  clearButtonMode="while-editing"
                />
                <Pressable onPress={() => setPickerOpen(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </View>

              {/* Results / states */}
              {booksLoading && (
                <View style={styles.pickerCenter}>
                  <ActivityIndicator color={colors.accent} />
                </View>
              )}

              {!booksLoading && debouncedQ.trim().length < 2 && (
                <View style={styles.pickerCenter}>
                  <Text style={styles.hintText}>
                    Type at least 2 characters to search
                  </Text>
                </View>
              )}

              {!booksLoading &&
                debouncedQ.trim().length >= 2 &&
                bookResults.length === 0 && (
                  <View style={styles.pickerCenter}>
                    <Text style={styles.hintText}>
                      No books found for &quot;{debouncedQ}&quot;
                    </Text>
                  </View>
                )}

              {!booksLoading && bookResults.length > 0 && (
                <View style={styles.resultsList}>
                  {bookResults.map((book) => (
                    <Pressable
                      key={book.id}
                      style={[
                        styles.resultRow,
                        selectedBook?.id === book.id &&
                          styles.resultRowSelected,
                      ]}
                      onPress={() => handleSelectBook(book)}
                    >
                      <BookCover
                        coverUrl={book.coverUrl}
                        width={36}
                        height={50}
                        radius={4}
                        shadow={false}
                      />
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultTitle} numberOfLines={2}>
                          {book.title}
                        </Text>
                        <Text style={styles.resultAuthor} numberOfLines={1}>
                          {book.author}
                        </Text>
                      </View>
                      {selectedBook?.id === book.id && (
                        <View style={styles.checkDot} />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Spoiler toggle */}
        <View style={styles.spoilerRow}>
          <View style={styles.spoilerInfo}>
            <Text style={styles.label}>Contains Spoilers</Text>
            <Text style={styles.spoilerHint}>
              Warn readers before they open your thread
            </Text>
          </View>
          <Switch
            value={spoiler}
            onValueChange={setSpoiler}
            trackColor={{ false: colors.bgSecondary, true: colors.accentLight }}
            thumbColor={spoiler ? colors.accent : colors.fontTertiary}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.fontPrimary,
  },
  postBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: "center",
  },
  postBtnDisabled: {
    opacity: 0.4,
  },
  postBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.fontInverse,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  errorBanner: {
    backgroundColor: "#FDECEA",
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: "#C62828",
  },
  field: {
    gap: 8,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  optional: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.fontTertiary,
  },
  titleInput: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.fontPrimary,
  },
  bodyInput: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontPrimary,
    minHeight: 160,
  },
  counter: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.fontTertiary,
    textAlign: "right",
  },
  // ─── Selected book ──────────────────────────────────────────────────────────
  selectedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  selectedInfo: {
    flex: 1,
    gap: 3,
  },
  selectedTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  selectedAuthor: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  clearBookBtn: {
    padding: 4,
  },
  // ─── Add book row ───────────────────────────────────────────────────────────
  addBookRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  addBookText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.accent,
  },
  // ─── Picker ─────────────────────────────────────────────────────────────────
  pickerWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.bgCard,
    overflow: "hidden",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontPrimary,
    paddingVertical: 0,
  },
  cancelText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.accent,
  },
  pickerCenter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  hintText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.fontTertiary,
  },
  resultsList: {
    gap: 0,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  resultRowSelected: {
    backgroundColor: colors.accentLight,
  },
  resultInfo: {
    flex: 1,
    gap: 2,
  },
  resultTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.fontPrimary,
  },
  resultAuthor: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  checkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  // ─── Spoiler ─────────────────────────────────────────────────────────────────
  spoilerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  spoilerInfo: {
    gap: 2,
  },
  spoilerHint: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
});
