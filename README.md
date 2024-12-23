# dgxprt

A modern chemical management system built with React, TypeScript, and Tailwind CSS.

## Project Overview

DGXPRT is a comprehensive chemical management system designed for educational institutions. It provides:

- User & Location Management
- Chemical & SDS Management
- Risk Assessment & Compliance
- Inventory Tracking
- Reporting & Analytics

## Technologies Used

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- Zustand for State Management
- React Query for Server State

### Backend & Database
- Supabase
  - Authentication with RLS
  - PostgreSQL Database
  - Storage for SDS Files
  - Real-time Subscriptions

### Data Processing
- Papa Parse (CSV)
- xlsx (Excel)
- pdf.js (PDF Viewing)

## Project Structure
```
src/
├── assets/                # Static assets & branding
├── components/            
│   ├── ui/               # shadcn components
│   ├── shared/           # Reusable components
│   ├── layouts/          # Admin & user layouts
│   ├── admin/            # Admin components
│   └── user/             # Standard user components
├── config/               # App configuration
├── features/             # Feature modules
├── hooks/                # Custom hooks
├── lib/                  # Core utilities
├── pages/                # Route pages
├── services/            # API services
├── stores/              # Zustand stores
├── styles/              # Global styles
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## Development

To run this project locally:

```bash
npm install
npm run dev
```

## Testing Strategy

- Unit Testing: Components, Stores, Utils
- Integration Testing: Feature Workflows
- E2E Testing: Critical User Paths

## Documentation

For more information about deployment and custom domains, please refer to our [documentation](https://docs.lovable.dev/).