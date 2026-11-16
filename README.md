# SPACE ODYSSEY — 太空旅行作品集

依據 `AGENTS.md` 製作的第一版互動作品集。採用 **原生 HTML / CSS / JavaScript ES Modules + Three.js 0.170.0 + Canvas 2D**，不需 npm、建置流程或後端。

## 本機啟動

在此資料夾執行：

```bash
python -m http.server 8000
```

開啟 `http://localhost:8000`。請勿直接以 `file://` 開啟 `index.html`，因瀏覽器對 ES Modules 存在安全限制。

Three.js 以固定版本 CDN 載入，首次預覽需連上網路；其餘作品圖片與字型如有新增，請放入 `assets/`。

## 操作

- **上下捲動**：依序進入七個站點，也能從終點倒退。
- **右側圓點**：直接跳到各站。
- **滑鼠移動**：些微 3D 視差；手機會停用。
- **點選火箭／衛星／大型小行星／氣態行星光點／深空星點**：開啟細節面板。
- **探索更多**：所有場景均提供可鍵盤操作的資訊入口。
- **Escape / 關閉按鈕**：離開詳情面板。
- **捲到最後**：3D 世界淡出，顯示 Canvas 2D 蠟筆手繪星球。向上捲動可返回。
- **減少動態模式**：系統偏好設為減少動態時，改用文字分段清單。

## 更新作品內容

若要擴充新站點，遵守 `AGENTS.md` 所述 `create(context)`、`update(context)`、`dispose(context)` 生命週期，並在 `js/core/stationManager.js` 註冊。


## V1.1：前三站互動強化

- 發射台：火箭引擎隨捲動逐漸點火，火箭升空、地面退後、排氣粒子浮動；可逆向還原。
- 大氣層：雲團多層位移與光跡，依捲動進度呈現穿越感。
- 地球軌道：三顆不同技能分類的衛星繞行地球，滑鼠 Hover 會高亮，點擊可開啟對應內容；手機與鍵盤可使用 HTML 技能按鈕。
- 修復隱藏的詳情面板與 2D Canvas 攔截 3D 點擊的問題。
- 技能衛星已填入「前端與互動」、「AI 與資料」、「系統與協作」，可在 `js/stations.js` 的 `exploreTargets` 編輯。

使用 `python -m http.server 8000` 或 `uv run python -m http.server 8000` 開啟本機預覽。

## V2：電影式互動旅程

- 新增 `js/core/cinematicDirector.js`：速度光跡、柔和過站光暈、飛行階段提示與閱讀區節奏。
- 改寫 `cameraPath.js`：保留進站/停靠/離站，加上曲線運鏡、鏡頭傾斜與視角動態。
- 保留原本的 7 站內容、可點擊物件、HTML 面板、無障礙替代內容與 2D 蠟筆結尾。
- 詳細互動分鏡與擴充規範請見 `CINEMATIC_DESIGN.md`。

**提示**：使用網頁的正常捲動（包含觸控板、滑鼠滾輪、手機觸控）即可完成整趟旅行；互動均為選擇性。
