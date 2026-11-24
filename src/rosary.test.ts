import { describe, expect, it } from 'vitest';
import { buildRosary, dailyMystery, localDate, resolveStep } from './rosary';
import { parseState, resumeOffer } from './storage';
import type { Session } from './storage';
import { latinPrayers, prayers } from './content';
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
describe('Latin prayers', () => {
  const shape = (set: MysterySet, fatima: boolean, language?: 'latin') => buildRosary(set, fatima, language).map(s => [s.id, s.section, s.prayer, s.bead, s.beads]);
  it('pray the same steps as English, so switching keeps your place', () => {
    expect(Object.keys(latinPrayers)).toEqual(Object.keys(prayers));
    for (const set of ['joyful', 'luminous', 'sorrowful', 'glorious'] as MysterySet[]) for (const fatima of [true, false])
      expect(shape(set, fatima, 'latin')).toEqual(shape(set, fatima));
  });
  it('change only the prayers, never the mysteries', () => {
    const steps = buildRosary('joyful', true, 'latin');
    expect(steps.slice(0, 7).map(s => s.title)).toEqual(['Signum Crucis', 'Symbolum Apostolicum', 'Pater Noster', 'Ave Maria', 'Ave Maria', 'Ave Maria', 'Gloria Patri']);
    expect(steps.slice(-3).map(s => s.title)).toEqual(['Salve Regina', 'Oremus', 'Signum Crucis']);
    expect(steps.find(s => s.id === 'decade-1-mystery')).toMatchObject({ title: 'The Annunciation', scripture: 'Luke 1:26–38' });
    expect(steps.find(s => s.id === 'decade-1-mary-1')!.text).toMatch(/^Ave, María, grátia plena,/);
  });
  it('use only characters the bundled Latin-1 font subset can show', () => {
    for (const prayer of Object.values(latinPrayers)) expect(prayer.title + prayer.text).toMatch(/^[\n\x20-\x7e\xa0-\xff]+$/);
  });
});
describe('saved progress validation', () => {
  it('recovers safely from corrupted and incompatible storage', () => {
    for (const raw of ['{oops', 'null', '[]', '{"version":2}']) expect(parseState(raw).sessions).toEqual([]);
  });
  it('rejects malformed sessions and keeps valid preferences', () => {
    expect(parseState(JSON.stringify({version: 1, preferences: {language: 'latin'}})).preferences.language).toBe('latin');
    expect(parseState(JSON.stringify({version: 1, preferences: {language: 'klingon'}})).preferences.language).toBe('english');
    const state = parseState(JSON.stringify({version: 1, preferences: {theme: 'dark', size: 'wrong', fatima: false}, sessions: [
      {date: '2026-09-26', set: 'joyful', step: 'decade-2-mary-5', updated: 1},
      {date: '2026-09-26', set: '__proto__', step: 'opening-cross', updated: 1},
      {date: 'oops', set: 'joyful', step: 'opening-cross', updated: 1},
      {date: '2026-09-26', set: 'joyful', step: '<script>', updated: 1},
    ]}));
    expect(state.sessions).toHaveLength(1);
    expect(state.preferences).toEqual({theme: 'dark', size: 'normal', fatima: false, language: 'english'});
  });
});
describe('resume offer', () => {
  const now = new Date(2026, 10, 23, 9);
  const today = { date: '2026-11-23', set: 'joyful' as const };
  const session = (date: string, set: MysterySet, step: string, updated: Date): Session => ({ date, set, step, updated: updated.getTime() });
  const onScreen = session('2026-11-23', 'joyful', 'decade-3-mary-7', new Date(2026, 10, 23, 8, 30));
  const yesterday = session('2026-11-22', 'sorrowful', 'decade-2-mary-3', new Date(2026, 10, 22, 21));
  const otherSetToday = session('2026-11-23', 'luminous', 'decade-1-father', new Date(2026, 10, 23, 8));

  it('offers the most recent other unfinished rosary, never the one on screen', () => {
    expect(resumeOffer([yesterday, otherSetToday, onScreen], today, now)).toBe(otherSetToday);
    expect(resumeOffer([yesterday, onScreen], today, now)).toBe(yesterday);
    expect(resumeOffer([onScreen], today, now)).toBeUndefined();
  });
  it('skips finished, unstarted, and abandoned rosaries', () => {
    expect(resumeOffer([
      session('2026-11-22', 'sorrowful', 'complete', new Date(2026, 10, 22, 21)),
      session('2026-11-22', 'glorious', 'opening-cross', new Date(2026, 10, 22, 21)),
      session('2026-11-02', 'joyful', 'decade-4-glory', new Date(2026, 10, 21, 23, 59)),
    ], today, now)).toBeUndefined();
  });
  it('keeps offering an older rosary while it is still being prayed', () => {
    const decadeADay = session('2026-11-20', 'glorious', 'decade-3-mystery', new Date(2026, 10, 22, 0, 0));
    expect(resumeOffer([decadeADay], today, now)).toBe(decadeADay);
  });
});
