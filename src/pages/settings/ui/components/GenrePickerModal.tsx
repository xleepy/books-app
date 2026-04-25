import { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Search, X } from "lucide-react-native";
import { DismissibleOverlay, useDismissibleOverlay } from "@shared/ui";
import { colors, fontFamily } from "@shared/theme";
import { useGetSubjectsQuery } from "@shared/api/booksApi.generated";

interface GenrePickerModalProps {
  visible: boolean;
  selectedGenres: string[];
  onSave: (genres: string[]) => void;
  onClose: () => void;
}

export function GenrePickerModal({
  visible,
  selectedGenres,
  onSave,
  onClose,
}: GenrePickerModalProps) {
  const overlay = useDismissibleOverlay();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onShow={() => overlay.ignore()}
    >
      <DismissibleOverlay controller={overlay} onPress={onClose}>
        {visible && (
          <GenrePickerBody
            initialSelected={selectedGenres}
            onSave={onSave}
            onClose={onClose}
          />
        )}
      </DismissibleOverlay>
    </Modal>
  );
}

interface GenrePickerBodyProps {
  initialSelected: string[];
  onSave: (genres: string[]) => void;
  onClose: () => void;
}

function GenrePickerBody({
  initialSelected,
  onSave,
  onClose,
}: GenrePickerBodyProps) {
  const [localSelected, setLocalSelected] = useState<Set<string>>(
    new Set(initialSelected),
  );
  const [query, setQuery] = useState("");
  const { data: subjectsData, isLoading, error } = useGetSubjectsQuery();

  const genres = subjectsData?.data ?? [];

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return genres.filter(
      (g) => g.name.toLowerCase().includes(q) && !localSelected.has(g.name),
    );
  }, [query, genres, localSelected]);

  const addGenre = (name: string) => {
    setLocalSelected((prev) => new Set(prev).add(name));
    setQuery("");
  };

  const removeGenre = (name: string) => {
    setLocalSelected((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  };

  const handleSave = () => {
    onSave(Array.from(localSelected));
    onClose();
  };

  const selectedCount = localSelected.size;

  return (
    <View style={styles.card} onStartShouldSetResponder={() => true}>
      <Text style={styles.title}>Preferred Genres</Text>
      <Text style={styles.subtitle}>
        {selectedCount === 0
          ? "Search and select genres you enjoy"
          : `${selectedCount} selected`}
      </Text>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} />
        </View>
      )}

      {error && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Failed to load genres. Please try again.
          </Text>
        </View>
      )}

      {!isLoading && !error && (
        <>
          {/* Search Input */}
          <View style={styles.searchWrap}>
            <Search size={16} color={colors.fontSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search genres..."
              placeholderTextColor={colors.fontSecondary}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")}>
                <X size={16} color={colors.fontSecondary} />
              </Pressable>
            )}
          </View>

          {/* Autocomplete Suggestions */}
          {query.trim().length > 0 && (
            <View style={styles.suggestionsWrap}>
              {suggestions.length === 0 ? (
                <View style={styles.suggestionRow}>
                  <Text style={styles.suggestionEmpty}>No genres found</Text>
                </View>
              ) : (
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {suggestions.map((subject) => (
                    <Pressable
                      key={subject.id}
                      onPress={() => addGenre(subject.name)}
                      style={styles.suggestionRow}
                    >
                      <Text
                        style={styles.suggestionText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {subject.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {/* Selected Pills */}
          {selectedCount > 0 && (
            <View style={styles.pillsSection}>
              <View style={styles.pillsWrap}>
                {Array.from(localSelected).map((name) => (
                  <View key={name} style={styles.pill}>
                    <Text style={styles.pillText} numberOfLines={1}>
                      {name}
                    </Text>
                    <Pressable onPress={() => removeGenre(name)} hitSlop={4}>
                      <X size={12} color={colors.accent} />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          )}
        </>
      )}

      <View style={styles.actions}>
        <Pressable style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 24,
    width: 320,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.fontSecondary,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.fontSecondary,
    textAlign: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.fontPrimary,
    padding: 0,
  },
  suggestionsWrap: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    marginBottom: 12,
    maxHeight: 200,
  },
  suggestionRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  suggestionText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  suggestionEmpty: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.fontSecondary,
    textAlign: "center",
  },
  pillsSection: {
    marginBottom: 8,
  },
  pillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: colors.accentLight,
    maxWidth: "100%",
  },
  pillText: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.accent,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.bgSecondary,
    alignItems: "center",
  },
  cancelBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.fontPrimary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: "center",
  },
  saveBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.fontInverse,
  },
});
