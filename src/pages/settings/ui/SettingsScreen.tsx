import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  BellRing,
  Bookmark,
  Eye,
  Lock,
  Mail,
  Shield,
  Target,
  Trophy,
} from "lucide-react-native";
import { supabase } from "@shared/lib/supabase";
import { colors } from "@shared/theme";
import { RootState } from "@store/store";
import type { AppDispatch } from "@store/store";
import { RootStackParamList } from "@app/navigation/types";
import {
  meApi,
  useGetMePreferencesQuery,
  usePutMePreferencesMutation,
} from "@shared/api/meApi.generated";
import type { Preferences } from "@entities/user/model/types";
import { usePushToken } from "@features/push-notifications/model/usePushToken";
import {
  scheduleReadingReminder,
  cancelReadingReminder,
} from "@features/push-notifications/lib/schedule";
import { SettingsHeader } from "./components/SettingsHeader";
import { ProfileCard } from "./components/ProfileCard";
import { SectionLabel } from "./components/SectionLabel";
import { Divider } from "./components/Divider";
import { ChevronRow } from "./components/ChevronRow";
import { ToggleRow } from "./components/ToggleRow";
import { SignOutButton } from "./components/SignOutButton";
import { TimePickerModal } from "./components/TimePickerModal";
import { GenrePickerModal } from "./components/GenrePickerModal";

type Nav = NativeStackNavigationProp<RootStackParamList>;

function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("");

  const { data: prefs, isLoading: prefsLoading } = useGetMePreferencesQuery();
  const [putPreferences, { isLoading: isSaving }] =
    usePutMePreferencesMutation();
  const { clearToken } = usePushToken();
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [genrePickerVisible, setGenrePickerVisible] = useState(false);

  // Sync local reminders when server preferences load
  useEffect(() => {
    if (!prefs) return;
    scheduleReadingReminder(
      prefs.reminderTime ?? "21:00",
      prefs.reminderEnabled,
    ).catch(() => {});
  }, [prefs?.reminderEnabled, prefs?.reminderTime]);

  async function handleToggle<K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) {
    if (!prefs) return;
    const next = { ...prefs, [key]: value };

    // Optimistically patch the cached preferences so the Switch flips immediately
    const patchResult = dispatch(
      meApi.util.updateQueryData("getMePreferences", undefined, (draft) => {
        (draft as Record<string, unknown>)[key as string] = value;
      }),
    );

    try {
      await putPreferences(next).unwrap();

      // Sync local reminders when reminder settings change
      if (key === "reminderEnabled" || key === "reminderTime") {
        await scheduleReadingReminder(
          next.reminderTime ?? "21:00",
          next.reminderEnabled,
        );
      }

      // Unregister push token if user disables push globally
      if (key === "notifyPush" && value === false) {
        await clearToken();
      }
    } catch {
      patchResult.undo?.();
      Alert.alert("Error", "Failed to update preference. Please try again.");
    }
  }

  async function handleSetReminderTime(time: string) {
    if (!prefs) return;
    const next = { ...prefs, reminderTime: time, reminderEnabled: true };

    const patchResult = dispatch(
      meApi.util.updateQueryData("getMePreferences", undefined, (draft) => {
        draft.reminderTime = time;
        draft.reminderEnabled = true;
      }),
    );

    try {
      await putPreferences(next).unwrap();
      await scheduleReadingReminder(time, true);
    } catch {
      patchResult.undo?.();
      Alert.alert("Error", "Failed to update reminder. Please try again.");
    }
  }

  async function handleSetGenres(genres: string[]) {
    if (!prefs) return;
    const next = { ...prefs, preferredGenres: genres };

    const patchResult = dispatch(
      meApi.util.updateQueryData("getMePreferences", undefined, (draft) => {
        draft.preferredGenres = genres;
      }),
    );

    try {
      await putPreferences(next).unwrap();
    } catch {
      patchResult.undo?.();
      Alert.alert("Error", "Failed to update genres. Please try again.");
    }
  }

  async function handleSignOut() {
    await cancelReadingReminder();
    await clearToken();
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Error", error.message);
  }

  if (prefsLoading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <SettingsHeader
          initials={initials}
          avatarHue={user.avatarHue}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </View>
    );
  }

  const reminderSubtitle =
    prefs?.reminderEnabled && prefs?.reminderTime
      ? `${prefs.reminderTime} daily`
      : "Off";

  const genresSubtitle = prefs?.preferredGenres?.length
    ? prefs.preferredGenres.join(", ")
    : "None selected";

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <SettingsHeader
        initials={initials}
        avatarHue={user.avatarHue}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard
          name={user.name}
          initials={initials}
          avatarHue={user.avatarHue}
          level={user.level}
          levelTitle={user.levelTitle}
        />

        {/* Reading */}
        <SectionLabel text="READING" />
        <View style={styles.card}>
          <ChevronRow
            icon={<Target size={16} color={colors.accent} />}
            iconBg={colors.accentLight}
            title="Daily Reading Goal"
            subtitle={`${prefs?.readingGoalMinutes ?? 30} minutes`}
            value={`${prefs?.readingGoalMinutes ?? 30} min`}
          />
          <Divider />
          <Pressable onPress={() => setTimePickerVisible(true)}>
            <ChevronRow
              icon={<Bell size={16} color={colors.streakOrange} />}
              iconBg={colors.streakOrangeLight}
              title="Reading Reminders"
              subtitle={reminderSubtitle}
              value={
                prefs?.reminderEnabled ? (prefs.reminderTime ?? "On") : "Off"
              }
            />
          </Pressable>
          <Divider />
          <Pressable onPress={() => setGenrePickerVisible(true)}>
            <ChevronRow
              icon={<Bookmark size={16} color={colors.challengeBlue} />}
              iconBg={colors.challengeBlueLight}
              title="Preferred Genres"
              subtitle={genresSubtitle}
            />
          </Pressable>
        </View>

        {/* Notifications */}
        <SectionLabel text="NOTIFICATIONS" />
        <View style={styles.card}>
          <ToggleRow
            icon={<BellRing size={16} color={colors.xpPurple} />}
            iconBg={colors.xpPurpleLight}
            title="Push Notifications"
            subtitle="Streaks, badges & challenges"
            value={prefs?.notifyPush ?? true}
            onToggle={(v) => handleToggle("notifyPush", v)}
            disabled={isSaving}
          />
          <Divider />
          <ToggleRow
            icon={<Mail size={16} color={colors.badgeGold} />}
            iconBg={colors.badgeGoldLight}
            title="Weekly Digest Email"
            subtitle="Reading summary every Sunday"
            value={prefs?.notifyWeeklyDigest ?? true}
            onToggle={(v) => handleToggle("notifyWeeklyDigest", v)}
            disabled={isSaving}
          />
          <Divider />
          <ToggleRow
            icon={<Trophy size={16} color={colors.challengeBlue} />}
            iconBg={colors.challengeBlueLight}
            title="Challenge Updates"
            subtitle="Progress & leaderboard changes"
            value={prefs?.notifyChallenge ?? true}
            onToggle={(v) => handleToggle("notifyChallenge", v)}
            disabled={isSaving}
          />
        </View>

        {/* Privacy & Account */}
        <SectionLabel text="PRIVACY & ACCOUNT" />
        <View style={styles.card}>
          <ChevronRow
            icon={<Eye size={16} color={colors.fontPrimary} />}
            iconBg={colors.bgSecondary}
            title="Profile Visibility"
            subtitle={capitalizeFirst(prefs?.profileVisibility ?? "public")}
            value={capitalizeFirst(prefs?.profileVisibility ?? "public")}
          />
          <Divider />
          <ChevronRow
            icon={<Shield size={16} color={colors.fontPrimary} />}
            iconBg={colors.bgSecondary}
            title="Data & Privacy"
            subtitle="Manage your data"
          />
          <Divider />
          <ChevronRow
            icon={<Lock size={16} color={colors.fontPrimary} />}
            iconBg={colors.bgSecondary}
            title="Change Password"
            subtitle="Last changed 3 months ago"
          />
        </View>

        <SignOutButton onPress={handleSignOut} />
      </ScrollView>

      <TimePickerModal
        visible={timePickerVisible}
        initialTime={prefs?.reminderTime ?? "21:00"}
        onSelect={handleSetReminderTime}
        onClose={() => setTimePickerVisible(false)}
      />

      <GenrePickerModal
        visible={genrePickerVisible}
        selectedGenres={prefs?.preferredGenres ?? []}
        onSave={handleSetGenres}
        onClose={() => setGenrePickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 8,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: "hidden",
  },
});
