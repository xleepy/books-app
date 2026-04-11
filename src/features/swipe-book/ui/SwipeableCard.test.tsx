import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { SwipeableCard } from './SwipeableCard';

// GestureDetector → plain View; Gesture objects → chainable stubs (no-ops)
jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  const makeGesture = () => {
    const g: Record<string, unknown> = {};
    for (const m of ['onBegin', 'onStart', 'onEnd', 'onUpdate', 'onFinalize', 'minDistance', 'maxDuration']) {
      g[m] = () => g;
    }
    return g;
  };
  return {
    GestureDetector: View,
    Gesture: { Tap: makeGesture, Pan: makeGesture, Race: () => ({}) },
  };
});

describe('SwipeableCard', () => {
  it('renders its children', () => {
    const { queryByText } = render(
      <SwipeableCard>
        <Text>Book Title</Text>
      </SwipeableCard>,
    );
    expect(queryByText('Book Title')).toBeTruthy();
  });

  it('accepts all callback props without crashing', () => {
    const { queryByText } = render(
      <SwipeableCard onTap={jest.fn()} onSwipeLeft={jest.fn()} onSwipeRight={jest.fn()}>
        <Text>Content</Text>
      </SwipeableCard>,
    );
    expect(queryByText('Content')).toBeTruthy();
  });

  it('renders without any callbacks', () => {
    const { queryByText } = render(
      <SwipeableCard>
        <Text>Minimal</Text>
      </SwipeableCard>,
    );
    expect(queryByText('Minimal')).toBeTruthy();
  });
});
