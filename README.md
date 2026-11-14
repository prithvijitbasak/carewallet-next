# 💚 CareWallet - Personal Expense Tracker

> A modern, full-stack personal finance and expense tracking application built with **Next.js 16 (App Router)**, **TypeScript**, **Redux Toolkit**, **React Query**, **MongoDB/Mongoose**, and **Tailwind CSS**.

---

## 📖 Beginner Friendly Documentation

Are you learning this codebase or new to modern Next.js architecture? Check out our dedicated guide:
👉 **[Read the Full Beginner's Guide (BEGINNER_GUIDE.md)](./BEGINNER_GUIDE.md)** for:
- Architecture diagrams & 3-Tier pattern walkthrough
- Detailed request-response lifecycles
- Step-by-step explanations of Server Components, Repositories, Services, and Redux Toolkit
- MongoDB aggregation pipelines explained simply

---

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based session tokens stored in secure HttpOnly cookies with bcrypt password hashing.
- ⚡ **Next.js 16 App Router**: Server-Side Rendering (SSR) for blazing-fast initial load times without render flashes.
- 🕒 **Timezone Intelligence**: All daily, monthly, and yearly calculations automatically align to the user's local timezone.
- 📊 **Visual Analytics**: Interactive bar charts and category breakdowns using Recharts.
- 📝 **Batch Expense Logging**: Record single or multiple expenses simultaneously with dynamic rows.
- 📄 **PDF Financial Reports**: Export custom date-range statements as downloadable PDF documents with `@react-pdf/renderer`.
- 🗄️ **Clean 3-Tier Architecture**: Clear separation of concerns (Presentation ➔ Controller ➔ Service ➔ Repository ➔ MongoDB).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React Query](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB instance (MongoDB Atlas free tier or local MongoDB server)

### 2. Clone and Install
```bash
git clone <repository-url>
cd carewallet-next
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root folder:
```env
# MongoDB Connection String
DB_KEY=mongodb+srv://<username>:<password>@cluster0.mongodb.net/carewallet?retryWrites=true&w=majority

# Secret key for JWT access tokens
JWT_ACCESS_KEY=your_secret_access_key_min_32_chars

# (Optional) TimezoneDB API Key
TIMEZONE_DB_API_KEY=your_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📂 Project Structure Overview

```
src/
├── app/                  # Next.js App Router (Pages, Layouts, API Route Handlers)
│   ├── (auth)/           # Route group for /login and /register
│   ├── [username]/       # Dynamic user dashboard pages (add-expense, analytics, reports)
│   └── api/              # Backend endpoints (auth, expenses, ssr, users)
├── components/           # Reusable UI widgets and presentation components
├── constants/            # Expense categories and application constants
├── hooks/                # Custom React hooks (useAuth, useTotalExpense)
├── lib/                  # Shared utilities (db connection, auth verification, Zod schemas)
├── models/               # Mongoose database models (User, Expense)
├── redux/                # Redux Toolkit store, providers, and state slices
├── repositories/         # Data access layer (MongoDB aggregations and queries)
├── services/             # Business logic layer (timezones, date ranges, calculations)
└── utils/                # Formatting helpers (dates, strings, currencies)
```

---

## 📄 License
MIT
