import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { addDays, formatDate, parseISODate, startOfDayUTC } from './CreateChallengeScreen';
import { CalendarPicker } from './CalendarPicker';

describe('CreateChallengeScreen date helpers', () => {
  describe('formatDate', () => {
    it('formats a local date as YYYY-MM-DD', () => {
      const date = new Date(2026, 3, 27); // April 27, 2026 (local)
      expect(formatDate(date)).toBe('2026-04-27');
    });

    it('does not shift the day because of UTC conversion (timezone bug)', () => {
      // Construct a local midnight that would become the previous day in UTC
      // for positive-offset timezones (e.g. UTC+8).
      const localMidnight = new Date(2026, 3, 27, 0, 0, 0);
      const result = formatDate(localMidnight);
      expect(result).toBe('2026-04-27');
      expect(result).not.toBe('2026-04-26');
    });

    it('pads single-digit months and days', () => {
      const date = new Date(2026, 0, 5); // Jan 5
      expect(formatDate(date)).toBe('2026-01-05');
    });
  });

  describe('parseISODate', () => {
    it('parses a valid ISO date string', () => {
      const result = parseISODate('2026-04-27');
      expect(result).not.toBeNull();
      expect(result!.getFullYear()).toBe(2026);
      expect(result!.getMonth()).toBe(3); // April is 3
      expect(result!.getDate()).toBe(27);
    });

    it('returns null for invalid strings', () => {
      expect(parseISODate('')).toBeNull();
      expect(parseISODate('not-a-date')).toBeNull();
      expect(parseISODate('2026-02-30')).toBeNull(); // invalid day
    });
  });

  describe('addDays', () => {
    it('adds days to a date', () => {
      const date = new Date(2026, 3, 27);
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(2);
      expect(result.getMonth()).toBe(4); // May
    });

    it('does not mutate the original date', () => {
      const date = new Date(2026, 3, 27);
      addDays(date, 5);
      expect(date.getDate()).toBe(27);
    });
  });

  describe('startOfDayUTC', () => {
    it('returns a UTC date at midnight for the local date components', () => {
      const date = new Date(2026, 3, 27, 14, 30, 0); // 14:30 local
      const result = startOfDayUTC(date);
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCDate()).toBe(27);
    });
  });
});

describe('CalendarPicker', () => {
  it('renders the selected month and year', () => {
    const screen = render(
      <CalendarPicker
        visible={true}
        selectedDate={new Date(2026, 3, 15)}
        onSelect={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText('April 2026')).toBeTruthy();
  });

  it('calls onSelect with the correct local date when a day is pressed', () => {
    const onSelect = jest.fn();
    const screen = render(
      <CalendarPicker
        visible={true}
        selectedDate={new Date(2026, 3, 15)}
        onSelect={onSelect}
        onClose={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByText('27'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    const selected = onSelect.mock.calls[0][0] as Date;
    expect(selected.getFullYear()).toBe(2026);
    expect(selected.getMonth()).toBe(3);
    expect(selected.getDate()).toBe(27);
  });

  it('does not call onSelect for disabled dates before minimumDate', () => {
    const onSelect = jest.fn();
    const screen = render(
      <CalendarPicker
        visible={true}
        selectedDate={new Date(2026, 3, 15)}
        onSelect={onSelect}
        onClose={jest.fn()}
        minimumDate={new Date(2026, 3, 10)}
      />,
    );
    // Day 5 should be disabled
    const day5 = screen.queryByText('5');
    if (day5) {
      fireEvent.press(day5);
    }
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('calls onClose when overlay is pressed', () => {
    const onClose = jest.fn();
    const screen = render(
      <CalendarPicker
        visible={true}
        selectedDate={new Date(2026, 3, 15)}
        onSelect={jest.fn()}
        onClose={onClose}
      />,
    );
    // The overlay is the first Pressable; press it
    const overlay = screen.getByTestId('calendar-overlay');
    fireEvent.press(overlay);
    expect(onClose).toHaveBeenCalled();
  });
});
