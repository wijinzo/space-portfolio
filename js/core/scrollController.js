const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export class ScrollController {
  constructor(stations, root) {
    this.stations = stations;
    this.root = root;
    const sum = stations.reduce((n, s) => n + s.scrollLength, 0);
    let cursor = 0;
    this.ranges = stations.map(station => {
      const start = cursor;
      cursor += station.scrollLength / sum;
      return { id: station.id, start, end: cursor, center: (start + cursor) / 2 };
    });
    this.progress = 0;
    this.onScroll = () => { this.progress = this.read(); };
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll, { passive: true });
    this.onScroll();
  }
  read() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return clamp(window.scrollY / Math.max(maxScroll, 1));
  }
  getState() {
    const p = this.progress;
    let index = this.ranges.findIndex(r => p < r.end);
    if (index < 0) index = this.ranges.length - 1;
    const range = this.ranges[index];
    const localProgress = clamp((p - range.start) / (range.end - range.start));
    return { progress: p, index, station: this.stations[index], localProgress, range,
      phase: localProgress < 0.32 ? 'approach' : localProgress > 0.68 ? 'departure' : 'focus' };
  }
  jumpTo(index) {
    const range = this.ranges[index];
    if (!range) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: range.center * maxScroll, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  dispose() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  }
}
