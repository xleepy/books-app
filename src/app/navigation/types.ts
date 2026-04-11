export type RootStackParamList = {
  Tabs: undefined;
  BookDetail: { bookId: string };
  Progress: undefined;
  Settings: undefined;
};

export type TabParamList = {
  Discover: undefined;
  Discussions: undefined;
  Library: undefined;
  Compete: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
