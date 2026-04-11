export const bookCovers = {
  cover1: require('./generated-1775904473472.png'),
  cover2: require('./generated-1775904570476.png'),
  cover3: require('./generated-1775904680876.png'),
  cover4: require('./generated-1775904808490.png'),
} as const;

export type BookCoverKey = keyof typeof bookCovers;
