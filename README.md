# LogicFlow - Project Management Tool

A modern, feature-rich project management application designed for teams to organize projects, track tasks, manage time, and collaborate effectively.

![LogicFlow Logo](https://via.placeholder.com/150x50/FF6B35/FFFFFF?text=LogicFlow)

## Features

### 🎯 Core Functionality
- **Project Management** - Create and organize multiple projects with customizable settings
- **Task Management** - Create, assign, and track tasks with detailed properties
- **Multiple Views** - Switch between List, Board (Kanban), and Overview perspectives
- **Time Tracking** - Built-in timer to track time spent on tasks
- **Team Collaboration** - Add team members, assign tasks, and manage project roles

### 📋 Task Features
- Rich text descriptions with formatting toolbar
- Priority levels and status tracking
- Assignee management
- Start date, due date, and deadline tracking
- Time spent tracking
- Task grouping and subtasks
- File attachments
- Comments and collaboration

### 📊 Views
1. **Overview** - Project description, roles, and files at a glance
2. **List View** - Hierarchical task list with grouping and filtering
3. **Board View** - Kanban-style columns (To do, In progress, Complete, etc.)
4. **Files** - Centralized file management

### ⏱️ Time Management
- Integrated time tracker with start/stop functionality
- Weekly timesheet view
- Time spent per task
- Historical time tracking data

### 🎨 UI/UX
- Dark mode interface
- Responsive design
- Intuitive sidebar navigation
- Quick task creation
- Favorites system for quick access
- Search and filter capabilities

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Hook Form** - Form handling
- **date-fns** - Date manipulation
- **Lucide React** - Icon system

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pmtool
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Running Tests

```bash
npm run test
```

## Project Structure

```
pmtool/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── layout/       # Layout components (Sidebar, Header, etc.)
│   │   ├── tasks/        # Task-related components
│   │   ├── projects/     # Project components
│   │   └── ui/           # Base UI components (Button, Input, etc.)
│   ├── pages/            # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── Project.tsx
│   ├── hooks/            # Custom React hooks
│   ├── store/            # State management (Zustand stores)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── styles/           # Global styles
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Usage

### Creating a Project
1. Click on "Projects" in the sidebar
2. Click the "+" button to add a new project
3. Fill in project details and save

### Managing Tasks
1. Select a project from the sidebar
2. Use the "+" button to create new tasks
3. Click on a task to view/edit details
4. Drag and drop tasks in Board view to change status

### Time Tracking
1. Select a task from the top bar
2. Click "Start" to begin tracking time
3. Click "Stop" when finished
4. View time reports in the timesheet view

### Team Collaboration
1. Open a project
2. Go to the "Overview" tab
3. Click "Add member" under Project Roles
4. Assign tasks to team members

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=LogicFlow
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@logicflow.io or open an issue in the repository.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Advanced reporting and analytics
- [ ] Integrations (Slack, Google Calendar, etc.)
- [ ] Custom workflows and automation
- [ ] API for third-party integrations
- [ ] Gantt chart view
- [ ] Resource management
- [ ] Budget tracking

## Acknowledgments

- Design inspired by modern project management tools
- Built with modern web technologies
- Community-driven development

---

Made with ❤️ by the LogicFlow Team
