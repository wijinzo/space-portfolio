export class ProgressIndicator {
  constructor(stations, scrollController) {
    this.stations = stations;
    this.scroll = scrollController;
    this.current = document.querySelector('#progress-current');
    this.buttons = [];
    const nav = document.querySelector('#station-navigation');
    stations.forEach((station, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'station-dot';
      button.setAttribute('aria-label', `前往第 ${index + 1} 站：${station.title}`);
      button.title = station.title;
      button.addEventListener('click', () => this.scroll.jumpTo(index));
      nav.append(button); this.buttons.push(button);
    });
  }
  update(state) {
    // 目前介面使用站點圓點與百分比，不需要隱藏的進度條。
    this.current.textContent = `${Math.round(state.progress * 100)}%`;
    this.buttons.forEach((button, index) => {
      const active = index === state.index;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }
}
