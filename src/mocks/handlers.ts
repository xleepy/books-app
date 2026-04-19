import { http, HttpResponse } from 'msw';
import { mockBooks } from '@entities/book/mock/books';
import { mockThreads } from '@entities/discussion/mock/discussions';
import { mockChallenges, mockLeaderboard } from '@entities/challenge/mock/challenges';
import { mockReviews } from '@entities/review/mock/reviews';

const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

// More-specific routes must be declared before /:id catch-alls
export const handlers = [
  // Health
  http.get(`${BASE}/healthz`, () => HttpResponse.json({ status: 'ok' })),

  // Auth
  http.post(`${BASE}/auth/register`, () =>
    HttpResponse.json({ accessToken: 'mock-token' }, { status: 201 })
  ),
  http.post(`${BASE}/auth/login`, () =>
    HttpResponse.json({ accessToken: 'mock-token' })
  ),

  // Books — specific sub-routes first
  http.get(`${BASE}/books`, () =>
    HttpResponse.json({
      data: mockBooks,
      pagination: { total: mockBooks.length, page: 1, limit: 20 },
    })
  ),
  http.get(`${BASE}/books/:id/recommendations`, () =>
    HttpResponse.json({ data: mockBooks.slice(1) })
  ),
  http.get(`${BASE}/books/:id/reviews`, () =>
    HttpResponse.json({
      data: mockReviews,
      pagination: { total: mockReviews.length, page: 1, limit: 20 },
    })
  ),
  http.post(`${BASE}/books/:id/reviews`, () =>
    HttpResponse.json(mockReviews[0], { status: 201 })
  ),
  http.get(`${BASE}/books/:id`, ({ params }) => {
    const book = mockBooks.find((b) => b.id === params.id);
    if (!book)
      return HttpResponse.json(
        { error: 'NOT_FOUND', message: 'Book not found' },
        { status: 404 }
      );
    return HttpResponse.json(book);
  }),

  // Library — stats must be before /:bookId to avoid param capture
  http.get(`${BASE}/library/stats`, () =>
    HttpResponse.json({ finished: 12, reading: 1, saved: 3 })
  ),
  http.get(`${BASE}/library`, () =>
    HttpResponse.json({
      data: mockBooks.slice(0, 3).map((b, i) => ({
        ...b,
        status: i === 0 ? 'reading' : 'want',
        isCurrent: i === 0,
        progressPct: i === 0 ? 68 : 0,
        timeLeftMin: i === 0 ? 240 : null,
      })),
      pagination: { total: 3, page: 1, limit: 20 },
    })
  ),
  http.post(`${BASE}/library/:bookId`, () => new HttpResponse(null, { status: 204 })),
  http.delete(`${BASE}/library/:bookId`, () => new HttpResponse(null, { status: 204 })),

  // Discussions
  http.get(`${BASE}/discussions`, () =>
    HttpResponse.json({
      data: mockThreads,
      pagination: { total: mockThreads.length, page: 1, limit: 20 },
    })
  ),
  http.post(`${BASE}/discussions/:id/like`, () =>
    HttpResponse.json({ liked: true, likes: 42 })
  ),
  http.get(`${BASE}/discussions/:id`, ({ params }) => {
    const thread = mockThreads.find((t) => t.id === params.id);
    if (!thread)
      return HttpResponse.json(
        { error: 'NOT_FOUND', message: 'Thread not found' },
        { status: 404 }
      );
    return HttpResponse.json(thread);
  }),

  // Challenges
  http.get(`${BASE}/challenges`, () =>
    HttpResponse.json({ data: mockChallenges })
  ),
  http.get(`${BASE}/challenges/:id/leaderboard`, () =>
    HttpResponse.json({ data: mockLeaderboard })
  ),
];
