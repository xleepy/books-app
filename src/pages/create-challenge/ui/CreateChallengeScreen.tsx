import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Calendar, Award, Flame, BookOpen, ChevronUp, ChevronDown } from 'lucide-react-native';
import { usePostChallengesMutation } from '@shared/api/challengesApi.generated';
import { colors, fontFamily } from '@shared/theme';
import { RootStackParamList } from '@app/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const templates = [
  { key: 'monthly', label: 'Monthly Sprint', variant: 'monthly', metric: 'books', target: 5, days: 30 },
  { key: 'yearly', label: 'Yearly Goal', variant: 'yearly', metric: 'books', target: 24, days: 365 },
  { key: 'weekly', label: 'Weekly Blitz', variant: 'weekly', metric: 'books', target: 2, days: 7 },
  { key: 'streak', label: 'Streak Keeper', variant: 'custom', metric: 'streak', target: 7, days: 30 },
  { key: 'pages', label: 'Pages Marathon', variant: 'custom', metric: 'pages', target: 1000, days: 30 },
  { key: 'custom', label: 'Custom', variant: 'custom', metric: 'books', target: 5, days: 30 },
];

const metrics = ['books', 'pages', 'hours', 'streak'] as const;

const templateColors: Record<string, { bg: string; icon: string }> = {
  monthly: { bg: colors.challengeBlueLight, icon: colors.challengeBlue },
  yearly: { bg: colors.badgeGoldLight, icon: colors.badgeGold },
  weekly: { bg: colors.streakOrangeLight, icon: colors.streakOrange },
  streak: { bg: colors.streakOrangeLight, icon: colors.streakOrange },
  pages: { bg: colors.xpPurpleLight, icon: colors.xpPurple },
  custom: { bg: colors.bgSecondary, icon: colors.fontSecondary },
};

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function parseISODate(s: string): Date | null {
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

function startOfDayUTC(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export function CreateChallengeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [postChallenge, { isLoading }] = usePostChallengesMutation();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedTemplate, setSelectedTemplate] = useState<string>('monthly');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metric, setMetric] = useState<string>('books');
  const [target, setTarget] = useState<number>(5);
  const [activeFrom, setActiveFrom] = useState<string>(formatDate(today));
  const [activeTo, setActiveTo] = useState<string>(formatDate(addDays(today, 30)));
  const [error, setError] = useState<string | null>(null);

  const [pickerMode, setPickerMode] = useState<'from' | 'to' | null>(null);

  function applyTemplate(key: string) {
    setSelectedTemplate(key);
    const tpl = templates.find((t) => t.key === key);
    if (!tpl) return;
    setMetric(tpl.metric);
    setTarget(tpl.target);
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    setActiveFrom(formatDate(from));
    setActiveTo(formatDate(addDays(from, tpl.days)));
    setError(null);
  }

  function adjustTarget(delta: number) {
    setTarget((prev) => Math.max(1, Math.min(9999, prev + delta)));
  }

  function validateDates(from: string, to: string): string | null {
    const fromDate = parseISODate(from);
    const toDate = parseISODate(to);
    if (!fromDate) return 'Start date must be in YYYY-MM-DD format';
    if (!toDate) return 'End date must be in YYYY-MM-DD format';

    const fromUTC = startOfDayUTC(fromDate);
    const toUTC = startOfDayUTC(toDate);
    const now = startOfDayUTC(new Date());

    if (fromUTC < now) return 'Start date must be today or later';
    if (toUTC <= fromUTC) return 'End date must be after start date';
    return null;
  }

  function handleDateChange(mode: 'from' | 'to', event: any, date?: Date) {
    if (Platform.OS === 'android') {
      setPickerMode(null);
    }
    if (!date) return;

    const iso = formatDate(date);
    if (mode === 'from') {
      setActiveFrom(iso);
      const err = validateDates(iso, activeTo);
      setError(err);
    } else {
      setActiveTo(iso);
      const err = validateDates(activeFrom, iso);
      setError(err);
    }
  }

  const canSubmit =
    title.trim().length > 0 &&
    target >= 1 &&
    activeFrom <= activeTo &&
    !isLoading;

  async function handleCreate() {
    if (!canSubmit) return;
    const validationError = validateDates(activeFrom, activeTo);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    try {
      const template = templates.find((t) => t.key === selectedTemplate);
      await postChallenge({
        title: title.trim(),
        description: description.trim() || undefined,
        variant: (template?.variant ?? 'custom') as 'monthly' | 'yearly' | 'weekly' | 'custom',
        metric: metric as 'books' | 'pages' | 'hours' | 'streak',
        target,
        activeFrom,
        activeTo,
      }).unwrap();
      Alert.alert('Challenge Created', `${title.trim()} has been created successfully.`);
      navigation.goBack();
    } catch (err: any) {
      const message = err?.data?.message || err?.error || 'Failed to create challenge. Please try again.';
      setError(message);
    }
  }

  const MetricIcon = ({ name, size = 16, color }: { name: string; size?: number; color: string }) => {
    switch (name) {
      case 'books': return <BookOpen size={size} color={color} />;
      case 'pages': return <BookOpen size={size} color={color} />;
      case 'hours': return <Calendar size={size} color={color} />;
      case 'streak': return <Flame size={size} color={color} />;
      default: return <BookOpen size={size} color={color} />;
    }
  };

  const fromDate = parseISODate(activeFrom) || today;
  const toDate = parseISODate(activeTo) || addDays(today, 1);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X size={22} color={colors.fontPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Create Challenge</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Templates */}
        <View style={styles.field}>
          <Text style={styles.label}>Choose a Template</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tplRow}>
            {templates.map((tpl) => {
              const colorset = templateColors[tpl.key] ?? templateColors.custom;
              const active = selectedTemplate === tpl.key;
              return (
                <Pressable
                  key={tpl.key}
                  style={[
                    styles.tplCard,
                    { backgroundColor: colorset.bg },
                    active && styles.tplCardActive,
                  ]}
                  onPress={() => applyTemplate(tpl.key)}
                >
                  <MetricIcon name={tpl.metric} size={28} color={colorset.icon} />
                  <Text style={[styles.tplLabel, { color: colorset.icon }]}>{tpl.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Challenge Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. April Reading Sprint"
            placeholderTextColor={colors.fontTertiary}
            style={styles.input}
            maxLength={80}
            returnKeyType="next"
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What's the challenge about?"
            placeholderTextColor={colors.fontTertiary}
            style={[styles.input, styles.textArea]}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
        </View>

        {/* Metric */}
        <View style={styles.field}>
          <Text style={styles.label}>Goal Metric</Text>
          <View style={styles.pillRow}>
            {metrics.map((m) => (
              <Pressable
                key={m}
                style={[styles.pill, metric === m && styles.pillActive]}
                onPress={() => setMetric(m)}
              >
                <Text style={[styles.pillText, metric === m && styles.pillTextActive]}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Target */}
        <View style={styles.field}>
          <Text style={styles.label}>Target</Text>
          <View style={styles.targetRow}>
            <TextInput
              value={String(target)}
              onChangeText={(text) => {
                const num = parseInt(text, 10);
                if (!isNaN(num)) setTarget(Math.max(1, Math.min(9999, num)));
                else if (text === '') setTarget(1);
              }}
              keyboardType="number-pad"
              style={styles.targetInput}
            />
            <View style={styles.stepper}>
              <Pressable onPress={() => adjustTarget(1)} style={styles.stepperBtn}>
                <ChevronUp size={16} color={colors.fontSecondary} />
              </Pressable>
              <Pressable onPress={() => adjustTarget(-1)} style={styles.stepperBtn}>
                <ChevronDown size={16} color={colors.fontSecondary} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.field}>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.dateRow}>
            <Pressable style={styles.dateBox} onPress={() => setPickerMode('from')}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateValue}>{activeFrom}</Text>
            </Pressable>
            <Pressable style={styles.dateBox} onPress={() => setPickerMode('to')}>
              <Text style={styles.dateLabel}>End Date</Text>
              <Text style={styles.dateValue}>{activeTo}</Text>
            </Pressable>
          </View>

          {pickerMode === 'from' && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              minimumDate={today}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => handleDateChange('from', event, date)}
            />
          )}
          {pickerMode === 'to' && (
            <DateTimePicker
              value={toDate}
              mode="date"
              minimumDate={addDays(fromDate, 1)}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => handleDateChange('to', event, date)}
            />
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable
          style={[styles.createBtn, !canSubmit && styles.createBtnDisabled]}
          onPress={handleCreate}
          disabled={!canSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.fontInverse} />
          ) : (
            <Text style={styles.createBtnText}>Create Challenge</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerSpacer: {
    width: 30,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  errorBanner: {
    backgroundColor: '#FDECEA',
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: '#C62828',
  },
  field: {
    gap: 8,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  input: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.fontPrimary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },
  tplRow: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 20,
  },
  tplCard: {
    width: 100,
    height: 120,
    borderRadius: 16,
    padding: 12,
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tplCardActive: {
    borderColor: colors.accent,
  },
  tplLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    textAlign: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.bgSecondary,
  },
  pillActive: {
    backgroundColor: colors.accent,
  },
  pillText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.fontSecondary,
  },
  pillTextActive: {
    color: colors.fontInverse,
    fontFamily: fontFamily.semibold,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetInput: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.fontPrimary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    width: 80,
  },
  stepper: {
    gap: 4,
  },
  stepperBtn: {
    width: 32,
    height: 22,
    backgroundColor: colors.bgSecondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateBox: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dateLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: colors.fontSecondary,
  },
  dateValue: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  actionBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  createBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBtnDisabled: {
    opacity: 0.4,
  },
  createBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.fontInverse,
  },
});
