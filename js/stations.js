// 內容依先前核對的自傳與履歷整理；首頁以 GitHub 帳號署名。
export const stations = [
  {
    "id": "launch_pad",
    "title": "WIJINZO",
    "subtitle": "01 / THE BEGINNING",
    "body": "從需求出發，把想法做成系統。點擊火箭尾焰，或往下捲動，開始我的探索旅程。",
    "details": "我是 wijinzo，一名持續探索軟體開發、系統整合與生成式 AI 的資管系學生。從程式實作到使用者體驗，從資料清洗到模型評估，我關心一個想法如何成為能被使用、驗證與持續改進的系統。這段旅程，記錄我在專案中學會的事。",
    "scene": "rocket",
    "scrollLength": 1.2,
    "camera": {
      "position": {
        "x": 0,
        "y": 4,
        "z": 10
      },
      "target": {
        "x": 0,
        "y": 0,
        "z": -16
      }
    },
    "interaction": {
      "type": "click",
      "target": "rocket",
      "action": "openDetails"
    }
  },
  {
    "id": "atmosphere",
    "title": "WHO I AM",
    "subtitle": "02 / ABOUT ME",
    "body": "資管背景，探索生成式 AI，也關心使用者如何理解並使用系統。",
    "details": "剛進入資管系時，我把技術理解為把程式寫出來。接觸資料結構、資料庫與網路通訊後，我開始理解完整系統的運作，也在專案中學會拆解問題與調整分工。大三下通過人工智慧應用學位學程雙主修申請，讓我更確定持續投入 AI 的方向。我希望兼顧需求、資料品質與驗證方法，讓做出的系統真正回應使用情境。",
    "scene": "atmosphere",
    "scrollLength": 1.2,
    "camera": {
      "position": {
        "x": 0,
        "y": 3,
        "z": -28
      },
      "target": {
        "x": 0,
        "y": 0,
        "z": -52
      }
    },
    "interaction": {
      "type": "pointer",
      "target": "clouds",
      "action": "parallax"
    }
  },
  {
    "id": "orbit",
    "title": "MY TOOLKIT",
    "subtitle": "03 / SKILLS",
    "body": "以系統開發為基礎，串接資料與 AI。拖曳地球、滑過海面，再點擊衛星探索技能。",
    "details": "我曾在專案中使用 Python、Java、SQL 與 Node.js，並以 HTML、CSS、JavaScript 製作互動介面。AI 應用涵蓋 LangChain、LangGraph、LlamaIndex、RAG 與 API 串接；資料處理包含爬蟲、清洗、Chunk 切割與 Embedding。系統整合使用過 FastAPI、SQLite、MySQL、Gradio 與 Streamlit，並以 Git／GitHub 協作。我也透過 Figma 梳理雛型流程，學習以 AUC 與混淆矩陣評估模型；這些都是實作與持續學習的工具，熟悉程度隨專案累積。",
    "exploreTargets": [
      {
        "title": "前端與互動",
        "details": "使用 HTML、CSS、JavaScript 製作互動介面，在實習專案中串起素材選取、腳本生成與歷史查看流程。曾在 ESG 抓寶地圖專案以 Figma 製作雛型，梳理操作流程與介面狀態；在親子專注 App 中主要負責互動設計，希望降低操作心力，讓孩子在任務、回饋與願望機制中找到持續參與的動力。"
      },
      {
        "title": "AI 與資料",
        "details": "曾使用 LangChain、LangGraph、LlamaIndex 與 RAG，實作資料蒐集、清洗、Chunk 切割、Embedding 與語意檢索，並串接大型語言模型 API。從金融阻詐到 Multi-Agent 投資助理，持續探索資料與模型的整合；也嘗試 Proposer-Critic 評估與修正流程，並學習以 AUC、混淆矩陣檢視模型表現。"
      },
      {
        "title": "系統與協作",
        "details": "曾在專案使用 Python、Java、SQL、Node.js，以及 FastAPI、SQLite、MySQL、Gradio 與 Streamlit，累積 API 串接與前後端整合經驗，透過 Git／GitHub 進行版本控制與協作。在團隊中，我重視拆解問題、調整分工與需求收斂，讓功能設計回應明確的使用情境。這些能力都來自專案實作，並隨持續學習逐步深化。"
      }
    ],
    "scene": "earth",
    "scrollLength": 1.35,
    "camera": {
      "position": {
        "x": 0,
        "y": 3,
        "z": -64
      },
      "target": {
        "x": 0,
        "y": 0,
        "z": -88
      }
    },
    "interaction": {
      "type": "click",
      "target": "satellite",
      "action": "openDetails"
    }
  },
  {
    "id": "asteroid_belt",
    "title": "金融阻詐",
    "subtitle": "04 / AI FRAUD DETECTION",
    "body": "結合語音轉文字、歷史案例檢索與 LLM，探索臨櫃情境中的詐騙風險。",
    "details": "在金融阻詐語音辨識專案中，我們從詐騙案例進行資料清洗，篩選符合臨櫃情境的資料，並建立 RAG 知識庫。流程透過 Whisper 將語音轉為文字，以 LlamaIndex 與 Embedding 檢索相似案例，再串接 Gemini API 判斷情境與風險。在每週與教授討論及成果製作的過程中，我學習以 AUC、混淆矩陣與不同門檻設定檢視表現。這段經驗讓我體會，系統能運作只是起點，資料品質與驗證方式才是判斷成果是否可信的依據。",
    "scene": "asteroids",
    "scrollLength": 1.55,
    "camera": {
      "position": {
        "x": 0,
        "y": 2,
        "z": -100
      },
      "target": {
        "x": 0,
        "y": 0,
        "z": -124
      }
    },
    "interaction": {
      "type": "click",
      "target": "featuredAsteroid",
      "action": "openDetails"
    },
    "link": {
      "label": "查看金融阻詐專案",
      "href": "https://github.com/wijinzo/AI_Fraud_Detection"
    }
  },
  {
    "id": "gas_giant",
    "title": "科學企劃自動化",
    "subtitle": "05 / PANKNOWLEDGE INTERNSHIP",
    "body": "將素材搜尋與企劃轉化為 AI 輔助系統。拖曳旋轉行星，或點擊發光熱點探索作品。",
    "details": "在泛科知識實習期間，我參與科學文本自動化搜索引擎及儀表盤專案，將主編從跨領域素材搜尋到腳本構思的工作流程，轉化為可操作的系統。專案整合時事、科學與社群素材，使用 FastAPI、SQLite、LangChain 與原生網頁介面，串起資料蒐集、素材選取、內容生成與歷史查看。我也嘗試 Proposer-Critic 機制，讓生成內容經過額外評估與修正。這次實習讓我更重視需求收斂，以及如何降低使用者的操作門檻。",
    "scene": "gasGiant",
    "scrollLength": 1.55,
    "camera": {
      "position": {
        "x": 0,
        "y": 3,
        "z": -136
      },
      "target": {
        "x": 0,
        "y": 0,
        "z": -160
      }
    },
    "interaction": {
      "type": "click",
      "target": "planetHotspot",
      "action": "openDetails"
    },
    "link": {
      "label": "查看科學企劃專案",
      "href": "https://github.com/wijinzo/inspiration-system"
    }
  },
  {
    "id": "deep_space",
    "title": "MILESTONES",
    "subtitle": "06 / EXPERIENCE",
    "body": "從課程實作、AI 專案到企業實習，逐步學會連結技術、需求與驗證。",
    "details": "學習起點｜在資料結構專案中，與另一位組員共同完成主要功能，學會拆解問題與重新安排工作。需求與雛型｜在 ESG 抓寶地圖專案負責系統雛型，以 Figma 梳理操作流程並協助團隊對齊想法。AI 探索｜從金融阻詐延伸到 Multi-Agent 投資助理，嘗試由 Router 分派基本面、技術面與新聞任務。企業實習｜2026 年 3 至 6 月，在泛科知識參與科學企劃自動化系統。畢業專題｜參與親子專注管理 App，提出重新檢視需求的建議，與團隊共同收斂定位，並主要負責互動設計。下一步，我希望深化研究方法與實驗設計，持續探索可靠 AI。",
    "scene": "deepSpace",
    "scrollLength": 1.35,
    "camera": {
      "position": {
        "x": 0,
        "y": 3,
        "z": -172
      },
      "target": {
        "x": 0,
        "y": 0,
        "z": -196
      }
    },
    "interaction": {
      "type": "click",
      "target": "milestone",
      "action": "openDetails"
    }
  },
  {
    "id": "finale",
    "title": "STAY IN TOUCH",
    "subtitle": "07 / THE NEXT CHAPTER",
    "body": "如果你也關心 AI 如何回應真實需求，歡迎從我的 GitHub 認識更多作品。",
    "details": "謝謝你走完這段旅程。從金融阻詐、科學企劃自動化到親子互動，我持續學習把需求、資料與技術串起來，也希望讓每一次實作成為下一個問題的起點。歡迎透過下方 GitHub 連結查看程式與專案；若有相關的研究或開發想法，期待未來有交流的機會。",
    "scene": "finale",
    "scrollLength": 1.6,
    "interaction": {
      "type": "click",
      "target": "handDrawnHouse",
      "action": "openDetails"
    },
    "link": {
      "label": "前往我的 GitHub",
      "href": "https://github.com/wijinzo"
    }
  },
];
