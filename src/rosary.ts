import { mysteries, prayers } from './content';
import type { MysterySet, PrayerId } from './content';

export type Step = {
  id: string; title: string; text: string; section: number;
  prayer?: PrayerId; bead?: number; beads?: number; scripture?: string;
};

export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Gregorian Easter (Meeus/Jones/Butcher). Work in calendar days so daylight
// saving changes cannot move a Sunday into the wrong season.
function easterUtc(year: number): number {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const offset = h + l - 7 * m + 114;
  return Date.UTC(year, Math.floor(offset / 31) - 1, offset % 31 + 1);
}

export function dailyMystery(date = new Date()): MysterySet {
  if (date.getDay() === 0) {
    const year = date.getFullYear();
    const day = Date.UTC(year, date.getMonth(), date.getDate());
    const easter = easterUtc(year);
    const dayMs = 24 * 60 * 60 * 1000;
    // First Sunday of Lent through Palm Sunday; Easter returns to Glorious.
    if (day >= easter - 42 * dayMs && day < easter) return 'sorrowful';

    // Advent has four Sundays, ending on the last Sunday before Christmas.
    const christmasEve = Date.UTC(year, 11, 24);
    const lastAdventSunday = christmasEve - new Date(christmasEve).getUTCDay() * dayMs;
    if (day >= lastAdventSunday - 21 * dayMs && day <= lastAdventSunday) return 'joyful';
  }
  return (['glorious', 'joyful', 'sorrowful', 'glorious', 'luminous', 'sorrowful', 'joyful'] as const)[date.getDay()];
}
export function buildRosary(set: MysterySet, fatima = true): Step[] {
  const steps: Step[] = [];
  const add = (id: string, prayer: PrayerId, section: number, bead?: number, beads?: number) =>
    steps.push({ id, prayer, section, bead, beads, ...prayers[prayer] });
  add('opening-cross', 'cross', 0);
  add('opening-creed', 'creed', 0);
  add('opening-father', 'father', 0);
  for (let n = 1; n <= 3; n++) add(`opening-mary-${n}`, 'mary', 0, n, 3);
  add('opening-glory', 'glory', 0);
  mysteries[set].items.forEach((mystery, index) => {
    const d = index + 1;
    steps.push({ id: `decade-${d}-mystery`, section: d, title: mystery.title, text: mystery.reflection, scripture: mystery.scripture });
    add(`decade-${d}-father`, 'father', d);
    for (let n = 1; n <= 10; n++) add(`decade-${d}-mary-${n}`, 'mary', d, n, 10);
    add(`decade-${d}-glory`, 'glory', d);
    if (fatima) add(`decade-${d}-fatima`, 'fatima', d);
  });
  add('closing-queen', 'queen', 6);
  add('closing-prayer', 'closing', 6);
  add('closing-cross', 'cross', 6);
  return steps;
}

export function resolveStep(steps: Step[], id: string): number {
  if (id === 'complete') return steps.length;
  const exact = steps.findIndex(step => step.id === id);
  if (exact >= 0) return exact;
  // Turning off an optional prayer continues forward, never restarts the rosary.
  const match = /^decade-([1-5])-fatima$/.exec(id);
  if (match) return steps.findIndex(step => step.id === (Number(match[1]) === 5 ? 'closing-queen' : `decade-${Number(match[1]) + 1}-mystery`));
  return 0;
}
