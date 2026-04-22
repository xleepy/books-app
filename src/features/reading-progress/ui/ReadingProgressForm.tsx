import { useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check, Flag } from 'lucide-react-native';
import { usePatchLibraryByBookIdMutation } from '@shared/api/libraryApi.generated';
import { ProgressBar } from '@shared/ui';
import { colors, fontFamily } from '@shared/theme';

interface ReadingProgressFormProps {
  bookId: string;
  title: string;
  coverUrl?: string | null;
  pageCount: number;
  initialPage: number;
  onUpdated: (status: 'reading' | 'finished') => void;
}

export function ReadingProgressForm({
  bookId,
  pageCount,
  initialPage,
  onUpdated,
}: ReadingProgressFormProps) {
  const [patchLibrary, { isLoading: isPatching }] = usePatchLibraryByBookIdMutation();

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isEditing, setIsEditing] = useState(false);
  const [draftPage, setDraftPage] = useState(String(initialPage));

  const progress = Math.min(1, Math.max(0, currentPage / pageCount));
  const pct = Math.round(progress * 100);

  function adjust(delta: number) {
    setCurrentPage((p: number) => {
      const next = Math.max(0, Math.min(pageCount, p + delta));
      setDraftPage(String(next));
      return next;
    });
  }

  function handleFinish() {
    setCurrentPage(pageCount);
    setDraftPage(String(pageCount));
  }

  function commitDraft() {
    const num = parseInt(draftPage.replace(/[^0-9]/g, ''), 10);
    if (!Number.isNaN(num)) {
      const clamped = Math.max(0, Math.min(pageCount, num));
      setCurrentPage(clamped);
      setDraftPage(String(clamped));
    } else {
      setDraftPage(String(currentPage));
    }
    setIsEditing(false);
    Keyboard.dismiss();
  }

  async function handleSubmit() {
    try {
      const isFinished = currentPage >= pageCount;
      const status: 'reading' | 'finished' = isFinished ? 'finished' : 'reading';
      await patchLibrary({
        bookId,
        body: {
          currentPage,
          progressPct: pct,
          status,
        },
      }).unwrap();
      onUpdated(status);
    } catch {
      Alert.alert('Error', 'Failed to update progress. Please try again.');
    }
  }

  return (
    <View style={styles.form}>
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <Text style={styles.progressPct}>{pct}%</Text>
        </View>

        <ProgressBar value={progress} height={8} />

        <View style={styles.pageInputWrap}>
          {isEditing ? (
            <TextInput
              style={styles.pageInputBig}
              value={draftPage}
              keyboardType="number-pad"
              autoFocus
              selectTextOnFocus
              onChangeText={setDraftPage}
              onSubmitEditing={commitDraft}
              onBlur={commitDraft}
              maxLength={String(pageCount).length}
            />
          ) : (
            <Pressable
              onPress={() => {
                setDraftPage(String(currentPage));
                setIsEditing(true);
              }}
            >
              <Text style={styles.pageNumBig}>{currentPage}</Text>
            </Pressable>
          )}
          <Text style={styles.pageOf}>of {pageCount} pages</Text>
        </View>

        <View style={styles.chipsRow}>
          <Pressable style={styles.chip} onPress={() => adjust(10)}>
            <Text style={styles.chipText}>+10</Text>
          </Pressable>
          <Pressable style={styles.chip} onPress={() => adjust(25)}>
            <Text style={styles.chipText}>+25</Text>
          </Pressable>
          <Pressable style={[styles.chip, styles.chipAccent]} onPress={handleFinish}>
            <Flag size={14} color={colors.accent} />
            <Text style={[styles.chipText, styles.chipTextAccent]}>Finished</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        style={[styles.updateBtn, isPatching && styles.updateBtnDisabled]}
        onPress={handleSubmit}
        disabled={isPatching}
      >
        {isPatching ? (
          <Text style={styles.updateBtnText}>Saving…</Text>
        ) : (
          <>
            <Check size={20} color={colors.fontInverse} />
            <Text style={styles.updateBtnText}>
              {currentPage >= pageCount ? 'Mark as Finished' : 'Update Progress'}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  progressCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    gap: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.fontPrimary,
  },
  progressPct: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.accent,
  },
  pageInputWrap: {
    alignItems: 'center',
    gap: 4,
  },
  pageNumBig: {
    fontFamily: fontFamily.bold,
    fontSize: 48,
    color: colors.fontPrimary,
    textAlign: 'center',
    minWidth: 100,
  },
  pageInputBig: {
    fontFamily: fontFamily.bold,
    fontSize: 48,
    color: colors.fontPrimary,
    textAlign: 'center',
    minWidth: 100,
    padding: 0,
  },
  pageOf: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.fontSecondary,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    height: 36,
  },
  chipAccent: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accentLight,
  },
  chipText: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.fontPrimary,
  },
  chipTextAccent: {
    color: colors.accent,
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
  },
  updateBtnDisabled: {
    opacity: 0.7,
  },
  updateBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.fontInverse,
  },
});
