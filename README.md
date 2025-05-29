# OptionXI Web – Open Source Virtual Trading Platform

[![Build](https://github.com/optionxi/optionxi-webapp-community/actions/workflows/build.yml/badge.svg)](https://github.com/optionxi/optionxi-web/actions/workflows/build.yml)
![TruffleHog Scan](https://github.com/optionxi/optionxi-webapp-community/actions/workflows/trufflehog.yml/badge.svg)
[![Gitleaks Scan](https://github.com/optionxi/optionxi-webapp-community/actions/workflows/gitleaks.yml/badge.svg)](https://github.com/optionxi/optionxi-webapp-community/actions/workflows/gitleaks.yml)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/optionxi/optionxi-webapp-community?utm_source=oss&utm_medium=github&utm_campaign=optionxi%2Foptionxi-webapp-community&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

**OptionXI Web** is **India's first open-source virtual trading platform** — now available as a responsive **web application** built with **Next.js** and **Supabase**.

> ⚠️ *This repository contains the source code for the **web version** of OptionXI. The Flutter mobile app is available in [optionxi-flutter-community](https://github.com/optionxi/optionxi-flutter-community).*
> Visit the live app here: [https://app.optionxi.com](https://app.optionxi.com)

---

## 🌟 [Web App Preview](https://app.optionxi.com)


![Feature Image](screenshots/webapp-optionxi.png)

🔗 [Click here to see the web app](https://app.optionxi.com)

---

## 🚀 What is OptionXI?

**OptionXI** is a powerful, easy-to-use virtual trading platform that uses **real Indian stock market data**. Whether you're a beginner or an experienced trader, OptionXI provides an educational space to:

* Practice trades with no financial risk
* Test out trading strategies
* Learn and contribute to a transparent, open-source ecosystem

---

## 🔑 Key Features

* ✅ **Virtual Trading**

  * Simulate trades in NIFTY 50, BankNIFTY, and Options
  * Based on real or previous day market data
  * Paper trading and backtesting capabilities

* 📊 **Stock Screeners**

  * Scan stocks by volume, performance, or price movement
  * Discover opportunities and plan trades

* 🛎️ **Alerts & Watchlists**

  * Save your favorite tickers
  * Get price movement alerts in real time

* 📈 **Charts & Insights**

  * Detailed charts, stock data, and option chains
  * Visualize and analyze trading decisions

* 🧠 **Educational Focus**

  * No real money involved — safe for learners
  * Ideal for students, beginners, and fintech enthusiasts

* 🤖 **Coming Soon: Algorithmic Trading**

  * Strategy-based trading bots
  * Automation and backtest tools

---

## 🌐 Tech Stack

* ⚡️ **Next.js** – React framework for frontend
* 💾 **Supabase** – Postgres-powered backend with Realtime and Auth
* 📡 **Cloudflare Tunnel** – For secure deployments
* 🔐 Firebase Auth (optional integration)
* 📁 Clean folder architecture and API routes

---

## 📥 Installation (Dev Setup)

```bash
git clone https://github.com/optionxi/optionxi-webapp-community.git
cd optionxi-webapp-community
cp .env.example .env.local
npm install
npm run dev
```

Required:

* Node.js 20.9+
* Supabase project credentials
* Public API keys (see `.env.example`)

Added gitleaks check
```
git config core.hooksPath .githooks
```

Increasing the buffer
```
git config http.postBuffer 524288000
```

---

## 🔓 Why Open Source?

India has a growing market of traders and educators — but many platforms lack **transparency** and **accessibility**. While some creators share real value, others exploit hype without proof.

**OptionXI is the antidote:**

* Built for **education, not profit**
* **Open-source code** and trading logic
* Public trade analysis and audit logs
* Transparent metrics and community reviews
* Anyone can suggest or test strategies

⚠️ **Note:** No real-money trading is available yet. Broker integrations may be supported in future updates.

---

## 🤝 Contributions Welcome!

Whether you're a developer, trader, or learner — join us!

* Submit features or bugs
* Improve UI/UX
* Build tools like:

  * Accuracy leaderboards
  * Strategy visualizers
  * Trade audit systems

---

## 🙌 Support the Project

OptionXI is a **community-led initiative** focused on building India’s most trusted educational trading platform.

You can support us by:

* Contributing code
* Sharing the platform
* Sponsoring us (coming soon)
* Providing feedback and suggestions

---

## 📱 Connect With Us

* 📷 Instagram: [@hi\_functioning\_sociopath](https://instagram.com/hi_functioning_sociopath)
* 🧑‍💻 GitHub: [@katmakhan](https://github.com/katmakhan)

---

## 📜 License

MIT License — Free to use, modify, and build upon.

---

## 📱 Related Projects

* [OptionXI Flutter App](https://github.com/optionxi/optionxi-flutter-community)

---

### 💬 Final Word

> "We don't need another expensive course. We need tools to help us **think, test, and learn** trading in the open."

Help us build that tool. 🛠️
Let's make stock education free, accessible, and community-driven.

---

## 🤖 AI Assistance Credits

| Logo                                                                                                                                | Platform     | Used For                   |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------------------------- |
| <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/ChatGPT-Logo.svg" height="40"/>                                       | **ChatGPT**  | Content + Code Suggestions |
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/1380px-Claude_AI_logo.svg.png" height="40"/> | **Claude**   | UI and Logic Design        |
| <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/DeepSeek_logo.svg" height="40"/>                                      | **DeepSeek** | Debugging                  |
| <img src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Google-gemini-icon.svg" height="40"/>                                 | **Gemini**   | Code Testing               |

---

<div align="center">
  <em>Building the future of stock education with open tools and AI-powered efficiency.</em>
</div>