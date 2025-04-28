# Rise Admin Dashboard

Welcome to the **Rise Admin Dashboard** project!  
This application manages various aspects of the Rise ecosystem — including staff, programs, memberships, barbershop services, and more. Built with modern web technologies, it ensures scalability, maintainability, and a smooth developer experience.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Development Guidelines](#development-guidelines)
  - [Branching & PR Workflow](#branching--pr-workflow)
  - [Coding Standards](#coding-standards)
- [Features](#features)
- [License](#license)

---

## Tech Stack

| Category              | Tool/Library                     |
|:----------------------|:----------------------------------|
| Framework             | [Next.js](https://nextjs.org/)    |
| Styling               | [Tailwind CSS](https://tailwindcss.com/) |
| UI Components         | [ShadCN UI](https://ui.shadcn.dev/) |
| Icons                 | [Lucide Icons](https://lucide.dev/) |
| Forms                 | [React Hook Form](https://react-hook-form.com/) |
| Language              | TypeScript |
| API Documentation     | Swagger |

---

## Project Structure

```plaintext
rise-admin-dashboard/
├── app/                 # Application entry (pages and layouts)
│   ├── (dashboard)/     # Dashboard-specific routes
│   ├── api/             # API-related logic
│   ├── globals.css      # Global styles
│   └── layout.tsx       # Root layout
├── components/          # Reusable UI components
├── contexts/            # React Contexts for global state
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and libraries
├── public/              # Static assets (images, icons, etc.)
├── services/            # API service functions
├── types/               # TypeScript type definitions
├── tailwind.config.ts   # Tailwind CSS configuration
├── eslint.config.mjs    # ESLint configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project metadata and dependencies
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (for backend services if applicable)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-organization/rise-admin-dashboard.git
cd rise-admin-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running Locally

1. Start any necessary backend services using Docker (if applicable).

2. Start the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open your browser and navigate to:

```
http://localhost:3000
```

---

## Development Guidelines

### Branching & PR Workflow

We follow a structured Git flow:

- Always branch off `main`.
- Branch naming convention:
  - `feature/short-description`
  - `bugfix/short-description`
  - `hotfix/short-description`

**Examples:**
- `feature/add-user-management`
- `bugfix/fix-login-redirect`

#### Opening a Pull Request (PR)

1. Push your feature branch.
2. Open a PR targeting the `main` branch.
3. Fill out the PR template (auto-filled when opening a PR).
4. Assign a reviewer.
5. Address feedback and merge upon approval.

✅ Keep PRs small and focused (<300 lines ideally).  
✅ Always test locally before opening a PR.

---

### Coding Standards

- Follow TypeScript and Tailwind CSS conventions.
- Reuse components wherever possible.
- Write clear, meaningful comments for complex logic.
- Use descriptive and consistent variable and function names.
- Run `npm run lint` before committing to maintain code quality.

---

## Features

- **Staff Management:** Add, update, and manage staff roles and permissions.
- **Program Management:** Create and manage programs, games, practices, and courses.
- **Memberships:** Manage membership plans and details.
- **Barbershop Services:** Handle barbershop appointments, portfolios, and services.
- **Dynamic UI:** Consistent design using reusable components and Tailwind CSS.
- **API Integration:** Seamless communication with the Rise backend services.

---

## License

This project is licensed under [Rise Basketball Organization's internal license](https://www.rise-basketball.com) (private repository — not for public distribution).

---

> "Build clean. Build fast. Build together." 🚀

---