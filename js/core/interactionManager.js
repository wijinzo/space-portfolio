import * as THREE from 'three';

/** 所有場景共用同一套 Raycaster、拖曳與空白點擊事件。 */
export class InteractionManager {
  constructor(camera, domElement) {
    this.camera = camera;
    this.element = domElement;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.targets = new Map();
    this.active = new Set();
    this.hovered = null;
    this.down = null;
    this.dragging = null;
    this.onEmptyClick = null;
    this.onMove = event => {
      this.setPointer(event);
      if (this.down && this.dragging) {
        const dx = event.clientX - this.down.lastX;
        const dy = event.clientY - this.down.lastY;
        if (Math.hypot(event.clientX - this.down.x, event.clientY - this.down.y) > 6) this.down.moved = true;
        this.dragging.entry.onDrag?.({ dx, dy, event, intersection: this.dragging.intersection });
        this.down.lastX = event.clientX;
        this.down.lastY = event.clientY;
        return;
      }
      const result = this.hit();
      const target = result?.entry || null;
      if (target !== this.hovered) {
        this.hovered?.onHover?.(false);
        this.hovered = target;
        target?.onHover?.(true);
        this.element.style.cursor = target ? (target.onDrag ? 'grab' : 'pointer') : 'crosshair';
      }
      target?.onPointerMove?.(result.intersection, event);
    };
    this.onDown = event => {
      if (event.button !== 0) return;
      this.setPointer(event);
      const result = this.hit();
      this.down = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false };
      if (result?.entry.onDrag) {
        this.dragging = result;
        this.element.setPointerCapture?.(event.pointerId);
        this.element.style.cursor = 'grabbing';
        result.entry.onDragStart?.(result.intersection, event);
      }
    };
    this.onUp = event => {
      if (!this.down || event.pointerId !== this.down.id) return;
      const down = this.down;
      const dragging = this.dragging;
      this.down = null;
      this.dragging = null;
      if (this.element.hasPointerCapture?.(event.pointerId)) this.element.releasePointerCapture(event.pointerId);
      this.element.style.cursor = 'auto';
      dragging?.entry.onDragEnd?.(event);
      if (down.moved || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 12) return;
      this.setPointer(event);
      const result = this.hit();
      if (result) result.entry.onClick?.(result.intersection, event);
      else this.onEmptyClick?.(event);
    };
    this.onCancel = event => {
      if (this.down?.id !== event.pointerId) return;
      this.dragging?.entry.onDragEnd?.(event);
      this.down = null; this.dragging = null; this.element.style.cursor = 'auto';
    };
    domElement.addEventListener('pointermove', this.onMove);
    domElement.addEventListener('pointerdown', this.onDown);
    domElement.addEventListener('pointerup', this.onUp);
    domElement.addEventListener('pointercancel', this.onCancel);
  }
  setPointer(event) {
    const b = this.element.getBoundingClientRect();
    this.pointer.set(((event.clientX - b.left) / b.width) * 2 - 1, -((event.clientY - b.top) / b.height) * 2 + 1);
  }
  register(stationId, key, objects, onClick, onHover, options = {}) {
    const token = `${stationId}:${key}`;
    if (this.targets.has(token)) throw new Error(`互動重複註冊：${token}`);
    this.targets.set(token, { stationId, objects: Array.isArray(objects) ? objects : [objects], onClick, onHover, ...options });
    return () => { this.targets.delete(token); };
  }
  setActive(ids) {
    this.active = new Set(ids);
    if (this.hovered && !this.active.has(this.hovered.stationId)) {
      this.hovered.onHover?.(false); this.hovered = null; this.element.style.cursor = 'auto';
    }
  }
  hit() {
    const entries = [...this.targets.values()].filter(t => this.active.has(t.stationId));
    if (!entries.length) return null;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersections = this.raycaster.intersectObjects(entries.flatMap(t => t.objects), true);
    for (const intersection of intersections) {
      const entry = entries.find(t => t.objects.some(object => isDescendant(intersection.object, object)));
      if (entry) return { entry, intersection };
    }
    return null;
  }
  dispose() {
    const el = this.element;
    el.removeEventListener('pointermove', this.onMove);
    el.removeEventListener('pointerdown', this.onDown);
    el.removeEventListener('pointerup', this.onUp);
    el.removeEventListener('pointercancel', this.onCancel);
    this.targets.clear();
  }
}
function isDescendant(object, ancestor) {
  while (object) { if (object === ancestor) return true; object = object.parent; }
  return false;
}
