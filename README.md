# 🧮 The Everything Calculator

A playful, AI-powered web app where you describe any calculator in plain English and get an instantly usable, interactive calculator — no coding required.

## ✨ Features

- **Natural-language input** — Describe any calculator (e.g. "tip calculator", "mortgage calculator") and it's built for you instantly.
- **Live calculations** — Edit input values and watch outputs update in real time, powered by [math.js](https://mathjs.org/).
- **Ephemeral & private** — No accounts, no saved data. Everything lives in your browser session.
- **Playful UI** — Gamified, animated interface with a deep-navy & coral theme built with Framer Motion.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+) & npm

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🛠 How It Works

1. **User enters a prompt** — e.g. "Calculate how much paint I need for a room"
2. **AI generates a calculator definition** — A backend function sends the prompt to an AI model, which returns a structured JSON schema describing inputs, outputs, and formulas.
3. **UI renders the calculator** — The app dynamically builds input fields and output displays from the JSON definition.
4. **Live evaluation** — As users change input values, [math.js](https://mathjs.org/) evaluates the formulas in real time and updates the outputs.

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Framer Motion |
| UI Components | shadcn/ui (Radix primitives) |
| Math Engine | math.js |
| AI Backend | Lovable Cloud (edge function + AI gateway) |
| Hosting | Lovable |

## 📁 Project Structure

```
src/
├── components/
│   ├── CalculatorCard.tsx   # Renders the generated calculator with live math
│   ├── ExampleChips.tsx     # Preset prompt suggestions
│   └── PromptInput.tsx      # Natural-language input bar
├── pages/
│   └── Index.tsx            # Main page with hero + calculator view
├── types/
│   └── calculator.ts        # TypeScript types for calculator definitions
└── integrations/
    └── supabase/            # Auto-generated client & types

supabase/
└── functions/
    └── generate-calculator/ # Edge function: prompt → AI → JSON calculator
```

## 📄 License

This project is private and not currently licensed for redistribution.
