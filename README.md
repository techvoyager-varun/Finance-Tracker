# Finance Dashboard UI

A responsive frontend finance dashboard built for the Frontend Developer Intern assignment.

This project focuses on clean UI, component structure, state management, and interactive frontend behavior using mock data.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui + Radix UI
- Recharts
- Context API for app state

## Features

### 1. Dashboard Overview

- Summary cards for Total Balance, Total Income, and Total Expenses
- Time-based visualization: Balance Trend (area chart)
- Categorical visualization: Spending Breakdown (donut chart)

### 2. Transactions Section

- Transaction list includes:
  - Date
  - Description
  - Type (Income/Expense)
  - Category
  - Amount
- Filtering and controls:
  - Search by description/category
  - Filter by type
  - Filter by category
  - Date range filter
  - Sort toggle (newest/oldest)

### 3. Role-based UI (Frontend Simulation)

- Role switcher: Admin / Viewer
- Viewer: read-only access to data
- Admin: can add, edit, and delete transactions

### 4. Insights Section

- Highest spending category
- Monthly expense comparison
- Savings rate
- Largest expense observation

### 5. State Management

Managed through Context API in the dashboard provider:

- Transactions state
- Filters state
- Selected role state
- Derived values (income, expense, balance, insights)

### 6. UI/UX Coverage

- Responsive layout for desktop and mobile
- Empty state handling for no transactions or no chart data
- Smooth transitions and hover effects
- No backend dependency (mock data + local persistence)

## Optional Enhancements Included

- Dark mode toggle
- LocalStorage persistence for:
  - Transactions
  - Selected role
  - Theme
- Export filtered transactions as CSV/JSON

## Project Structure

Key folders:

- `src/pages` - page-level composition
- `src/components/dashboard` - dashboard feature components
- `src/context` - global dashboard state and logic
- `src/data` - mock finance data
- `src/lib` - utilities (currency formatting, shared helpers)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Run tests

```bash
npm run test
```

## Assignment Mapping

This implementation covers all core requirements:

- Dashboard overview: implemented
- Transactions list with filtering/search/sorting: implemented
- Role-based frontend behavior: implemented
- Insights: implemented
- State management approach: implemented via Context
- Responsive design and empty states: implemented

## Notes

- Data is mock/static and persisted in browser localStorage.