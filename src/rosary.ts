import { mysteries, prayers } from './content';
import type { MysterySet, PrayerId } from './content';

export type Step = {
  id: string; title: string; text: string; section: number;
  prayer?: PrayerId; bead?: number; beads?: number; scripture?: string;
};

export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function dailyMystery(date = new Date()): MysterySet {
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
