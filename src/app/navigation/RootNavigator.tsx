import { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { BookDetailScreen } from "@pages/book-detail/ui/BookDetailScreen";
import { LibraryListScreen } from "@pages/library/ui/LibraryListScreen";
import { ProgressScreen } from "@pages/progress/ui/ProgressScreen";
import { SettingsScreen } from "@pages/settings/ui/SettingsScreen";
import { LoginScreen } from "@pages/auth/ui/LoginScreen";
import { TabNavigator } from "./TabNavigator";
import { RootStackParamList } from "./types";
import { supabase } from "@shared/lib/supabase";
import { setSession } from "@features/auth/model/authSlice";
import type { RootState, AppDispatch } from "@store/store";
import { colors } from "@shared/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const { session, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Restore existing session on mount
    supabase.auth.getSession().then(({ data }) => {
      dispatch(setSession(data.session));
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(setSession(session));
      }
    );

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
    return <LoginScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
      <Stack.Screen name="LibraryList" component={LibraryListScreen} />
      <Stack.Screen name="Progress" component={ProgressScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
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
