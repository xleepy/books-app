export type RootStackParamList = {
  Tabs: undefined;
  BookDetail: { bookId: string; libraryStatus?: 'want' | 'reading' | 'finished' };
  LibraryList: { initialStatus?: 'want' | 'reading' | 'finished' };
  Progress: undefined;
  Settings: undefined;
  ThreadDetail: { threadId: string };
  CreateThread: undefined;
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
