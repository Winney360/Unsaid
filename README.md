# 🎭 UNSAID
### Emotional Translation Engine

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)
![Google Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-4285F4?logo=google&logoColor=white)

**Translate raw emotions into clear, respectful language.**  
_The bridge between what you feel and what you can say._

🚀 Live Demo · 📱 Video Demo · 💻 Development · 📄 Documentation

</div>

---

## 🎯 The Problem

Many people struggle to express difficult emotions clearly. When emotions overwhelm us, words often come out messy, confusing, or unintentionally hurtful — not because we intend harm, but because we lack the language to express complex feelings safely.

Existing tools fall short:
- Therapy apps require long-term commitment and diagnosis
- Journaling apps stop at writing, not communication
- AI chatbots give advice instead of clarity
- Few tools focus purely on emotional translation without judgment

---

## 💡 The Solution: UNSAID

**UNSAID** is an emotional translation engine — not a therapist, not an advisor, and not a chatbot.

It acts as a **linguistic bridge** between raw emotion and clear communication.

### How It Works
1. You express raw, unfiltered emotions  
2. UNSAID translates them into four safe formats  
3. You communicate clearly without losing authenticity  

---

## ✨ Core Features

### 1. Four-Way Emotional Translation

| Output | Purpose | Example |
|------|--------|--------|
| Clear Expression | Internal clarity | "I feel overwhelmed and need space" |
| Respectful Expression | Safe communication | "I'm experiencing intense feelings right now" |
| Detected Emotions | Emotional awareness | `["overwhelm", "anxiety", "loneliness"]` |
| Validation Message | Emotional acknowledgment | "Feeling overwhelmed is understandable" |

---

### 2. Safety-First Design
- No advice, diagnosis, or therapy
- Emotionally neutral AI responses
- Session-based anonymity
- Rate-limited API

---

### 3. Calming Experience Design
- Purple/blue color psychology
- Smooth, gentle animations
- Dark mode with deep purple backgrounds (`#1e1b4b`)
- Progressive disclosure

---

### 4. Smart History System
- Emotion-based filtering
- Pattern discovery
- One-click sharing
- Local-first storage

---

## 🏗️ Technical Architecture

```
Frontend (React + Vite)
        ↓
Backend (Node.js + Express)
        ↓
AI Engine (Google Gemini Pro)
        ↓
Database (MongoDB)
```

---

## 🧠 AI Safety Prompting

```js
const SAFETY_PROMPT = `
STRICT RULES:
- NO advice
- NO diagnosis
- NO therapy
ONLY translate raw emotion into:
- clearExpression
- respectfulExpression
- emotions[]
- validation
RETURN JSON ONLY.
`;
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/unsaid.git
cd unsaid
```

---

## ⚙️ Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/unsaid_db
GEMINI_API_KEY=your_api_key_here
USE_MOCK=true
```

---

## 🔒 Privacy & Boundaries

UNSAID is a communication clarity tool — not therapy, diagnosis, or crisis intervention.

No personal data is collected. Sessions are anonymous by default.

---

## 📄 License

MIT License

---

💜 Built with compassion, powered by AI
