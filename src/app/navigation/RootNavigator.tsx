import { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { BookDetailScreen } from "@pages/book-detail/ui/BookDetailScreen";
import { LibraryListScreen } from "@pages/library/ui/LibraryListScreen";
import { ProgressScreen } from "@pages/progress/ui/ProgressScreen";
import { SettingsScreen } from "@pages/settings/ui/SettingsScreen";
import { LoginScreen } from "@pages/auth/ui/LoginScreen";
import { ThreadDetailScreen } from "@pages/discussions/ui/ThreadDetailScreen";
import { CreateThreadScreen } from "@pages/discussions/ui/CreateThreadScreen";
import { EditThreadScreen } from "@pages/discussions/ui/EditThreadScreen";
import { ChallengeDetailScreen } from "@pages/challenge-detail/ui/ChallengeDetailScreen";
import { CreateChallengeScreen } from "@pages/create-challenge/ui/CreateChallengeScreen";
import { EditChallengeScreen } from "@pages/create-challenge/ui/EditChallengeScreen";
import { TabNavigator } from "./TabNavigator";
import { RootStackParamList } from "./types";
import { supabase } from "@shared/lib/supabase";
import { setSession } from "@features/auth/model/authSlice";
import { useGetMeQuery } from "@shared/api/meApi.generated";
import { usePushToken } from "@features/push-notifications/model/usePushToken";
import { ErrorBoundary } from "@shared/ui/ErrorBoundary";
import type { RootState, AppDispatch } from "@store/store";
import { colors } from "@shared/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

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

export function RootNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const { session, isLoading } = useSelector((state: RootState) => state.auth);
  useGetMeQuery(undefined, { skip: !session });
  usePushToken();

  useEffect(() => {
    // Restore existing session on mount
    supabase.auth.getSession().then(({ data }) => {
      dispatch(setSession(data.session));
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!session) {
    return (
      <ErrorBoundary screenName="Login">
        <LoginScreen />
      </ErrorBoundary>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={makeScreen(TabNavigator, "Tabs")} />
      <Stack.Screen name="BookDetail" component={makeScreen(BookDetailScreen, "BookDetail")} />
      <Stack.Screen name="LibraryList" component={makeScreen(LibraryListScreen, "LibraryList")} />
      <Stack.Screen name="Progress" component={makeScreen(ProgressScreen, "Progress")} />
      <Stack.Screen name="Settings" component={makeScreen(SettingsScreen, "Settings")} />
      <Stack.Screen name="ThreadDetail" component={makeScreen(ThreadDetailScreen, "ThreadDetail")} />
      <Stack.Screen
        name="CreateThread"
        component={makeScreen(CreateThreadScreen, "CreateThread")}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="ChallengeDetail" component={makeScreen(ChallengeDetailScreen, "ChallengeDetail")} />
      <Stack.Screen
        name="CreateChallenge"
        component={makeScreen(CreateChallengeScreen, "CreateChallenge")}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="EditThread"
        component={makeScreen(EditThreadScreen, "EditThread")}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="EditChallenge"
        component={makeScreen(EditChallengeScreen, "EditChallenge")}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgPrimary,
  },
});
