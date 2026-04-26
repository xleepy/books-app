export type RootStackParamList = {
  Tabs: undefined;
  BookDetail: {
    bookId: string;
    libraryStatus?: "want" | "reading" | "finished";
  };
  LibraryList: { initialStatus?: "want" | "reading" | "finished" };
  Progress: undefined;
  Settings: undefined;
  ThreadDetail: { threadId: string };
  CreateThread: undefined;
  EditThread: { threadId: string; title: string; body: string };
  ChallengeDetail: { challengeId: string };
  CreateChallenge: undefined;
  EditChallenge: { challengeId: string; title: string; description: string };
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
