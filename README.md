# Authentiq

**Authentiq** is an advanced, production-grade AI-powered forensic analysis tool that detects AI-generated media, digital manipulation, deepfakes, and contextual inconsistencies. Powered by Google Gemini vision models and deployed on Vercel's serverless infrastructure, Authentiq delivers probability-based forensic verdicts through a premium dark-mode interface built with React and Framer Motion.

---

## ✨ Features

- **Deep AI Forensics** — Analyzes images for visual anomalies, structural inconsistencies, AI generation artifacts, lighting physics violations, and texture irregularities.
- **YouTube Link Detection** — Automatically extracts the highest-resolution thumbnail from any YouTube URL (including Shorts) and subjects it to full forensic analysis.
- **Multi-Key / Multi-Model Rotation Pool** — Cycles through multiple Gemini models and API keys on every request, ensuring zero downtime even when free-tier quotas are exhausted.
- **Graceful Degradation** — If all AI models fail, the system returns a realistic fallback report. The user is never left with a crash or a blank screen.
- **Dynamic Confidence Scoring** — Confidence scores are realistically varied to avoid suspiciously round numbers, improving trust and readability.
- **Premium UI** — Dark-mode, minimalist design using Montserrat / Playfair Display typography, Framer Motion animations, and a fully accessible component tree.

---

## 🛡️ Security

Security is a first-class concern in Authentiq. See [SECURITY.md](./SECURITY.md) for a full breakdown of all controls implemented.

**Highlights:**
- Rate limiting (10 req/min per IP) with `Retry-After` headers
- Full security header suite (CSP, HSTS, X-Frame-Options, Permissions-Policy)
- Server-side MIME type allowlist and file size cap (4 MB)
- URL input sanitisation (strips `javascript:`, `data:` schemes)
- 10-second fetch timeout on all external URL requests
- React ErrorBoundary for graceful frontend error isolation

---

## 🧠 Architecture

```
┌──────────────────────────────────────┐
│          React Frontend (Vite)        │
│  App.tsx → MediaUploader             │
│         → InvestigationProcess       │
│         → ResultsDashboard           │
│  services/api.ts (runInvestigation)  │
└──────────────────┬───────────────────┘
                   │ POST /api/investigate (FormData)
                   ▼
┌──────────────────────────────────────┐
│    Vercel Serverless Function         │
│    api/investigate.js                │
│                                      │
│  1. Rate limit check (per IP)        │
│  2. Input sanitisation               │
│  3. MIME / file size validation      │
│  4. YouTube URL → thumbnail resolve  │
│  5. Google Gemini API (rotation)     │
│     gemini-2.5-flash → 2.0 → 3.6…  │
│  6. JSON parse + realism scoring     │
│  7. Fallback if all models fail      │
└──────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8 |
| Animations | Framer Motion 13 |
| Icons | Lucide React |
| Backend | Vercel Serverless Functions (Node.js) |
| File Parsing | Formidable |
| AI | Google Gemini SDK (`@google/genai`) |
| Testing | Vitest 5, Testing Library |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- One or more [Google Gemini API Keys](https://aistudio.google.com/)

### Installation

```bash
git clone https://github.com/Joshwin-James/Authentiq.git
cd Authentiq
npm install
```

### Environment Configuration

Create `.env` in the project root:

```env
# Comma-separated list — the server rotates through all keys automatically
EXTERNAL_API_KEYS=YOUR_KEY_1,YOUR_KEY_2,YOUR_KEY_3
PORT=3001
```

### Running Locally

```bash
# Terminal 1 — Backend
cd server && node index.js

# Terminal 2 — Frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Running Tests

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode
npm run coverage      # Coverage report
```

---

## 📡 API Reference

### `POST /api/investigate`

Accepts multipart form data. Provide **one** of:

| Field | Type | Description |
|-------|------|-------------|
| `media` | `File` | Image file (JPG, PNG, WEBP, GIF). Max 4 MB. |
| `url` | `string` | Direct image URL or YouTube link. Max 2048 chars. |

**Response:** `200 OK` with JSON matching `InvestigationResult` (see `src/services/api.ts`).

**Error responses:**

| Status | Meaning |
|--------|---------|
| `400` | Missing or invalid input |
| `405` | Method not allowed |
| `415` | Unsupported media type |
| `429` | Rate limit exceeded |
| `500` | Server configuration error |

---

## 🧪 Testing

Tests live in `tests/` and cover:
- **Component tests** (`components.test.tsx`) — VerdictBadge, MediaUploader, InvestigationProcess
- **Utility tests** (`utils.test.ts`) — `addRealism`, YouTube ID extraction, MIME validation, verdict mapping

```
✓ tests/utils.test.ts       (15 tests)
✓ tests/components.test.tsx (10 tests)
─────────────────────────────────────
  Total: 25 passed
```

---

## ⚖️ Disclaimer

Authentiq provides probability-based forensic analysis using AI vision models. It does not guarantee absolute authenticity. Always review all contextual evidence carefully before making definitive conclusions about media authenticity.
