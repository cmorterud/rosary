import { mysteries } from './content';
import type { MysterySet } from './content';

export const STORAGE_KEY = 'daily-rosary-v1';
export type Session = { date: string; set: MysterySet; step: string; updated: number };
export type State = {
  version: 1;
  preferences: { theme: 'system' | 'light' | 'dark'; size: 'normal' | 'large' | 'largest'; fatima: boolean };
  sessions: Session[];
};
export const initialState = (): State => ({ version: 1, preferences: { theme: 'system', size: 'normal', fatima: true }, sessions: [] });
export function parseState(raw: string | null): State {
  const clean = initialState();
  try {
    const value = JSON.parse(raw ?? 'null');
    if (!value || value.version !== 1) return clean;
    const p = value.preferences ?? {};
    if (['system', 'light', 'dark'].includes(p.theme)) clean.preferences.theme = p.theme;
    if (['normal', 'large', 'largest'].includes(p.size)) clean.preferences.size = p.size;
    if (typeof p.fatima === 'boolean') clean.preferences.fatima = p.fatima;
    if (Array.isArray(value.sessions)) clean.sessions = value.sessions.filter((s: Session) =>
      s && typeof s.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.date) &&
      Object.hasOwn(mysteries, s.set) && typeof s.step === 'string' &&
      /^(opening-(cross|creed|father|mary-[1-3]|glory)|decade-[1-5]-(mystery|father|mary-([1-9]|10)|glory|fatima)|closing-(queen|prayer|cross)|complete)$/.test(s.step) &&
      Number.isFinite(s.updated)).slice(-32);
  } catch { /* Corrupted or old storage must never stop someone from praying. */ }
  return clean;
}
