import * as rocket from '../objects/rocket.js';
import * as atmosphere from '../objects/atmosphere.js';
import * as earth from '../objects/earth.js';
import * as asteroids from '../objects/asteroids.js';
import * as gasGiant from '../objects/gasGiant.js';
import * as deepSpace from '../objects/deepSpace.js';
const registry = { rocket, atmosphere, earth, asteroids, gasGiant, deepSpace };
export class StationManager {
  constructor(scene, stations, interactionManager, onDetails, callbacks = {}) {
    this.instances = stations.filter(s => s.scene !== 'finale').map(station => {
      const module = registry[station.scene];
      if (!module) throw new Error(`尚未註冊場景：${station.scene}`);
      const context = { scene, station, interactionManager, onDetails, ...callbacks };
      const instance = module.create(context);
      return { module, context, instance };
    });
  }
  update(state, deltaTime, elapsedTime, reduced) {
    for (let i = 0; i < this.instances.length; i++) {
      const item = this.instances[i];
      const distance = Math.abs(i - state.index);
      const visible = distance <= 1 && state.index < 6;
      item.instance.group.visible = visible;
      if (visible) item.module.update({ ...item.context, instance: item.instance,
        progress: state.progress, localProgress: i === state.index ? state.localProgress : i < state.index ? 1 : 0,
        deltaTime, elapsedTime, reduced });
    }
  }
  dispose() { this.instances.forEach(item => item.module.dispose({ ...item.context, instance: item.instance })); }
}
