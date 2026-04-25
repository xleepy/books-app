import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  registerForPushNotificationsAsync,
  getPlatform,
} from "../lib/token";
import { RootState } from "@store/store";
import { meApi } from "@shared/api/meApi.generated";
import * as SecureStore from "expo-secure-store";

const STORED_TOKEN_KEY = "push_token";

export function usePushToken() {
  const session = useSelector((state: RootState) => state.auth.session);
  const [registerToken] = meApi.usePostMePushTokenMutation();
  const [unregisterToken] = meApi.useDeleteMePushTokenMutation();
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (!session) return;

    async function syncToken() {
      const token = await registerForPushNotificationsAsync();
      if (!token) return;

      const stored = await SecureStore.getItemAsync(STORED_TOKEN_KEY);
      if (stored === token && hasRegistered.current) return;

      try {
        await registerToken({ token, platform: getPlatform() }).unwrap();
        await SecureStore.setItemAsync(STORED_TOKEN_KEY, token);
        hasRegistered.current = true;
      } catch {
        // Registration failed — will retry on next app launch
      }
    }

    syncToken();
  }, [session, registerToken]);

  async function clearToken() {
    const stored = await SecureStore.getItemAsync(STORED_TOKEN_KEY);
    if (stored) {
      try {
        await unregisterToken({ token: stored }).unwrap();
      } catch {
        // Best-effort cleanup
      }
      await SecureStore.deleteItemAsync(STORED_TOKEN_KEY);
    }
    hasRegistered.current = false;
  }

  return { clearToken };
}
