# PlacePrep Secure — Frontend SPA (Phase 1 & Phase 2)

Enterprise multi-tenant placement preparation and assessment platform built with **React 19**, **Vite**, **Tailwind CSS v4**, **Redux Toolkit**, **React Router v7**, **Microsoft Entra ID (MSAL OAuth2 + PKCE)**, and **Monaco Editor**.

## Implemented Scope (Phase 1 & Phase 2)

### Phase 1: Foundation, Identity & Route Security
- **Design System & Tailwind v4 Tokens** (`src/index.css`, `src/components/ui/`): Responsive mobile drawer + desktop sidebar navigation (`AppLayout`, `Navbar`, `Sidebar`), semantic badges, modals, segmented `OtpInput`, and resizable `SplitPane`.
- **Dual Passwordless Authentication** (`src/pages/auth/LoginPage.jsx`, `src/pages/auth/RegisterPage.jsx`):
  - **Student ID + 6-Digit OTP**: Registration ID validation, live 5-minute passkey expiry countdown, 30-second resend cooldown, positional `OtpInput`, and local dev account registry.
  - **Faculty & Admin SSO (Microsoft Entra ID / MSAL)**: OAuth2 + PKCE configuration (`src/config/authConfig.js`) with clean automatic development PKCE simulator when `VITE_AZURE_CLIENT_ID` is not provisioned (no broken external error popups).
  - **Development Autofill & Bypass**: One-click **Dev Autofill** buttons across Login, OTP, Entra ID, and Student/Faculty Registration plus an interactive **RBAC Dev Sandbox**.
- **Zero-Trust RBAC Routing** (`ProtectedRoute`, `RoleGuard`, `PublicOnlyRoute`): Strict isolation across `STUDENT`, `TEACHER`, `INSTITUTION_ADMIN`, and `SUPER_ADMIN` with deep-link post-login redirect resolution and 403 incident feedback (`UnauthorizedPage`).

### Phase 2: Core Assessment Engine & Multi-Format Evaluation
- **Distraction-Free Assessment Player** (`src/pages/assessment/AssessmentPlayerPage.jsx`):
  - **Server-Authoritative Timer** (`ServerExamTimer`, `useExamTimer`): Drift-calibrated backend clock sync, tab-regain sync heartbeat, `sessionStorage` draft persistence, and automatic lock + Upstash QStash auto-submission when the deadline reaches `00:00`.
  - **MCQ Workspace** (`McqWorkspace`): Syntax-highlighted snippets and guarded `A-D` / `1-4` keyboard shortcuts.
  - **Simulation Coding Workspace** (`SimulationWorkspace`, `MonacoCodeEditor`): Problem story, input/output formats, constraints, sample cases, Python/JS/Java/C++ starter templates, offline fallback editor watchdog, and a **real isolated Web Worker JS sandbox** with timeout protection.
  - **SQL Task Workspace** (`SqlTaskWorkspace`): Schema inspector with PK/FK indicators, sample tuples, Monaco SQL editor, and an **in-memory SQL query evaluator** supporting `JOIN` + `DENSE_RANK() OVER (...)` output validation.
  - **UI Engineering Task Workspace** (`UiTaskWorkspace`): HTML/CSS/JS tabs, responsive Desktop/Mobile sandboxed `<iframe>` live preview, and live `postMessage` DOM/computed-style verification checks.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. On `/login` or `/register`, use the **Dev Autofill** buttons (or Student ID `STU-2024-8891` with OTP `123456`) to sign in immediately without external backend dependencies.

## Optional Live Backend & Entra ID `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_AZURE_CLIENT_ID=your-azure-app-client-id
VITE_AZURE_TENANT_ID=your-azure-tenant-id-or-common
VITE_REDIRECT_URI=http://localhost:5173
```

## Verification Commands

```bash
npm run lint
npm run build
```
