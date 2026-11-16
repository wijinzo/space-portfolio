import { stations } from './stations.js';
import { ScrollController } from './core/scrollController.js';
import { ContentRenderer } from './ui/contentRenderer.js';
import { ProgressIndicator } from './ui/progressIndicator.js';
import { HandDrawnPlanet } from './finale/handDrawnPlanet.js';
import { CinematicDirector } from './core/cinematicDirector.js';
import { StarSparkles } from './ui/starSparkles.js';

const stage = document.querySelector('#journey-stage');
const journeyHeight = document.querySelector('#journey-height');
const fallback = document.querySelector('#webgl-fallback');
const fallbackContent = document.querySelector('#fallback-content');
const media = matchMedia('(prefers-reduced-motion: reduce)');

// 無障礙與 WebGL 故障時提供不依賴 3D 的完整站點內容。
function buildFallback(onExplore) {
  fallbackContent.replaceChildren();
  stations.forEach((station, i) => {
    const article = document.createElement('article');
    const heading = document.createElement('h2');
    const description = document.createElement('p');
    const details = document.createElement('p');
    heading.textContent = `${i + 1}. ${station.title}`;
    description.textContent = station.body;
    details.textContent = station.details || '';
    article.append(heading, description, details);
    if (station.link?.href) {
      const link = document.createElement('a');
      link.href = station.link.href; link.textContent = station.link.label || '查看作品';
      link.target = '_blank'; link.rel = 'noopener noreferrer'; article.append(link);
    }
    if (onExplore) {
      const button = document.createElement('button');
      button.textContent = '前往這個站點';
      button.addEventListener('click', () => onExplore(i));
      article.append(button);
    }
    fallbackContent.append(article);
  });
}

async function start() {
  const scroll = new ScrollController(stations, journeyHeight);
  const content = new ContentRenderer(stations);
  const indicator = new ProgressIndicator(stations, scroll);
  buildFallback(i => scroll.jumpTo(i));
  document.querySelector('#home-button').addEventListener('click', e => {
    e.preventDefault(); scroll.jumpTo(0);
  });
  const finale = new HandDrawnPlanet(document.querySelector('#finale-canvas'), () => content.open(stations.at(-1)));
  const paper = document.querySelector('#finale-paper');

  function updateFallbackMode() {
    document.body.classList.toggle('reduced-mode', media.matches);
    if (media.matches) { fallback.hidden = false; journeyHeight.style.display = 'none'; }
    else { fallback.hidden = true; journeyHeight.style.display = ''; }
  }
  updateFallbackMode();
  media.addEventListener('change', updateFallbackMode);

  // Three.js 使用 importmap 固定版本，不依賴 npm 或打包工具。
  let threeScene, manager, interaction, cameraPath, director;
  const sparkles = new StarSparkles(document.querySelector('#sparkle-layer'));
  let launchPending = false;
  let launchTimeout = null;
  function startWildLaunch() {
    if (launchPending || media.matches) return;
    launchPending = true;
    document.querySelector('#flight-status').textContent = 'ROCKET / OUT OF CONTROL!';
    // 點擊後先播放失控飛行，再由原本的 scroll controller 前往下一站。
    launchTimeout = window.setTimeout(() => { scroll.jumpTo(1); launchPending = false; }, 1600);
  }
  try {
    const [{ createScene }, { CameraPath }, { StationManager }, { InteractionManager }] = await Promise.all([
      import('./core/scene.js'), import('./core/cameraPath.js'),
      import('./core/stationManager.js'), import('./core/interactionManager.js'),
    ]);
    threeScene = createScene(document.querySelector('#space-canvas'));
    interaction = new InteractionManager(threeScene.camera, threeScene.renderer.domElement);
    manager = new StationManager(threeScene.scene, stations, interaction,
      station => content.open(station), { onRocketLaunch: startWildLaunch });
    interaction.onEmptyClick = event => {
      if (!media.matches && scroll.getState().index < stations.length - 1) sparkles.burst(event.clientX, event.clientY);
    };
    cameraPath = new CameraPath(threeScene.camera, stations);
    director = new CinematicDirector(threeScene.scene, threeScene.camera, stage);
  } catch (error) {
    console.error('WebGL 初始化失敗，切換至文字模式。', error);
    document.body.classList.add('reduced-mode');
    fallback.hidden = false; journeyHeight.style.display = 'none';
    fallback.querySelector('p').textContent = '3D 場景無法載入，以下提供完整文字版本。';
    return;
  }
  // 離開發射台後允許再次回頭觸發火箭，不使用一次性狀態。
  const isTouch = matchMedia('(pointer: coarse)').matches;
  function onPointer(e) {
    if (isTouch || media.matches) return;
    cameraPath.setPointer((e.clientX / innerWidth - 0.5) * 2, (e.clientY / innerHeight - 0.5) * -2);
  }
  window.addEventListener('pointermove', onPointer, { passive: true });
  let previous = performance.now(), elapsedTime = 0;
  const smooth = value => { const x = Math.max(0, Math.min(1, value)); return x * x * (3 - 2 * x); };
  cameraPath.snap(scroll.getState());

  function animate(now) {
    requestAnimationFrame(animate);
    const deltaTime = Math.min((now - previous) / 1000, 0.08); previous = now;
    if (!media.matches) elapsedTime += deltaTime;
    const state = scroll.getState();
    if (state.index !== 0 && launchTimeout) {
      clearTimeout(launchTimeout); launchTimeout = null; launchPending = false;
      manager.instances[0]?.instance.resetFlight();
    }
    content.setActive(state.index);
    indicator.update(state);
    const lastRange = scroll.ranges.at(-1);
    const finalTransition = smooth((state.progress - lastRange.start + 0.014) / (lastRange.end - lastRange.start) * 2.4);
    const onPaper = finalTransition > 0.68;
    stage.classList.toggle('finale-mode', onPaper);
    paper.style.opacity = finalTransition;
    finale.setOpacity(finalTransition);
    finale.render(elapsedTime, media.matches);
    if (media.matches) { director.update(state, { reduced: true, finaleBlend: finalTransition }); return; }
    cameraPath.update(state, deltaTime, false);
    director.update(state, { finaleBlend: finalTransition });
    // 轉場期間仍保留深空畫面，避免切換時出現黑屏。
    const renderState = state.index === stations.length - 1 ? { ...state, index: stations.length - 2 } : state;
    manager.update(renderState, deltaTime, elapsedTime, false);
    interaction.setActive([state.station.id]);
    if (finalTransition < 0.995) threeScene.renderer.render(threeScene.scene, threeScene.camera);
  }
  requestAnimationFrame(animate);
}
start().catch(error => {
  console.error('網站初始化失敗：', error);
  document.body.classList.add('reduced-mode');
  fallback.hidden = false;
  buildFallback();
});
