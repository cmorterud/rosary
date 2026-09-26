import { describe, expect, it } from 'vitest';
import { buildRosary, dailyMystery, localDate, resolveStep } from './rosary';
import { parseState } from './storage';
import type { MysterySet } from './content';

describe('daily mysteries', () => {
  it('uses the local weekday for all seven days', () => {
    const expected = ['glorious', 'joyful', 'sorrowful', 'glorious', 'luminous', 'sorrowful', 'joyful'];
    expected.forEach((set, n) => expect(dailyMystery(new Date(2026, 8, 20 + n, 23, 59))).toBe(set));
  });
  it('uses local calendar components rather than a UTC date', () => {
    expect(localDate(new Date(2026, 0, 2, 0, 1))).toBe('2026-01-02');
  });
  it('uses Sorrowful on Lent Sundays and Glorious on Easter', () => {
    for (const [year, firstLent, palmSunday, easterSunday] of [
      [2024, [1, 18], [2, 24], [2, 31]],
      [2025, [2, 9], [3, 13], [3, 20]],
      [2026, [1, 22], [2, 29], [3, 5]],
    ] as const) {
      const sunday = ([month, day]: readonly [number, number]) => new Date(year, month, day, 12);
      expect(dailyMystery(sunday(firstLent))).toBe('sorrowful');
      expect(dailyMystery(sunday(palmSunday))).toBe('sorrowful');
      expect(dailyMystery(sunday(easterSunday))).toBe('glorious');
      expect(dailyMystery(new Date(sunday(firstLent).getFullYear(), firstLent[0], firstLent[1] - 7, 12))).toBe('glorious');
    }
  });
  it('uses Joyful on the four Sundays of Advent, then Glorious', () => {
    for (const [year, firstSunday] of [[2025, 30], [2026, 29]] as const) {
      const start = new Date(year, 10, firstSunday, 12);
      expect(dailyMystery(new Date(year, 10, firstSunday - 7, 12))).toBe('glorious');
      for (let week = 0; week < 4; week++) expect(dailyMystery(new Date(year, 10, firstSunday + 7 * week, 12))).toBe('joyful');
      const christmas = new Date(year, 11, 25, 12);
      expect(dailyMystery(new Date(year, 11, 25 + (7 - christmas.getDay()) % 7, 12))).toBe('glorious');
      expect(start.getDay()).toBe(0);
    }
    expect(dailyMystery(new Date(2023, 11, 24, 12))).toBe('joyful');
    expect(dailyMystery(new Date(2022, 10, 27, 12))).toBe('joyful');
  });
  it('keeps the weekday schedule during Lent and Advent', () => {
    expect(dailyMystery(new Date(2026, 2, 26, 12))).toBe('luminous');
    expect(dailyMystery(new Date(2026, 11, 10, 12))).toBe('luminous');
    expect(dailyMystery(new Date(2026, 2, 27, 12))).toBe('sorrowful');
  });
});
describe('prayer sequence', () => {
  for (const set of ['joyful', 'luminous', 'sorrowful', 'glorious'] as MysterySet[]) {
    it(`${set}: includes every prayer, individual bead, and closing`, () => {
      const steps = buildRosary(set);
      expect(steps).toHaveLength(80);
      expect(new Set(steps.map(s => s.id)).size).toBe(80);
      expect(steps.filter(s => s.prayer === 'mary')).toHaveLength(53);
      expect(steps.filter(s => s.prayer === 'father')).toHaveLength(6);
      expect(steps.filter(s => s.prayer === 'glory')).toHaveLength(6);
      expect(steps.slice(0, 7).map(s => s.prayer)).toEqual(['cross', 'creed', 'father', 'mary', 'mary', 'mary', 'glory']);
      for (let d = 1; d <= 5; d++) {
        const decade = steps.filter(s => s.section === d);
        expect(decade.map(s => s.prayer ?? 'mystery')).toEqual(['mystery', 'father', ...Array(10).fill('mary'), 'glory', 'fatima']);
        expect(decade.filter(s => s.prayer === 'mary').map(s => s.bead)).toEqual([1,2,3,4,5,6,7,8,9,10]);
      }
      expect(steps.slice(-3).map(s => s.prayer)).toEqual(['queen', 'closing', 'cross']);
    });
  }
  it('preserves position when optional prayers change, including a removed current prayer', () => {
    const short = buildRosary('joyful', false);
    expect(short).toHaveLength(75);
    expect(short[resolveStep(short, 'decade-3-mary-8')].id).toBe('decade-3-mary-8');
    expect(short[resolveStep(short, 'decade-2-fatima')].id).toBe('decade-3-mystery');
    expect(short[resolveStep(short, 'decade-5-fatima')].id).toBe('closing-queen');
    expect(resolveStep(short, 'complete')).toBe(short.length);
  });
});
describe('saved progress validation', () => {
  it('recovers safely from corrupted and incompatible storage', () => {
    for (const raw of ['{oops', 'null', '[]', '{"version":2}']) expect(parseState(raw).sessions).toEqual([]);
  });
  it('rejects malformed sessions and keeps valid preferences', () => {
    const state = parseState(JSON.stringify({version: 1, preferences: {theme: 'dark', size: 'wrong', fatima: false}, sessions: [
      {date: '2026-09-26', set: 'joyful', step: 'decade-2-mary-5', updated: 1},
      {date: '2026-09-26', set: '__proto__', step: 'opening-cross', updated: 1},
      {date: 'oops', set: 'joyful', step: 'opening-cross', updated: 1},
      {date: '2026-09-26', set: 'joyful', step: '<script>', updated: 1},
    ]}));
    expect(state.sessions).toHaveLength(1);
    expect(state.preferences).toEqual({theme: 'dark', size: 'normal', fatima: false});
  });
});
