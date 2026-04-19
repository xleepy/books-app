module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['./jest.msw.setup.ts'],
  // Allow babel-jest to transform ESM-only MSW dependencies
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|msw|rettime|until-async|@open-draft))',
    '/node_modules/react-native-reanimated/plugin/',
  ],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { caller: { name: 'metro', bundler: 'metro', platform: 'ios' } }],
    '\\.mjs$': ['babel-jest', { caller: { name: 'metro', bundler: 'metro', platform: 'ios' } }],
  },
  moduleNameMapper: {
    '^react-native-reanimated$': 'react-native-reanimated/mock',
    // msw/node has react-native:null export — point directly at CJS build
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
    // Force Jest (Node env) to use the msw/node server, not the .native.ts stub
    '^.*/mocks/server$': '<rootDir>/src/mocks/server.ts',
    '^msw$': '<rootDir>/node_modules/msw/lib/core/index.js',
    // immer + react-redux react-native export conditions point to ESM; force CJS builds
    '^immer$': '<rootDir>/node_modules/immer/dist/cjs/index.js',
    '^react-redux$': '<rootDir>/node_modules/react-redux/dist/cjs/index.js',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@widgets/(.*)$': '<rootDir>/src/widgets/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
  },
};
