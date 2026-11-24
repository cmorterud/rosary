import { mysteries, prayerTexts } from './content';
import type { Language, MysterySet, PrayerId } from './content';

export type Step = {
  id: string; title: string; text: string; section: number;
  prayer?: PrayerId; bead?: number; beads?: number; scripture?: string; context?: string;
};
export type RosaryOptions = { fatima: boolean; litany: boolean; michael: boolean; pope: boolean; language: Language };
const defaults: RosaryOptions = { fatima: true, litany: false, michael: false, pope: false, language: 'english' };

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
// Step ids depend on neither the language nor the optional prayers, so
// changing either keeps your place.
export function buildRosary(set: MysterySet, options: Partial<RosaryOptions> = {}): Step[] {
  const { fatima, litany, michael, pope, language } = { ...defaults, ...options };
  const steps: Step[] = [];
  const add = (id: string, prayer: PrayerId, section: number, extra: Partial<Step> = {}) =>
    steps.push({ id, prayer, section, ...prayerTexts[language][prayer], ...extra });
  add('opening-cross', 'cross', 0);
  add('opening-creed', 'creed', 0);
  add('opening-father', 'father', 0);
  ['faith', 'hope', 'charity'].forEach((virtue, n) => add(`opening-mary-${n + 1}`, 'mary', 0, { bead: n + 1, beads: 3, context: `For an increase in ${virtue}` }));
  add('opening-glory', 'glory', 0);
  mysteries[set].items.forEach((mystery, index) => {
    const d = index + 1;
    steps.push({ id: `decade-${d}-mystery`, section: d, title: mystery.title, text: mystery.reflection, scripture: mystery.scripture });
    add(`decade-${d}-father`, 'father', d);
    for (let n = 1; n <= 10; n++) add(`decade-${d}-mary-${n}`, 'mary', d, { bead: n, beads: 10 });
    add(`decade-${d}-glory`, 'glory', d);
    if (fatima) add(`decade-${d}-fatima`, 'fatima', d);
  });
  add('closing-queen', 'queen', 6);
  if (litany) add('closing-litany', 'litany', 6);
  add('closing-prayer', 'closing', 6);
  if (michael) add('closing-michael', 'michael', 6);
  if (pope) for (const prayer of ['father', 'mary', 'glory'] as const) add(`closing-pope-${prayer}`, prayer, 6, { context: 'For the intentions of the Holy Father' });
  add('closing-cross', 'cross', 6);
  return steps;
}

export function resolveStep(steps: Step[], id: string): number {
  if (id === 'complete') return steps.length;
  const exact = steps.findIndex(step => step.id === id);
  if (exact >= 0) return exact;
  // Turning off an optional prayer continues with the next prayer, never
  // restarts the rosary. The final Sign of the Cross is always present.
  const order = buildRosary('joyful', { fatima: true, litany: true, michael: true, pope: true }).map(step => step.id);
  const at = order.indexOf(id);
  if (at < 0) return 0;
  const present = new Set(steps.map(step => step.id));
  const next = order.slice(at + 1).find(later => present.has(later));
  return steps.findIndex(step => step.id === next);
}
