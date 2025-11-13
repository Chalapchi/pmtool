# LogicFlow - Project Context for Claude

This document provides context and guidelines for AI assistants (Claude) working on the LogicFlow project management tool.

## Project Overview

**LogicFlow** is a comprehensive project management application designed to help teams organize projects, track tasks, manage time, and collaborate effectively. It features a modern dark-themed UI with multiple views (List, Board, Overview) and extensive task management capabilities.

## Key Features Implemented

### 1. Authentication System
- Login page with username/password fields
- Simple, centered modal design on dark background
- Session management

### 2. Project Management
- Left sidebar with project navigation
- Favorites section for quick access
- Folderless projects organization
- Project-specific views and settings

### 3. Task Management
- **List View**: Hierarchical task organization with grouping
  - Status-based sections (To do, In progress, Complete)
  - Collapsible groups with task counts
  - Subtask support
  - Quick inline task creation

- **Board View**: Kanban-style columns
  - Drag-and-drop between columns
  - Status columns: "To do", "In progress", "Complete", "Done"
  - Task cards with assignees, priority, and time tracking

- **Overview**: Project summary
  - Rich text description editor
  - Project roles and team members
  - File attachments section

### 4. Task Properties
Each task includes:
- Title and description (rich text)
- Status (customizable)
- Priority (visual flag indicators)
- Assignee(s) (single or multiple)
- Start Date
- Due Date
- Deadline
- Time Spent (tracked automatically)
- Comments/discussion
- File attachments

### 5. Time Tracking
- Global timer in top navigation bar
- Task selection dropdown
- Start/Stop functionality with visual timer (00:00:00)
- Weekly timesheet view showing:
  - Tasks grouped by day
  - Project association
  - Total time per task
  - "My Timesheet" button for full view

### 6. UI/UX Design Principles

#### Color Scheme (Dark Theme)
- **Background**: Very dark gray/black (#1a1a1a, #0d0d0d)
- **Surfaces**: Dark gray (#2a2a2a, #333333)
- **Primary**: Orange (#FF6B35, #ff8c42)
- **Text Primary**: White/Light gray (#ffffff, #e5e5e5)
- **Text Secondary**: Medium gray (#999999, #b3b3b3)
- **Borders**: Dark gray (#404040)
- **Status Colors**:
  - To do: Default gray
  - In progress: Green (#00ff00, #10b981)
  - Complete: Blue (#3b82f6, #60a5fa)
  - Done: Blue variant

#### Typography
- Font: System sans-serif (likely Inter or similar)
- Clear hierarchy with multiple font sizes
- Icons: Flag icons for priority, folder icons for tasks

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] LogicFlow          [Task Select ▼] [00:00:00] [Start]│
├──────────┬──────────────────────────────────────────────────┤
│ Favorites│ Project Name ▼                        ⭐          │
│ Projects │ ┌─────────────────────────────────────────────┐ │
│          │ │ Overview │ List │ Board │ Files            │ │
│          │ └─────────────────────────────────────────────┘ │
│          │                                                  │
│          │ [Content Area - List/Board/Overview]             │
│          │                                                  │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend (React + TypeScript + Vite)
- **React 18**: Component-based UI
- **TypeScript**: Type safety
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first styling
- **React Router**: Navigation
- **Zustand**: State management (lightweight alternative to Redux)
- **React Hook Form**: Form handling with validation
- **date-fns**: Date manipulation
- **Lucide React**: Icon library
- **@dnd-kit**: Drag and drop for Kanban board
- **TipTap or similar**: Rich text editor

### Code Organization
```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Left navigation
│   │   ├── Header.tsx           # Top bar with timer
│   │   └── Layout.tsx           # Main layout wrapper
│   ├── tasks/
│   │   ├── TaskList.tsx         # List view
│   │   ├── TaskBoard.tsx        # Kanban board
│   │   ├── TaskCard.tsx         # Task card component
│   │   ├── TaskModal.tsx        # Task detail modal
│   │   └── TaskForm.tsx         # Task creation/editing
│   ├── projects/
│   │   ├── ProjectSidebar.tsx   # Project list in sidebar
│   │   ├── ProjectHeader.tsx    # Project name and tabs
│   │   └── ProjectOverview.tsx  # Overview tab
│   ├── time/
│   │   ├── TimeTracker.tsx      # Timer component
│   │   └── Timesheet.tsx        # Weekly timesheet
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Modal.tsx
│       └── RichTextEditor.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── ProjectView.tsx
├── store/
│   ├── authStore.ts
│   ├── projectStore.ts
│   ├── taskStore.ts
│   └── timerStore.ts
├── types/
│   ├── project.ts
│   ├── task.ts
│   └── user.ts
├── utils/
│   ├── dateUtils.ts
│   └── taskUtils.ts
└── App.tsx
```

## Data Models

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  folderId?: string;
  members: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  assignees: string[]; // User IDs
  startDate?: Date;
  dueDate?: Date;
  deadline?: Date;
  timeSpent: number; // minutes
  parentTaskId?: string; // For subtasks
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### TaskStatus
```typescript
type TaskStatus = 'todo' | 'in_progress' | 'complete' | 'done';
```

## Development Guidelines

### 1. Component Patterns
- Use functional components with hooks
- Implement proper TypeScript types for all props
- Follow React best practices (memoization, proper key usage)
- Keep components small and focused

### 2. State Management
- Use Zustand for global state (auth, projects, tasks)
- Use local state for component-specific data
- Implement proper loading and error states

### 3. Styling
- Use Tailwind CSS utility classes
- Follow the dark theme color palette
- Ensure responsive design (mobile-first approach)
- Maintain consistent spacing and typography

### 4. Code Quality
- Write clean, readable code with proper comments
- Follow TypeScript best practices
- Implement proper error handling
- Add loading states for async operations

### 5. Performance
- Lazy load routes and heavy components
- Optimize re-renders with React.memo where appropriate
- Use virtual scrolling for large task lists
- Implement proper caching strategies

## Key Implementation Details

### Rich Text Editor
The description field uses a rich text editor with toolbar controls:
- Bold, Italic, Underline, Strikethrough
- Text alignment (left, center, right, justify)
- Headings (H1-H6)
- Lists (ordered, unordered)
- Code blocks
- Undo/Redo

### Drag and Drop
Board view implements drag-and-drop:
- Tasks can be dragged between columns
- Visual feedback during drag
- Status updates automatically on drop
- Smooth animations

### Time Tracking
Timer functionality:
- Global timer accessible from header
- Task selection dropdown
- Start/Stop button
- Real-time display (HH:MM:SS)
- Automatic save on stop
- Integration with timesheet view

### Task Grouping
List view supports grouping:
- Group by status (default)
- Collapsible groups with counts
- "Add task" button per group
- Indented subtasks

## Testing Strategy

### Unit Tests
- Component rendering
- Utility functions
- State management logic

### Integration Tests
- User workflows (create task, move task, etc.)
- Form submissions
- Navigation

### E2E Tests
- Complete user journeys
- Cross-browser compatibility

## Common Tasks for Claude

### Adding a New Feature
1. Understand the feature requirements
2. Design the component structure
3. Create necessary types
4. Implement components with TypeScript
5. Add state management if needed
6. Style with Tailwind CSS
7. Test the implementation

### Fixing Bugs
1. Reproduce the issue
2. Identify the root cause
3. Implement the fix
4. Test thoroughly
5. Check for similar issues elsewhere

### Refactoring
1. Identify code smells
2. Plan the refactoring
3. Implement incrementally
4. Ensure tests pass
5. Verify functionality unchanged

## Resources

- React Docs: https://react.dev
- TypeScript Docs: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Zustand: https://github.com/pmndrs/zustand
- Vite: https://vitejs.dev

## Current Status

The project is in the initial rebuild phase. The front-end is being completely rebuilt with modern technologies based on the screenshots from the original implementation.

## Questions to Ask

When working on this project, consider:
1. Does this implementation match the design in the screenshots?
2. Is the component reusable and maintainable?
3. Are proper TypeScript types defined?
4. Is the styling consistent with the dark theme?
5. Does it handle edge cases and errors?
6. Is it performant for large datasets?
7. Is it accessible (keyboard navigation, screen readers)?

---

Last Updated: 2025-11-13
