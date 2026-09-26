import './style.css';
import { mysteries, prayers } from './content';
import type { MysterySet } from './content';
import { buildRosary, dailyMystery, localDate, resolveStep } from './rosary';
import { initialState, parseState, STORAGE_KEY } from './storage';
import type { Session } from './storage';

const app = document.querySelector<HTMLDivElement>('#app')!;
let storageAvailable = true;
let state = initialState();
try { state = parseState(localStorage.getItem(STORAGE_KEY)); } catch { storageAvailable = false; }
let set = dailyMystery();
let sessionDate = localDate();
let steps = buildRosary(set, state.preferences.fatima);
let index = 0;
let resumeCandidate = state.sessions.filter(s => s.step !== 'complete' && s.step !== 'opening-cross').sort((a, b) => b.updated - a.updated)[0];
let noticeDismissed = false;
const cross = '<svg viewBox="0 0 24 32" fill="none" aria-hidden="true"><path d="M12 2v28M3 11h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

app.innerHTML = `
  <aside class="sidebar" aria-label="Rosary navigation">
    <a class="brand" href="#" data-action="today">${cross}<span>Daily Rosary<small>A MOMENT WITH GOD</small></span></a>
    <div class="sidebar-intro"><span class="eyebrow">YOUR DAILY PRAYER</span><h2 id="set-name"></h2><button class="change-button" data-dialog="mysteries-dialog">Change mysteries <span aria-hidden="true">↗</span></button></div>
    <nav id="journey" aria-label="Prayer journey"></nav>
    <div class="sidebar-bottom"><button data-dialog="prayers-dialog">Prayers & guide <span aria-hidden="true">↗</span></button><p>One prayer.<br>One bead.<br>One quiet moment.</p><span class="sidebar-cross" aria-hidden="true">✦</span></div>
  </aside>
  <div class="workspace">
    <header class="topbar"><span id="date-label"></span><div class="header-controls"><button class="mobile-mysteries" data-dialog="mysteries-dialog">Mysteries</button><button class="settings-button" data-dialog="settings-dialog" aria-label="Open settings"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 17h16M9 4v6m6 4v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span>Settings</span></button></div></header>
    <div id="notice" class="notice" hidden></div>
    <main id="prayer" tabindex="-1">
      <div class="prayer-meta"><span id="section-label" class="eyebrow"></span><span id="step-count"></span></div>
      <div class="prayer-surface"><div class="prayer-emblem">${cross}</div><div id="prayer-content"></div><div id="beads"></div></div>
      <div class="navigation"><button id="previous" class="previous" aria-label="Previous prayer"><span aria-hidden="true">←</span><span>Previous</span></button><button id="next" class="primary">Continue ${arrow}</button></div>
      <p class="keyboard-hint">Go at your own pace <span>·</span> <kbd>Space</kbd> or <kbd>→</kbd> to continue</p>
      <div class="progress-track" role="progressbar" aria-label="Rosary progress" aria-valuemin="0" aria-valuemax="100"><div id="progress-fill"></div></div>
      <p id="save-status" class="save-status"></p>
    </main>
    <footer><span>Pray with a peaceful heart.</span><button data-dialog="guide-dialog">How to use this guide</button></footer>
  </div>
  <div id="announcement" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>
  <dialog id="mysteries-dialog" aria-labelledby="mysteries-title"><div class="dialog-header"><span class="eyebrow">THE HOLY ROSARY</span><button class="close" data-close aria-label="Close">×</button></div><h2 id="mysteries-title">Choose your mysteries</h2><p class="dialog-description">Follow today’s mysteries, or choose another set. Your place in each is saved.</p><div id="mystery-options"></div><button class="text-button" data-action="today">Return to today’s rosary</button></dialog>
  <dialog id="settings-dialog" aria-labelledby="settings-title"><div class="dialog-header"><span class="eyebrow">MAKE YOURSELF COMFORTABLE</span><button class="close" data-close aria-label="Close">×</button></div><h2 id="settings-title">Prayer settings</h2>
    <label class="setting">Appearance<select id="theme"><option value="system">Use device setting</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
    <label class="setting">Prayer text size<select id="size"><option value="normal">Standard</option><option value="large">Large</option><option value="largest">Extra large</option></select></label>
    <label class="setting checkbox-setting"><span>Include the Fatima Prayer<small>After each decade</small></span><input id="fatima" type="checkbox"></label>
    <p class="privacy-note">Your progress and preferences stay in this browser. No accounts or tracking.</p>
    <button class="text-button" data-action="restart-prompt">Start this rosary again</button>
  </dialog>
  <dialog id="restart-dialog" aria-labelledby="restart-title"><div class="dialog-header"><span class="eyebrow">A FRESH BEGINNING</span><button class="close" data-close aria-label="Close">×</button></div><h2 id="restart-title">Start from the beginning?</h2><p>This resets your place in the current rosary. Your preferences and other rosaries stay saved.</p><div class="dialog-actions"><button class="secondary" data-close>Keep my place</button><button class="primary" data-action="restart">Start again</button></div></dialog>
  <dialog id="prayers-dialog" class="wide-dialog" aria-labelledby="prayers-title"><div class="dialog-header"><span class="eyebrow">A PRAYER COMPANION</span><button class="close" data-close aria-label="Close">×</button></div><h2 id="prayers-title">Prayers of the rosary</h2><p class="dialog-description">Traditional English wording. You can print this collection for use away from a screen.</p>${Object.values(prayers).map(p => `<details><summary>${p.title}</summary><p class="reference-prayer">${escape(p.text)}</p></details>`).join('')}<button class="text-button" id="print">Print prayers</button><p class="source-note">Sequence reviewed against the <a href="https://www.usccb.org/how-to-pray-the-rosary" target="_blank" rel="noopener noreferrer">USCCB rosary guide</a>. Prayer wording varies by tradition. Mystery reflections are original, brief invitations to prayer; Scripture references are provided for further reading.</p></dialog>
  <dialog id="guide-dialog" aria-labelledby="guide-title"><div class="dialog-header"><span class="eyebrow">AT YOUR OWN PACE</span><button class="close" data-close aria-label="Close">×</button></div><h2 id="guide-title">A little guidance</h2><p>Read each prayer, then tap Continue. Every Hail Mary has its own bead and number, so you don’t need to keep count.</p><p>On a keyboard, use Space, Enter, or the right arrow to continue. Use the left arrow to go back. When a button or menu has focus, the keyboard operates that control instead.</p><p>The journey menu lets you jump to a mystery. Your progress is saved in this browser whenever you move to another prayer.</p><p>Today’s mysteries follow your device’s local date. Sundays use the Glorious Mysteries year-round; you can choose another set at any time.</p><button class="primary" data-close>Return to prayer</button></dialog>
`;

function el<T extends HTMLElement = HTMLElement>(id: string) { return document.getElementById(id) as T; }
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageAvailable = true; } catch { storageAvailable = false; }
}
function saveProgress() {
  const session: Session = { date: sessionDate, set, step: steps[index]?.id ?? 'complete', updated: Date.now() };
  state.sessions = [...state.sessions.filter(s => s.date !== sessionDate || s.set !== set), session].slice(-32);
  persist();
}
function applyPreferences() {
  document.documentElement.dataset.theme = state.preferences.theme;
  document.documentElement.dataset.size = state.preferences.size;
  el<HTMLSelectElement>('theme').value = state.preferences.theme;
  el<HTMLSelectElement>('size').value = state.preferences.size;
  el<HTMLInputElement>('fatima').checked = state.preferences.fatima;
}
function dateText(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
function renderNotice() {
  const notice = el('notice');
  const oldDay = sessionDate !== localDate();
  const completedToday = state.sessions.find(s => s.date === sessionDate && s.set === set && s.step === 'complete');
  notice.hidden = noticeDismissed || (!resumeCandidate && !oldDay && !completedToday);
  if (notice.hidden) return;
  notice.innerHTML = oldDay
    ? `<span>You’re praying the rosary from ${dateText(sessionDate)}.</span><button data-action="today">Pray today’s rosary</button>`
    : resumeCandidate
      ? `<span>Your ${mysteries[resumeCandidate.set].name.toLowerCase()} rosary${resumeCandidate.date === localDate() ? '' : ' from ' + dateText(resumeCandidate.date)} is waiting.</span><button data-action="resume">Continue where I left off</button><button data-action="dismiss" aria-label="Dismiss saved prayer reminder">×</button>`
      : '<span>You’ve completed this rosary today. You’re welcome to pray again.</span><button data-action="dismiss" aria-label="Dismiss">×</button>';
}
function render(announce = false) {
  const step = steps[index];
  const complete = !step;
  const section = step?.section ?? 7;
  el('set-name').innerHTML = `${mysteries[set].name}<br>Mysteries`;
  el('date-label').textContent = dateText(sessionDate);
  el('section-label').textContent = complete ? 'IN PEACE' : section === 0 ? 'OPENING PRAYERS' : section === 6 ? 'CLOSING PRAYERS' : `${mysteries[set].name.toUpperCase()} MYSTERIES · ${section} OF 5`;
  el('step-count').textContent = complete ? 'Complete' : `${index + 1} / ${steps.length}`;
  const sectionNames = ['Opening prayers', ...mysteries[set].items.map(m => m.title), 'Closing prayers'];
  el('journey').innerHTML = sectionNames.map((name, n) => `<button class="journey-item ${n === section ? 'active' : ''} ${n < section ? 'past' : ''}" data-section="${n}" ${n === section ? 'aria-current="step"' : ''}><span class="journey-number" aria-hidden="true">${n < section ? '✓' : n === 0 ? '✝' : n === 6 ? '✧' : n}</span><span>${name}${n === section && section > 0 && section < 6 ? '<small>CURRENT MYSTERY</small>' : ''}</span></button>`).join('');
  el('prayer-content').innerHTML = complete
    ? '<p class="prayer-context">Your rosary is complete</p><h1>Go in peace.</h1><p class="completion-text">Carry this quiet moment with you<br>into the rest of your day.</p><p class="completion-date">' + dateText(sessionDate) + ' · ' + mysteries[set].name + ' Mysteries</p>'
    : `<p class="prayer-context">${section > 0 && section < 6 && step.prayer ? mysteries[set].items[section - 1].title : step.bead ? ['For an increase in faith', 'For an increase in hope', 'For an increase in charity'][step.bead - 1] : step.scripture ? 'Pause to contemplate this mystery' : section === 0 ? 'Let us begin in the presence of God' : 'As we bring our prayer to a close'}</p><h1>${step.title}</h1>${step.scripture ? `<p class="scripture">${step.scripture}</p>` : ''}<div class="prayer-text ${step.scripture ? 'reflection' : ''} ${step.prayer === 'creed' || step.prayer === 'queen' || step.prayer === 'closing' ? 'long-prayer' : ''}">${escape(step.text)}</div>`;
  el('beads').innerHTML = step?.bead ? `<div class="bead-row" aria-hidden="true">${Array.from({ length: step.beads! }, (_, n) => `<span class="bead ${n + 1 < step.bead! ? 'prayed' : n + 1 === step.bead ? 'current' : ''}"></span>`).join('')}</div><p class="bead-count">Hail Mary ${step.bead} of ${step.beads}</p>` : '<div class="quiet-rule" aria-hidden="true"><span>✦</span></div>';
  el<HTMLButtonElement>('previous').disabled = index === 0;
  el('next').innerHTML = `${complete ? 'Pray again' : index === steps.length - 1 ? 'Finish rosary' : step.scripture ? 'Begin this decade' : 'Continue'} ${arrow}`;
  const percent = Math.round(index / steps.length * 100);
  el('progress-fill').style.width = `${percent}%`;
  document.querySelector('.progress-track')!.setAttribute('aria-valuenow', String(percent));
  el('save-status').textContent = storageAvailable ? 'Your place is saved on this device' : 'Saving is unavailable in this browser. Keep this page open to hold your place.';
  el('mystery-options').innerHTML = (Object.keys(mysteries) as MysterySet[]).map(key => `<button class="mystery-option ${key === set ? 'selected' : ''}" data-set="${key}" aria-pressed="${key === set}"><span>${mysteries[key].name} Mysteries<small>${mysteries[key].days}</small></span>${key === dailyMystery() ? '<span class="today-tag">TODAY</span>' : ''}<span aria-hidden="true">${key === set ? '✓' : '↗'}</span></button>`).join('');
  renderNotice();
  if (announce) el('announcement').textContent = complete ? 'Rosary complete. Go in peace.' : `${sectionNames[section]}. ${step.title}.${step.bead ? ` Hail Mary ${step.bead} of ${step.beads}.` : ''}`;
}
function navigate(nextIndex: number) {
  index = Math.max(0, Math.min(steps.length, nextIndex));
  resumeCandidate = undefined;
  noticeDismissed = true;
  saveProgress(); render(true);
  el('prayer').scrollIntoView({ block: 'start', behavior: 'instant' });
}
function closeDialogs() { document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(d => d.close()); }
function openDialog(id: string) {
  closeDialogs(); el<HTMLDialogElement>(id).showModal();
}
function selectSet(next: MysterySet, date = localDate(), step?: string) {
  set = next; sessionDate = date; steps = buildRosary(set, state.preferences.fatima);
  const saved = state.sessions.find(s => s.set === set && s.date === sessionDate);
  index = resolveStep(steps, step ?? saved?.step ?? 'opening-cross');
  resumeCandidate = undefined; noticeDismissed = false;
  closeDialogs(); render(true); el('prayer').focus();
}
el('next').addEventListener('click', () => index === steps.length ? openDialog('restart-dialog') : navigate(index + 1));
el('previous').addEventListener('click', () => navigate(index - 1));
app.addEventListener('click', event => {
  const target = (event.target as HTMLElement).closest<HTMLElement>('button, a');
  if (!target) return;
  if (target.dataset.dialog) openDialog(target.dataset.dialog);
  if (target.hasAttribute('data-close')) closeDialogs();
  if (target.dataset.section) { navigate(steps.findIndex(step => step.section === Number(target.dataset.section))); el('prayer').focus(); }
  if (target.dataset.set) selectSet(target.dataset.set as MysterySet);
  switch (target.dataset.action) {
    case 'today': event.preventDefault(); selectSet(dailyMystery()); break;
    case 'resume': if (resumeCandidate) selectSet(resumeCandidate.set, resumeCandidate.date, resumeCandidate.step); break;
    case 'dismiss': noticeDismissed = true; renderNotice(); break;
    case 'restart-prompt': openDialog('restart-dialog'); break;
    case 'restart': closeDialogs(); navigate(0); el('prayer').focus(); break;
  }
});
for (const id of ['theme', 'size', 'fatima'] as const) el(id).addEventListener('change', () => {
  const currentId = steps[index]?.id ?? 'complete';
  state.preferences = { theme: el<HTMLSelectElement>('theme').value as typeof state.preferences.theme, size: el<HTMLSelectElement>('size').value as typeof state.preferences.size, fatima: el<HTMLInputElement>('fatima').checked };
  steps = buildRosary(set, state.preferences.fatima); index = resolveStep(steps, currentId);
  persist(); applyPreferences(); render();
});
document.addEventListener('keydown', event => {
  if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || document.querySelector('dialog[open]')) return;
  if ((event.target as HTMLElement).closest('button, a, input, select, textarea, summary, [contenteditable="true"]')) return;
  if (window.getSelection()?.toString()) return;
  if ([' ', 'Enter', 'ArrowRight', 'ArrowLeft'].includes(event.key)) {
    event.preventDefault();
    if (event.key === 'ArrowLeft') navigate(index - 1);
    else if (index < steps.length) navigate(index + 1);
  }
});
document.addEventListener('visibilitychange', () => { if (!document.hidden && sessionDate !== localDate()) { noticeDismissed = false; renderNotice(); } });
el('print').addEventListener('click', () => {
  document.querySelectorAll<HTMLDetailsElement>('#prayers-dialog details').forEach(detail => detail.open = true);
  window.print();
});
applyPreferences(); render();
