# 🌟 CareWallet: Beginner's Comprehensive Architecture & Code Guide

Welcome to **CareWallet**! If you are new to Next.js App Router, TypeScript, Redux Toolkit, React Query, or MongoDB, this guide was written specifically for you.

---

## 📚 Table of Contents
1. [What is CareWallet?](#what-is-carewallet)
2. [High-Level Architecture (The 3-Tier Pattern)](#high-level-architecture)
3. [Project Directory Tour](#project-directory-tour)
4. [The Lifecycle of a Request (Step-by-Step)](#the-lifecycle-of-a-request)
   - [Example A: User Logs In](#example-a-user-logs-in)
   - [Example B: Adding an Expense](#example-b-adding-an-expense)
   - [Example C: Viewing the Dashboard (SSR + Hydration)](#example-c-viewing-the-dashboard)
5. [Key Concepts Demystified](#key-concepts-demystified)
   - [Server Components vs Client Components](#server-components-vs-client-components)
   - [Repository vs Service Layer](#repository-vs-service-layer)
   - [JWTs & HttpOnly Cookies](#jwts--httponly-cookies)
   - [MongoDB Aggregation Pipelines](#mongodb-aggregation-pipelines)
   - [Redux Toolkit & Slices](#redux-toolkit--slices)
   - [Zod Validation & Type Inference](#zod-validation--type-inference)
6. [Environment Variables Explained](#environment-variables-explained)
7. [Running Locally](#running-locally)

---

## 1. What is CareWallet?

CareWallet is a full-stack personal finance application. It allows users to:
- Securely create an account and log in with email, username, or phone.
- Record single or batch expenses categorized by tags (e.g., Food, Travel, Grocery).
- Track daily, monthly, and annual expenditure with automatic timezone normalization.
- Visualize spending trends with interactive charts.
- Export financial statements as PDF reports.

---

## 2. High-Level Architecture

CareWallet uses a **layered, clean architecture** to keep the code organized, maintainable, and easy to test:

```
┌────────────────────────────────────────────────────────┐
│             PRESENTATION LAYER (Next.js)               │
│  Server Components (SSR)  &  Client Components (React) │
└──────────────────────────┬─────────────────────────────┘
                           │ (HTTP fetch / API calls)
┌──────────────────────────▼─────────────────────────────┐
│                 CONTROLLER LAYER                       │
│        API Route Handlers (src/app/api/*)              │
│       - Auth verification (JWT & HttpOnly cookies)      │
│       - Zod input validation & HTTP status codes       │
└──────────────────────────┬─────────────────────────────┘
                           │ (Function calls)
┌──────────────────────────▼─────────────────────────────┐
│                  SERVICE LAYER                         │
│            (src/services/*.service.ts)                 │
│       - Business logic & calculations                  │
│       - Timezone conversions & date boundaries         │
└──────────────────────────┬─────────────────────────────┘
                           │ (Function calls)
┌──────────────────────────▼─────────────────────────────┐
│                REPOSITORY LAYER                        │
│          (src/repositories/*.repository.ts)            │
│       - MongoDB aggregation pipelines                  │
│       - Mongoose queries (.find, .insertMany, etc.)    │
└──────────────────────────┬─────────────────────────────┘
                           │ (Mongoose connection)
┌──────────────────────────▼─────────────────────────────┐
│                DATABASE LAYER (MongoDB)                │
│       Collections: users, expenses                     │
└────────────────────────────────────────────────────────┘
```

---

## 3. Project Directory Tour

| Directory | Purpose | Beginner Tip |
| :--- | :--- | :--- |
| `src/app/` | Next.js App Router pages and API routes | Files named `page.tsx` represent URLs; folders named `api` handle backend endpoints. |
| `src/app/(auth)/` | Authentication pages (`/login`, `/register`) | Parentheses `(auth)` create a "Route Group" that organizes files without affecting URL paths. |
| `src/app/[username]/` | Authenticated dashboard pages | Brackets `[username]` indicate a "Dynamic Route Segment" (e.g. `/alex`, `/john`). |
| `src/components/` | Reusable React UI widgets | Split into clean components like `AddExpense.tsx`, `Sidebar.tsx`, `DataTable.tsx`. |
| `src/constants/` | Constant values (e.g. expense category strings) | Prevents typos by defining lists in one central location. |
| `src/hooks/` | Custom React hooks (`useAuth`, `useTotalExpense`) | Encapsulates state and logic so UI components stay clean. |
| `src/lib/` | Shared utilities (database connection, auth tokens, `cn`) | Infrastructure code that any part of the app can import. |
| `src/lib/validators/` | Zod validation schemas (`auth`, `expense`, `user`) | Guarantees data conforms to strict rules before touching the database. |
| `src/models/` | Mongoose schemas (`User.ts`, `Expense.ts`) | Defines collection structure, indexes, and document methods. |
| `src/redux/` | Global state management (Redux Toolkit) | Stores client-side user sessions and modal states. |
| `src/repositories/` | Data access layer (pure MongoDB queries) | All database reading/writing is isolated here. |
| `src/services/` | Business logic layer | Orchestrates dates, user timezones, and repositories. |
| `src/utils/` | Formatting helpers (dates, strings) | Formats dates to British style ("1st Jan 2026") or input formats. |

---

## 4. The Lifecycle of a Request (Step-by-Step)

### Example A: User Logs In
1. **User enters username and password** on `/login` and clicks "Login".
2. **Client Component** (`src/app/(auth)/login/page.tsx`) sends a `POST` request to `/api/auth/login`.
3. **API Route Handler** (`src/app/api/auth/login/route.ts`):
   - Validates the body with Zod `loginSchema.safeParse(body)`.
   - Connects to MongoDB via `connectDb()`.
   - Finds the user by username, email, or phone.
   - Compares the password hash using `bcrypt.compare()`.
   - Generates a signed JWT with `user.generateAccessToken()`.
   - Sets the JWT into an **HttpOnly cookie** named `accessToken`.
   - Returns `{ message: "Login successful", username: "..." }`.
4. **Client updates Redux** with `setIsLogin(true)` and redirects to `/${username}`.

### Example B: Adding an Expense
1. **User fills out the form** on `/[username]/add-expense` (Title, Amount, Category, Date).
2. **Client Component** (`src/components/AddExpense.tsx`) sends `POST /api/expenses` with an array of expenses.
3. **API Route Handler** (`src/app/api/expenses/route.ts`):
   - Reads the `accessToken` cookie and verifies user identity (`getAuthenticatedUser(req)`).
   - Validates each expense with `validateExpense(expense)`.
   - Inserts valid expenses via `Expense.insertMany()`.
   - Returns HTTP 201 Created with the saved documents.
4. **Toast notification** alerts the user: *"Expenses added successfully!"*.

### Example C: Viewing the Dashboard (SSR + Hydration)
1. User visits `/[username]`.
2. **Server Component** (`src/app/[username]/page.tsx`) runs on the server before sending HTML.
3. It calls `ssrFetch("/api/ssr/dashboard")`, forwarding the user's cookies.
4. **Dashboard Service** calculates start and end dates based on the user's timezone (`Asia/Kolkata`, etc.).
5. **Expense Repository** runs a MongoDB `$aggregate` pipeline to sum today's, this month's, and this year's spending in a single query.
6. The HTML arrives in the browser pre-populated with numbers — **zero loading flicker**!

---

## 5. Key Concepts Demystified

### Server Components vs. Client Components
- **Server Component (Default in Next.js App Router)**:
  - Runs **only on the server**.
  - Can directly access databases, environment secrets, and file system.
  - Generates fast, lightweight HTML for the browser.
- **Client Component (Marked with `"use client"` at the very top)**:
  - Runs in the user's browser.
  - Can use interactive features like `useState`, `useEffect`, `onClick`, and animations.

### Repository vs. Service Layer
- **Repository**: Pure database query. E.g. *"Fetch expenses between date A and date B"*.
- **Service**: Business logic. E.g. *"Look up user's timezone, calculate the first day of this month in that timezone, call the repository, and format the results for the chart."*

### JWTs & HttpOnly Cookies
- A **JWT (JSON Web Token)** is a tamper-proof encrypted string that proves who you are (`{ userId: "123" }`).
- An **HttpOnly Cookie** is a cookie that JavaScript running in the browser cannot read. Even if an attacker injects malicious script onto the page (XSS), they cannot steal your token!

### MongoDB Aggregation Pipelines
Instead of fetching 10,000 expense records into Node.js and calculating totals with a JavaScript loop, we tell MongoDB to do the math inside the database engine:
- `$match`: Filter records for this user and date range.
- `$group`: Group matching records and compute mathematical sums (`$sum`).
- Result: The database sends back 1 tiny JSON object instead of thousands of records!

### Redux Toolkit & Slices
- Redux holds shared client-side application state.
- `authSlice.ts`: Holds `{ user, isLogin, loading, error }`.
- `uiSlice.ts`: Holds `{ loginModalOpen }`.
- `useAppSelector` reads state; `useAppDispatch` fires actions to update state.

### Zod Validation & Type Inference
Zod lets you write your schema once:
```ts
export const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().min(0),
});
```
And automatically extract the TypeScript type without writing it twice:
```ts
export type ExpenseInput = z.infer<typeof expenseSchema>;
```

---

## 6. Environment Variables Explained

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection String
DB_KEY=mongodb+srv://<username>:<password>@cluster0.mongodb.net/carewallet?retryWrites=true&w=majority

# Secret key used to sign and verify JWT authentication tokens (use a random 32+ character string)
JWT_ACCESS_KEY=your_super_secret_jwt_key_here

# (Optional) TimezoneDB API Key for external timezone lookups (native Intl fallback is used if omitted)
TIMEZONE_DB_API_KEY=your_timezonedb_key
```

---

## 7. Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open your browser
# Visit http://localhost:3000
```
