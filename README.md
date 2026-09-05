# Authentiq

Authentiq is an advanced AI-powered forensic analysis tool designed to detect AI-generated media, digital manipulation, deepfakes, and contextual inconsistencies. By leveraging cutting-edge Google Gemini vision models, Authentiq provides probability-based analysis on user-uploaded media and YouTube links.

## ✨ Features

- **Advanced Media Forensics**: Analyzes images for visual anomalies, structural inconsistencies, and AI generation artifacts.
- **YouTube Link Detection**: Automatically parses YouTube URLs, extracts the highest resolution thumbnail frame, and performs real-time AI analysis.
- **API Key & Model Rotation Pool**: Built-in architecture that automatically cycles through multiple Gemini models (`gemini-2.5-flash`, `gemini-1.5-pro`, etc.) and API keys. This seamlessly bypasses free-tier rate limits (429 errors) and prevents the app from crashing during high-traffic investigations.
- **Dynamic Dashboard**: A beautiful, dark-themed UI built with React and Framer Motion that presents confidence scores, severity badges, and detailed forensic findings.
- **Robust Fallback Mechanism**: If external APIs fail or an unsupported media format is provided, the system degrades gracefully and provides a localized analysis report without breaking the user experience.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, Multer (for memory-based file uploads)
- **AI Integration**: `@google/genai` (Google Gemini SDK)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- One or more [Google Gemini API Keys](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Joshwin-James/Authentiq.git
   cd Authentiq
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Configuration:**
   Create a `.env` file in the root directory (alongside `package.json`) and add your Gemini API keys as a comma-separated list:
   ```env
   EXTERNAL_API_KEYS=YOUR_API_KEY_1,YOUR_API_KEY_2,YOUR_API_KEY_3
   PORT=3001
   ```

### Running the App Locally

You need to run both the frontend development server and the Node.js backend.

1. **Start the Backend Server (Terminal 1):**
   ```bash
   cd server
   node index.js
   ```

2. **Start the Frontend Application (Terminal 2):**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173/`.

## 🧠 How the AI Rotation Pool Works

To prevent `503 Service Unavailable` and `429 Quota Exhausted` errors on the free tier, the backend uses a robust rotation loop. 
If `gemini-3.6-flash` is exhausted on Key 1, it automatically attempts `gemini-1.5-pro` on Key 1. If all models fail on Key 1, it immediately pivots to Key 2, ensuring seamless uptime and analysis without interrupting the user.

## ⚖️ Disclaimer
Authentiq provides probability-based analysis and technical indicators. It does not guarantee absolute authenticity. Always review the contextual evidence carefully before making definitive judgements.
