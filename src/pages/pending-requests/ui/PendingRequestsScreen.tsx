import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import {
  useGetPendingRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useRemoveFriendMutation,
} from "@shared/api/friendsApi.generated";
import { IncomingRequestRow } from "@widgets/incoming-request-row/ui/IncomingRequestRow";
import { OutgoingRequestRow } from "@widgets/outgoing-request-row/ui/OutgoingRequestRow";
import { colors, fontFamily } from "@shared/theme";

export function PendingRequestsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useGetPendingRequestsQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const [rejectRequest] = useRejectFriendRequestMutation();
  const [cancelRequest] = useRemoveFriendMutation();

  const incoming = data?.data?.incoming ?? [];
  const outgoing = data?.data?.outgoing ?? [];

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId).unwrap();
    } catch {
      // Error handled by RTK Query
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest(requestId).unwrap();
    } catch {
      // Error handled by RTK Query
    }
  };

  const handleCancel = async (requestId: string) => {
    try {
      await cancelRequest(requestId).unwrap();
    } catch {
      // Error handled by RTK Query
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <Pressable
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft size={22} color={colors.fontPrimary} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>
          <Text style={styles.headerTitle}>Pending</Text>
          <View style={[styles.headerSide, styles.headerSideRight]} />
        </View>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </View>
    );
  }

  const hasData = incoming.length > 0 || outgoing.length > 0;

  if (!hasData) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <Pressable
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft size={22} color={colors.fontPrimary} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>
          <Text style={styles.headerTitle}>Pending</Text>
          <View style={[styles.headerSide, styles.headerSideRight]} />
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No pending friend requests.
          </Text>
        </View>
      </View>
    );
  }

  const sections: { label: string; data: typeof incoming }[] = [];
  if (incoming.length > 0) sections.push({ label: "INCOMING", data: incoming });
  if (outgoing.length > 0)
    sections.push({ label: "OUTGOING", data: outgoing });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <Pressable
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={22} color={colors.fontPrimary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>
        <Text style={styles.headerTitle}>Pending</Text>
        <View style={[styles.headerSide, styles.headerSideRight]} />
      </View>

      <FlatList
        style={styles.list}
        data={sections}
        keyExtractor={(s) => s.label}
        renderItem={({ item: section }) => (
          <View>
            <Text style={styles.sectionLabel}>
              {section.label} ({section.data.length})
            </Text>
            <View style={styles.card}>
              {section.data.map((req, i) => (
                <View key={req.id}>
                  {section.label === "INCOMING" ? (
                    <IncomingRequestRow
                      request={req}
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  ) : (
                    <OutgoingRequestRow
                      request={req}
                      onCancel={handleCancel}
                    />
                  )}
                  {i < section.data.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerSide: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerSideRight: {
    alignItems: "flex-end",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  sectionLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.fontSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 72,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontSecondary,
    textAlign: "center",
  },
});
