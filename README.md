# Finance Dashboard UI

The goal of this project is to demonstrate frontend problem-solving, UI composition, reusable components, and clear state management with mock data.

## Overview

This dashboard helps users:

- view financial summary metrics,
- explore transactions,
- filter and sort records,
- understand spending behavior through charts and insights,
- switch between Admin and Viewer roles for frontend-only role simulation.

The implementation is intentionally backend-independent and uses mock data plus local storage persistence to keep interaction realistic.

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- shadcn/ui + Radix UI primitives
- Recharts (charts)
- React Context API (global state)

## Feature Set

### Dashboard Overview

- Summary cards:
  - Total Balance
  - Total Income
  - Total Expenses
- Time-series visualization:
  - Balance Trend (area chart)
- Categorical visualization:
  - Spending Breakdown (donut chart with percentage and amount list)

### Transactions Module

- Displays:
  - Date
  - Description
  - Type (Income/Expense)
  - Category
  - Amount
- Interaction features:
  - Search by description/category
  - Filter by type
  - Filter by category
  - Date range filter
  - Sort toggle (newest/oldest)
  - Client-side pagination for large datasets
  - Clear all filters
- Admin actions:
  - Add transaction
  - Edit transaction
  - Delete transaction

### Insights Section

- Highest spending category
- Monthly comparison insight (Apr vs Mar)
- Savings rate
- Largest expense highlight

### Additional UX Features

- Dark mode support with neutral dark palette
- CSV/JSON export for filtered data
- Mobile-friendly dialog/forms
- Empty-state handling when no data is available

## Role-Based Behavior

Role switching is frontend-simulated through a selector.

| Role   | Can View | Can Add | Can Edit | Can Delete |
| ------ | -------- | ------- | -------- | ---------- |
| Viewer | Yes      | No      | No       | No         |
| Admin  | Yes      | Yes     | Yes      | Yes        |

Implementation note:

- actions are conditionally rendered in UI based on current role.
- no backend auth/RBAC is included (as expected for assignment scope).

## State Management Approach

Global state is managed using React Context API via `DashboardProvider`.

Primary managed state:

- `transactions`
- `filters`
- `role`
- `theme`

Derived/computed state:

- `filteredTransactions`
- `totalIncome`
- `totalExpenses`
- `totalBalance`
- insight values (highest category, monthly delta, etc.)

Main operations exposed by context:

- `addTransaction`
- `updateTransaction`
- `deleteTransaction`
- `setFilters`
- `setRole`
- `toggleTheme`
- `exportData`

Persistence:

- transactions persisted in localStorage
- selected role persisted in localStorage
- selected theme persisted in localStorage

## Data Model

Core transaction shape:

```ts
type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: "income" | "expense";
};
```

Data source:

- local mock data under `src/data/mockData.js`
- no API dependency required

## Project Structure

```text
src/
  components/
    dashboard/           # Feature-level dashboard components
    ui/                  # Reusable shadcn/ui wrappers
  context/
    DashboardContext.jsx # Global state and business logic
  data/
    mockData.js          # Mock transactions and chart data
  hooks/
    useTheme.js          # Theme mode handling
  lib/
    currency.js          # Currency formatting helpers
  pages/
    Index.jsx            # Main dashboard composition
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
npm install
```

### Run In Development

```bash
npm run dev
```

### Build For Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm run test
```

## Available Scripts

- `npm run dev` - starts local development server
- `npm run build` - creates production build
- `npm run build:dev` - creates development-mode build
- `npm run preview` - previews built app
- `npm run lint` - runs ESLint
- `npm run test` - runs Vitest tests once
- `npm run test:watch` - runs tests in watch mode

## Responsiveness Notes

- Dashboard layout adapts from stacked mobile sections to multi-column desktop layout.
- Transactions use:
  - desktop table on medium+ screens,
  - optimized card list on small screens.
- Form dialogs are tuned for small viewports with stacked fields and scroll-safe container height.

## Edge Cases Handled

- Empty transaction list
- Empty filtered results
- Empty chart data for spending breakdown
- Invalid add/edit form submission blocked until required fields are present
- Date range filters with min/max constraints
- Large transaction lists handled through pagination
