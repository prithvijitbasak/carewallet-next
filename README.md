# 💚 CareWallet - Personal Expense Tracker

> A modern, full-stack personal finance and expense tracking application built with **Next.js 16 (App Router)**, **TypeScript**, **Redux Toolkit**, **React Query**, **MongoDB/Mongoose**, and **Tailwind CSS**.



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

