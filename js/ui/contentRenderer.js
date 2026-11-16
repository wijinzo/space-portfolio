export class ContentRenderer {
  constructor(stations) {
    this.stations = stations;
    this.title = document.querySelector('#station-title');
    this.subtitle = document.querySelector('#station-subtitle');
    this.body = document.querySelector('#station-body');
    this.eyebrow = document.querySelector('#station-count');
    this.button = document.querySelector('#details-button');
    this.link = document.querySelector('#station-link');
    this.exploreActions = document.querySelector('#explore-actions');
    this.panel = document.querySelector('#detail-panel');
    this.panelTitle = document.querySelector('#detail-title');
    this.panelText = document.querySelector('#detail-text');
    this.panelLink = document.querySelector('#detail-link');
    this.close = document.querySelector('#close-details');
    this.lastFocus = null;
    this.activeIndex = -1;
    this.button.addEventListener('click', () => this.open(stations[this.activeIndex]));
    this.close.addEventListener('click', () => this.hide());
    document.querySelector('#detail-backdrop').addEventListener('click', () => this.hide());
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !this.panel.hidden) this.hide(); });
    this.panel.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const focusable = [...this.panel.querySelectorAll('button:not([hidden]),a:not([hidden])')].filter(el => el.getClientRects().length);
      if (!focusable.length) return;
      if (e.shiftKey && document.activeElement === focusable[0]) { e.preventDefault(); focusable.at(-1).focus(); }
      if (!e.shiftKey && document.activeElement === focusable.at(-1)) { e.preventDefault(); focusable[0].focus(); }
    });
  }
  setActive(index) {
    if (index === this.activeIndex) return;
    this.activeIndex = index;
    const station = this.stations[index];
    this.title.textContent = station.title;
    this.subtitle.textContent = station.subtitle || '';
    this.body.textContent = station.body;
    this.eyebrow.textContent = `${String(index + 1).padStart(2, '0')} / ${String(this.stations.length).padStart(2, '0')}`;
    this.link.hidden = !station.link?.href;
    if (station.link?.href) { this.link.href = station.link.href; this.link.textContent = station.link.label || '查看連結'; }
    this.button.textContent = index === this.stations.length - 1 ? '探索這顆星球' : '探索更多';
    this.exploreActions.replaceChildren();
    (station.exploreTargets || []).forEach(target => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'explore-chip';
      button.textContent = target.title;
      button.addEventListener('click', () => this.open(target));
      this.exploreActions.append(button);
    });
    if (!this.panel.hidden) this.hide();
  }
  open(station) {
    if (!station) return;
    this.lastFocus = document.activeElement;
    this.panelTitle.textContent = station.title;
    this.panelText.textContent = station.details || station.body;
    this.panelLink.hidden = !station.link?.href;
    if (station.link?.href) {
      this.panelLink.href = station.link.href;
      this.panelLink.textContent = station.link.label || '查看作品';
    }
    this.panel.hidden = false;
    document.body.classList.add('panel-open');
    this.close.focus();
  }
  hide() {
    if (this.panel.hidden) return;
    this.panel.hidden = true;
    document.body.classList.remove('panel-open');
    if (this.lastFocus?.isConnected) this.lastFocus.focus();
    this.lastFocus = null;
  }
}
