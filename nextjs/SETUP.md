# Next.js 14 LogicFlow - Setup Guide

This folder contains the complete Next.js 14 migration of the LogicFlow project management application.

## 🚀 Quick Start

```bash
cd nextjs
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
nextjs/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home (redirects to login/dashboard)
│   ├── login/             # Login page
│   ├── dashboard/         # Dashboard page
│   ├── project/[id]/      # Dynamic project pages
│   └── timesheet/         # Timesheet page
├── components/
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── tasks/             # Task components (List, Board, Card, Modal)
│   ├── projects/          # Project components (Overview)
│   └── ui/                # UI components (Button, Input, Modal, Select)
├── stores/                # Zustand state management
│   ├── authStore.ts
│   ├── projectStore.ts
│   ├── taskStore.ts
│   ├── timerStore.ts
│   └── timesheetStore.ts
├── types/                 # TypeScript type definitions
└── lib/                   # Utilities (cn helper)
```

## 🎨 Features

### ✅ Implemented
- **Authentication**: Login page with session management
- **Dashboard**: Project overview with favorites
- **Projects**: Full project view with tabs (Overview, List, Board, Files)
- **Tasks**:
  - List view (grouped by status, mobile-responsive)
  - Board view (Kanban with drag-and-drop)
  - Task modal for editing
- **Timesheet**:
  - ClickUp-style grid layout
  - Visual time blocks (orange intensity bars)
  - Expandable person/task rows
  - My timesheet vs All timesheets tabs
  - Timesheet vs Time entries view toggle
- **Time Tracker**: Header timer for tracking work
- **Mobile Responsive**: Drawer sidebar, responsive layouts

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Utils**: date-fns
- **Utilities**: clsx, tailwind-merge

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🚀 Deployment to Vercel

### Option 1: Via Vercel Dashboard
1. Push this code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Select your repository
5. Vercel will auto-detect Next.js and deploy

### Option 2: Via Vercel CLI
```bash
cd nextjs
npx vercel --prod
```

## 🎨 Customization

### Colors
Edit `app/globals.css` to change the dark theme colors:
```css
--color-dark-900: #0d0d0d;
--color-primary-500: #FF6B35;
```

### Routes
Add new routes by creating files in the `app/` directory:
```
app/
├── new-page/
│   └── page.tsx
```

## 📝 Notes

- All client components use `'use client'` directive
- Zustand stores also use `'use client'`
- Mock data is used for development (no backend yet)
- Mobile-responsive throughout
- Build tested and passing ✅

## 🔗 Links

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Vercel Deployment](https://vercel.com/docs)

---

Built with ❤️ using Next.js 14
