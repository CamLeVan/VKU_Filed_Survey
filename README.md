# VKU Field Survey — Offline Data Collection (PWA & Capacitor)

**Học phần:** Cross-Platform Mobile App Development (VKU-MOB2026)  
**Trường:** Khoa Công Nghệ Thông Tin — Trường Đại Học CNTT & TT Việt - Hàn (VKU)  
**Giảng viên:** TS. Nguyễn Thanh Tuấn  
**Sinh viên thực hiện:** Lê Văn Cảm  
**Mini-Project #1** (Trọng số: 10%)

🌐 **Live Demo (Cloudflare Pages):** [https://vku-filed-survey.pages.dev](https://vku-filed-survey.pages.dev)  
💻 **GitHub Repository:** [https://github.com/CamLeVan/VKU_Filed_Survey.git](https://github.com/CamLeVan/VKU_Filed_Survey.git)

---

## 📌 Project Overview & Scenario

Campus facility inspectors and student auditors at VKU conduct on-site audits of classroom equipment, projectors, AC units, and electrical facilities in basements and remote campus buildings where Wi-Fi and mobile data signals are absent.

**VKU Field Survey** is an offline-first Progressive Web Application (PWA) with native Android Capacitor bridge integration. It guarantees 100% offline data capture, sub-second boot time via Service Worker Cache-First strategy, robust IndexedDB local persistence, and background sync upon network reconnection.

---

## 🚀 Key Features Checklist

- [x] **PWA Standalone Shell**: Configured with `manifest.json` (`display: standalone`, `theme_color: #0284c7`, responsive 192x192 & 512x512 maskable icons).
- [x] **Service Worker Caching**: Sub-second boot offline using Cache-First strategy for HTML, CSS, JS, and static assets.
- [x] **Offline Form & Local Draft Persistence**:
  - Multi-parameter facility audit form: Building, Floor, Room #, Category (Hardware, Projector, AC, Electrical, Furniture), 1–5 Star Condition Rating, Defect Notes, GPS Location, and Camera Photo.
  - Saved to IndexedDB (`VKUSurveyDB` v1) to prevent data loss on browser refresh or app restart.
- [x] **Offline Queue & Background Synchronization**:
  - Submissions tagged with unique UUID, timestamp, and saved as `PENDING_SYNC`.
  - Automatically flushes queue sequentially upon receiving `window.ononline` or Service Worker Background Sync event.
- [x] **Capacitor Native APK Compilation**:
  - Native integration of `@capacitor/camera`, `@capacitor/geolocation`, and `@capacitor/network`.
  - Transparent Web API fallbacks for desktop and mobile web browsers.

---

## 🏗️ Architecture & Project Structure

```
d:\VKU_learning\HK7\MultiFlatForm/
├── capacitor.config.ts         # Capacitor Native Android configuration
├── index.html                  # Responsive HTML5 PWA container & UI elements
├── manifest.json               # Web App Manifest for PWA installation
├── package.json                # Dependencies & CLI build scripts
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite bundler configuration
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   └── sw.js                   # Service Worker Cache-First strategy
└── src/
    ├── app.ts                  # Main UI controller & event orchestrator
    ├── main.ts                 # Application entry point & SW registration
    ├── style.css               # Modern glassmorphism UI design system
    ├── services/
    │   ├── db.ts               # Promise-based IndexedDB transaction wrapper
    │   ├── nativeService.ts    # Capacitor Camera/GPS/Network wrapper + Web fallbacks
    │   ├── swRegister.ts       # Service Worker registration helper
    │   └── syncManager.ts      # Online/Offline status listener & background queue
    └── types/
        └── survey.ts           # TypeScript interfaces (SurveyDraft, GeoLocationData, SyncStatus)
```

---

## 🛠️ Installation & Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm / yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/CamLeVan/VKU_Filed_Survey.git
cd VKU_Filed_Survey
npm install
```

### 2. Run Local Development Server (PWA Mode)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build Production Bundle
```bash
npm run build
npm run preview
```

### 4. Build Native Android APK via Capacitor
```bash
# Add Android platform
npx cap add android

# Sync built PWA assets to Android native project
npm run build
npx cap sync android

# Open project in Android Studio to build APK
npx cap open android
```

---

## 📄 License & Credits

Developed for VKU Cross-Platform Mobile App Development course.  
Open Educational Resources (CC BY-NC 4.0).
