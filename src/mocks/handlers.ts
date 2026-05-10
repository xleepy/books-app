import { http, HttpResponse } from "msw";
import { mockBooks } from "@entities/book/mock/books";
import { mockThreads } from "@entities/discussion/mock/discussions";
import {
  mockChallenges,
  mockLeaderboard,
} from "@entities/challenge/mock/challenges";
import { mockReviews } from "@entities/review/mock/reviews";

const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

/* Mutable in-memory library store so mutations are reflected in subsequent GETs */
type LibraryItem = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  tags: string[];
  description: string;
  rating: number;
  reviewCount: number;
  status: "want" | "reading" | "finished";
  progressPct: number;
  currentPage?: number | null;
  pageCount?: number | null;
  timeLeftMin?: number | null;
};

let libraryItems: LibraryItem[] = mockBooks.slice(0, 3).map((b, i) => ({
  ...b,
  status: i === 0 ? ("reading" as const) : ("want" as const),
  progressPct: i === 0 ? 68 : 0,
  timeLeftMin: i === 0 ? 240 : null,
}));

function computeLibraryStats() {
  return {
    finished: libraryItems.filter((b) => b.status === "finished").length,
    reading: libraryItems.filter((b) => b.status === "reading").length,
    saved: libraryItems.filter((b) => b.status === "want").length,
  };
}

let mockPreferences = {
  readingGoalMinutes: 30,
  reminderTime: "21:00" as string | null,
  reminderEnabled: false,
  preferredGenres: [] as string[],
  notifyPush: true,
  notifyWeeklyDigest: true,
  notifyChallenge: true,
  profileVisibility: "public",
};

// More-specific routes must be declared before /:id catch-alls
export const handlers = [
  // Health
  http.get(`${BASE}/healthz`, () => HttpResponse.json({ status: "ok" })),

  // Auth
  http.post(`${BASE}/auth/register`, () =>
    HttpResponse.json({ accessToken: "mock-token" }, { status: 201 }),
  ),
  http.post(`${BASE}/auth/login`, () =>
    HttpResponse.json({ accessToken: "mock-token" }),
  ),

  // Me
  http.get(`${BASE}/me`, () =>
    HttpResponse.json({
      id: "user-1",
      name: "Jane Doe",
      email: "jane@example.com",
      avatarHue: 280,
      level: 12,
      levelTitle: "Bookworm",
      xpTotal: 2450,
      booksFinished: 12,
      pagesRead: 4280,
      hoursRead: 86,
      streak: 14,
      bestStreak: 21,
      weekDays: [true, true, true, true, true, false, false],
      readingGoal: 30,
    }),
  ),

  http.patch(`${BASE}/me`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const updated: Record<string, unknown> = {
      id: "user-1",
      name: "Jane Doe",
      email: "jane@example.com",
      avatarHue: 280,
      level: 12,
      levelTitle: "Bookworm",
      xpTotal: 2450,
      booksFinished: 12,
      pagesRead: 4280,
      hoursRead: 86,
      streak: 14,
      bestStreak: 21,
      weekDays: [true, true, true, true, true, false, false],
      readingGoal: 30,
    };
    if (typeof body.readingGoal === "number") {
      updated.readingGoal = body.readingGoal;
    }
    if (typeof body.name === "string") {
      updated.name = body.name;
    }
    if (typeof body.avatarHue === "number") {
      updated.avatarHue = body.avatarHue;
    }
    return HttpResponse.json(updated);
  }),

  http.get(`${BASE}/me/preferences`, () => HttpResponse.json(mockPreferences)),

  http.put(`${BASE}/me/preferences`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    mockPreferences = {
      ...mockPreferences,
      ...(typeof body.readingGoalMinutes === "number" && {
        readingGoalMinutes: body.readingGoalMinutes,
      }),
      ...(typeof body.reminderTime === "string" && {
        reminderTime: body.reminderTime,
      }),
      ...(body.reminderTime === null && { reminderTime: null }),
      ...(typeof body.reminderEnabled === "boolean" && {
        reminderEnabled: body.reminderEnabled,
      }),
      ...(Array.isArray(body.preferredGenres) && {
        preferredGenres: body.preferredGenres as string[],
      }),
      ...(typeof body.notifyPush === "boolean" && {
        notifyPush: body.notifyPush,
      }),
      ...(typeof body.notifyWeeklyDigest === "boolean" && {
        notifyWeeklyDigest: body.notifyWeeklyDigest,
      }),
      ...(typeof body.notifyChallenge === "boolean" && {
        notifyChallenge: body.notifyChallenge,
      }),
      ...(typeof body.profileVisibility === "string" && {
        profileVisibility: body.profileVisibility,
      }),
    };
    return HttpResponse.json(mockPreferences);
  }),

  // Books — specific sub-routes first
  http.get(`${BASE}/books/feed`, () =>
    HttpResponse.json({ data: mockBooks, nextCursor: null }),
  ),
  http.get(`${BASE}/books`, () =>
    HttpResponse.json({
      data: mockBooks,
      pagination: { total: mockBooks.length, page: 1, limit: 20 },
    }),
  ),
  http.get(`${BASE}/books/:id/recommendations`, () =>
    HttpResponse.json({ data: mockBooks.slice(1) }),
  ),
  http.get(`${BASE}/books/:id/reviews`, () =>
    HttpResponse.json({
      data: mockReviews,
      pagination: { total: mockReviews.length, page: 1, limit: 20 },
    }),
  ),
  http.post(`${BASE}/books/:id/reviews`, () =>
    HttpResponse.json(mockReviews[0], { status: 201 }),
  ),
  http.get(`${BASE}/books/:id`, ({ params }) => {
    const book = mockBooks.find((b) => b.id === params.id);
    if (!book)
      return HttpResponse.json(
        { error: "NOT_FOUND", message: "Book not found" },
        { status: 404 },
      );
    return HttpResponse.json(book);
  }),

  // Library — stats must be before /:bookId to avoid param capture
  http.get(`${BASE}/library/stats`, () =>
    HttpResponse.json(computeLibraryStats()),
  ),
  http.get(`${BASE}/library`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") as
      | LibraryItem["status"]
      | null;
    let data = libraryItems;
    if (status) {
      data = libraryItems.filter((b) => b.status === status);
    }
    return HttpResponse.json({
      data,
      pagination: { total: data.length, page: 1, limit: 20 },
    });
  }),
  http.post(`${BASE}/swipes`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${BASE}/library`, async ({ request }) => {
    const body = (await request.json()) as {
      bookId: string;
      status: LibraryItem["status"];
    };
    const book = mockBooks.find((b) => b.id === body.bookId);
    if (!book)
      return HttpResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    const existing = libraryItems.find((b) => b.id === body.bookId);
    if (existing) {
      existing.status = body.status;
      return HttpResponse.json(existing, { status: 200 });
    }
    const newItem: LibraryItem = {
      ...book,
      status: body.status,
      progressPct: 0,
      timeLeftMin: null,
    };
    libraryItems.push(newItem);
    return HttpResponse.json(newItem, { status: 201 });
  }),
  http.patch(`${BASE}/library/:bookId`, async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const idx = libraryItems.findIndex((b) => b.id === params.bookId);
    if (idx === -1)
      return HttpResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    const item = libraryItems[idx];
    const pageCount = item.pageCount ?? 300;

    // Update fields from body
    if (
      typeof body.status === "string" &&
      ["want", "reading", "finished"].includes(body.status)
    ) {
      item.status = body.status as LibraryItem["status"];
    }
    if (typeof body.currentPage === "number") {
      item.currentPage = Math.max(0, Math.min(pageCount, body.currentPage));
      item.progressPct = Math.round((item.currentPage / pageCount) * 100);
    } else if (typeof body.progressPct === "number") {
      item.progressPct = body.progressPct;
    }
    if (typeof body.timeLeftMin === "number" || body.timeLeftMin === null) {
      item.timeLeftMin = body.timeLeftMin as number | null;
    }

    return HttpResponse.json(item);
  }),
  http.delete(`${BASE}/library/:bookId`, ({ params }) => {
    libraryItems = libraryItems.filter((b) => b.id !== params.bookId);
    return new HttpResponse(null, { status: 204 });
  }),

  // Discussions
  http.get(`${BASE}/discussions`, () =>
    HttpResponse.json({
      data: mockThreads,
      pagination: { total: mockThreads.length, page: 1, limit: 20 },
    }),
  ),
  http.post(`${BASE}/discussions/:id/like`, () =>
    HttpResponse.json({ liked: true, likes: 42 }),
  ),
  http.get(`${BASE}/discussions/:id`, ({ params }) => {
    const thread = mockThreads.find((t) => t.id === params.id);
    if (!thread)
      return HttpResponse.json(
        { error: "NOT_FOUND", message: "Thread not found" },
        { status: 404 },
      );
    return HttpResponse.json(thread);
  }),

  // Challenges
  http.get(`${BASE}/challenges`, () =>
    HttpResponse.json({ data: mockChallenges }),
  ),
  http.get(`${BASE}/challenges/:id/leaderboard`, () =>
    HttpResponse.json({ data: mockLeaderboard }),
  ),

  // Friends
  http.get(`${BASE}/friends`, () =>
    HttpResponse.json({
      data: [
        {
          id: "friend-1",
          userId: "user-2",
          username: "Alex Reader",
          avatarHue: 120,
          level: 8,
          levelTitle: "Page Turner",
          friendsSince: "2025-11-15T10:30:00Z",
          mutualCount: 3,
        },
        {
          id: "friend-2",
          userId: "user-3",
          username: "Sam Bookly",
          avatarHue: 240,
          level: 15,
          levelTitle: "Bookworm",
          friendsSince: "2025-09-03T08:00:00Z",
          mutualCount: 1,
        },
        {
          id: "friend-3",
          userId: "user-4",
          username: "Taylor Pages",
          avatarHue: 40,
          level: 5,
          levelTitle: "Newcomer",
          friendsSince: "2026-01-20T14:15:00Z",
          mutualCount: 0,
        },
      ],
      total: 3,
    }),
  ),

  http.get(`${BASE}/friends/pending`, () =>
    HttpResponse.json({
      data: {
        incoming: [
          {
            id: "req-1",
            userId: "user-5",
            username: "Morgan Leaf",
            avatarHue: 180,
            level: 10,
            levelTitle: "Scholar",
            direction: "incoming",
            sentAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "req-2",
            userId: "user-6",
            username: "Casey Spine",
            avatarHue: 320,
            level: 3,
            levelTitle: "Newcomer",
            direction: "incoming",
            sentAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ],
        outgoing: [
          {
            id: "req-3",
            userId: "user-7",
            username: "Jordan Plot",
            avatarHue: 60,
            level: 7,
            levelTitle: "Reader",
            direction: "outgoing",
            sentAt: new Date(Date.now() - 259200000).toISOString(),
          },
        ],
      },
    }),
  ),

  http.post(`${BASE}/friends/request`, async ({ request }) => {
    const body = (await request.json()) as { userId: string };
    return HttpResponse.json(
      {
        id: `req-${Date.now()}`,
        userId: body.userId,
        username: "New Friend",
        avatarHue: 200,
        level: 1,
        levelTitle: "Newcomer",
        direction: "outgoing",
        sentAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),

  http.post(`${BASE}/friends/accept/:requestId`, () =>
    HttpResponse.json({
      id: "friend-4",
      userId: "user-5",
      username: "Morgan Leaf",
      avatarHue: 180,
      level: 10,
      levelTitle: "Scholar",
      friendsSince: new Date().toISOString(),
      mutualCount: 0,
    }),
  ),

  http.post(`${BASE}/friends/reject/:requestId`, () =>
    new HttpResponse(null, { status: 204 }),
  ),

  http.delete(`${BASE}/friends/:friendshipId`, () =>
    new HttpResponse(null, { status: 204 }),
  ),
];
