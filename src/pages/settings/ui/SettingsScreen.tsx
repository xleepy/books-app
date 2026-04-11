import { ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bookmark,
  Bell,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Shield,
  Target,
  Trophy,
} from 'lucide-react-native';
import { colors, fontFamily } from '@shared/theme';
import { Avatar } from '@shared/ui';
import { RootStackParamList } from '@app/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [challengeEnabled, setChallengeEnabled] = useState(true);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={22} color={colors.fontPrimary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={[styles.headerSide, styles.headerSideRight]}>
          <Avatar initials="JD" size={36} hue={280} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Avatar initials="JD" size={84} hue={280} />
          <Text style={styles.profileName}>Jane Doe</Text>
          <View style={styles.levelRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNum}>12</Text>
            </View>
            <Text style={styles.levelLabel}>Level 12 · Bookworm</Text>
          </View>
          <Pressable style={styles.editBtn}>
            <Pencil size={14} color={colors.accent} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Reading */}
        <SectionLabel text="READING" />
        <View style={styles.card}>
          <ChevronRow
            icon={<Target size={16} color={colors.accent} />}
            iconBg={colors.accentLight}
            title="Daily Reading Goal"
            subtitle="30 minutes"
            value="30 min"
          />
          <Divider />
          <ChevronRow
            icon={<Bell size={16} color={colors.streakOrange} />}
            iconBg={colors.streakOrangeLight}
            title="Reading Reminders"
            subtitle="9:00 PM daily"
            value="9:00 PM"
          />
          <Divider />
          <ChevronRow
            icon={<Bookmark size={16} color={colors.challengeBlue} />}
            iconBg={colors.challengeBlueLight}
            title="Preferred Genres"
            subtitle="Fiction, Philosophy"
          />
        </View>

        {/* Notifications */}
        <SectionLabel text="NOTIFICATIONS" />
        <View style={styles.card}>
          <ToggleRow
            icon={<BellRing size={16} color={colors.xpPurple} />}
            iconBg={colors.xpPurpleLight}
            title="Push Notifications"
            subtitle="Streaks, badges & challenges"
            value={pushEnabled}
            onToggle={setPushEnabled}
          />
          <Divider />
          <ToggleRow
            icon={<Mail size={16} color={colors.badgeGold} />}
            iconBg={colors.badgeGoldLight}
            title="Weekly Digest Email"
            subtitle="Reading summary every Sunday"
            value={emailEnabled}
            onToggle={setEmailEnabled}
          />
          <Divider />
          <ToggleRow
            icon={<Trophy size={16} color={colors.challengeBlue} />}
            iconBg={colors.challengeBlueLight}
            title="Challenge Updates"
            subtitle="Progress & leaderboard changes"
            value={challengeEnabled}
            onToggle={setChallengeEnabled}
          />
        </View>

        {/* Privacy & Account */}
        <SectionLabel text="PRIVACY & ACCOUNT" />
        <View style={styles.card}>
          <ChevronRow
            icon={<Eye size={16} color={colors.fontPrimary} />}
            iconBg={colors.bgSecondary}
            title="Profile Visibility"
            subtitle="Public"
            value="Public"
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

        {/* Sign Out */}
        <Pressable style={styles.signOutBtn}>
          <LogOut size={18} color={colors.accentRed} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function SectionLabel({ text }: { text: string }) {
  return <Text style={styles.sectionLabel}>{text}</Text>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function IconBox({ icon, bg }: { icon: ReactNode; bg: string }) {
  return <View style={[styles.iconBox, { backgroundColor: bg }]}>{icon}</View>;
}

function ChevronRow({
  icon,
  iconBg,
  title,
  subtitle,
  value,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  value?: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <IconBox icon={icon} bg={iconBg} />
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <ChevronRight size={16} color={colors.fontTertiary} />
      </View>
    </View>
  );
}

function ToggleRow({
  icon,
  iconBg,
  title,
  subtitle,
  value,
  onToggle,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <IconBox icon={icon} bg={iconBg} />
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.accentGreen }}
        thumbColor={colors.fontInverse}
      />
    </View>
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
    height: 56,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerSide: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.fontPrimary,
  },
  headerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 8,
  },
  profileCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  profileName: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.fontPrimary,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.xpPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNum: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: colors.fontInverse,
  },
  levelLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.fontSecondary,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgSecondary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  editBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.accent,
  },
  sectionLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.fontSecondary,
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 0,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    gap: 2,
    flex: 1,
  },
  rowTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.fontPrimary,
  },
  rowSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.fontTertiary,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  signOutText: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.accentRed,
  },
});
