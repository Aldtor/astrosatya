# 🪐 AstroSatya (Vedic Astrology Platform)

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-astrosatyaa.vercel.app-7928CA?style=for-the-badge&logo=vercel&logoColor=white)](https://astrosatyaa.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TanStack Start](https://img.shields.io/badge/FullStack-TanStack%20Start-FF4154?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

### **Modern Vedic Astrology & Astronomical Kundli Generation Engine across 20+ Indian Languages**

*Generate accurate North & South Indian Kundli birth charts, 36-guna Ashtakoot matchmaking, Vimshottari Dasha timelines, planetary degrees, and comprehensive dosha reports—100% ad-free with instant PDF exports.*

---

[Live Application](https://astrosatyaa.vercel.app/) • [Key Features](#-key-features) • [Astrological Engine](#-vedic-astrology-algorithms) • [Architecture](#-tech-stack--architecture) • [Getting Started](#-getting-started)

</div>

---

## 📌 Problem & Motivation

Traditional Vedic astrology platforms on the internet are plagued with heavy intrusive advertisements, outdated 1990s web interfaces, slow server computations, and paywalls for basic charts. Furthermore, regional language accessibility in Indian web applications is severely limited.

**AstroSatya** was engineered from the ground up to deliver a lightning-fast, privacy-conscious, and aesthetically stunning Vedic astrology suite. It calculates planetary positions, houses (Bhavas), planetary friendships, divisional charts, and matchmaking scores directly in the browser with full localization in over 20 Indian languages.

---

## ✨ Key Features

- 🌌 **Dual Kundli Chart Generator:** Renders both **North Indian (Diamond)** and **South Indian (Square)** birth chart formats dynamically with house cusps and planetary aspects.
- 🪐 **Planetary Positions & Ephemeris:** Computes exact planetary degrees, retrograde states, Nakshatras, Padas, and lordships (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu).
- 💑 **36-Guna Ashtakoot Matchmaking:** Full Milan scoring system calculating all 8 Kootas (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi).
- ⏳ **Vimshottari Dasha Timelines:** Detailed Mahadasha, Antardasha, and Pratyantardasha predictive periods calculated down to exact transit dates.
- ⚡ **Dosha Analysis Engine:** Instant identification of Mangal Dosha (Kuja Dosha), Kaal Sarp Dosha, and Sade Sati transit phases with traditional remedial insights.
- 🇮🇳 **20+ Indian Languages:** Full multilingual support across Hindi, Sanskrit, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, and more.
- 📄 **Instant PDF Export:** Generates high-resolution, beautifully formatted multi-page astrological Kundli reports using client-side `jspdf`.
- 🎡 **Interactive Zodiac Wheel:** Animated celestial transit visualization rendered with smooth SVG physics and responsive charts.

---

## 📐 Vedic Astrology Algorithms

```
AstroSatya Computation Engine
├── Input Normalization (Date, Time, Latitude, Longitude, Timezone)
├── Ayanamsa Adjustment (Lahiri / Chitrapaksha)
├── Planetary Longitudes & House System (Bhava Sphuta)
├── Kundli Rendering (North Indian Diamond & South Indian Grid)
├── Ashtakoot Guna Milan (Max Score: 36 Points)
│   ├── Nadi (8 pts) • Bhakoot (7 pts) • Gana (6 pts) • Maitri (5 pts)
│   └── Yoni (4 pts) • Tara (3 pts) • Vasya (2 pts) • Varna (1 pt)
└── Dasha Hierarchy Calculation (120-year Vimshottari Cycle)
```

---

## 🛠️ Tech Stack & Architecture

- **Framework:** TanStack Start (`@tanstack/react-start`) + React 19.2
- **Language:** TypeScript 5.x with rigorous mathematical typing
- **Styling:** Tailwind CSS v4 + Radix UI Primitives (`@radix-ui/react-*`)
- **Data Visualization:** Recharts 2.15 + Custom SVG Celestial Canvas
- **Document Generation:** jsPDF for client-side PDF synthesis
- **Icons & UI:** Lucide React, Embla Carousel
- **Routing:** TanStack Router with file-based architecture

---

## 📁 Project Structure

```
astrosatya/
├── src/
│   ├── routes/             # TanStack Start file-based routing
│   │   ├── __root.tsx      # Global layout, i18n switcher & theme wrapper
│   │   ├── index.tsx       # Landing page & quick horoscope calculator
│   │   ├── kundli.tsx      # Full Kundli generator & PDF export suite
│   │   ├── matchmaking.tsx # 36-Guna Ashtakoot compatibility engine
│   │   └── horoscope.tsx   # Daily/weekly planetary transit forecasts
│   ├── components/         # Kundli chart renderers, zodiac wheels, forms
│   │   └── ui/             # Radix-powered accessible UI library
│   ├── lib/                # Vedic mathematical algorithms, ephemeris logic, i18n dictionaries
│   └── styles.css          # Theme tokens, gradient definitions, cosmic animations
├── public/                 # Static assets & manifest
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm / pnpm / bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aldtor/astrosatya.git
   cd astrosatya
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Build production bundle:**
   ```bash
   npm run build
   ```

---

## 👤 Author

**Satyam Kumar (Aldtor)**
- 🌐 Portfolio: [aldtor.vercel.app](https://aldtor.vercel.app)
- 🐙 GitHub: [@Aldtor](https://github.com/Aldtor)
- 💼 LinkedIn: [linkedin.com/in/aldtor](https://in.linkedin.com/in/aldtor)

---

<div align="center">
  <sub>Engineered with precision for ancient Vedic wisdom and modern web speed.</sub>
</div>
