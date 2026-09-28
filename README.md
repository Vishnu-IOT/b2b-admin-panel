# B2B Business Media — Admin Panel

A production-ready React admin panel for the existing B2B Business Media backend
(Node/Express + MySQL). Built with Create React App (no Vite), plain CSS, React Router
and Axios — no Bootstrap / Tailwind / Material UI.

## Setup

```bash
npm install
cp .env.example .env      # point REACT_APP_API_URL at your backend
npm start                 # http://localhost:3000
```

Make sure the backend is running (`npm run dev` in the backend project, default
`https://darkslateblue-vulture-672842.hostingersite.com/api`) and that its CORS config allows `http://localhost:3000`.

### Signing in

Use the credentials seeded by the backend (`npm run db:seed`):

- **Super Admin:** `admin@example.com` / `ChangeMe@123` (or whatever `SEED_ADMIN_EMAIL` /
  `SEED_ADMIN_PASSWORD` were set to)
- **Demo Business Admin:** `demo@business.com` / `Demo@12345` (if the demo-data seeder ran)

## Folder structure

```
src/
├── components/
│   ├── common/       Button, Modal, FormField, FileUploadField, StatusBadge, Pagination,
│   │                  SearchInput, States (empty/skeleton/loader), ProtectedRoute, Icon, PageHeader
│   └── content/       (content-specific pieces used by pages/content)
├── layouts/           AdminLayout, SidebarContent, Topbar (desktop sidebar + mobile drawer)
├── pages/
│   ├── auth/          Login
│   ├── dashboard/      role-aware Dashboard (Super Admin / Business Admin views)
│   ├── businesses/     Businesses list + form (Super Admin)
│   ├── business-profile/  Own business profile (Business Admin)
│   ├── users/          Business Admin accounts (Super Admin)
│   ├── content/        Generic config-driven manager for Stories, Strategies, Achievements,
│   │                    Products, Videos, Supplier Enquiries (both roles)
│   ├── resources/      Resource Categories + Resource Posts (Super Admin)
│   ├── qa/              Questions & Answers (both roles)
│   ├── moderation/      Unified content moderation queue (Super Admin)
│   └── errors/           404
├── services/           One Axios module per backend route group (auth, business, content,
│                        resources, qa, admin, notifications) — talks to the real API only
├── hooks/               usePagination, useDebounce
├── utils/               constants, format, fileUrl, navConfig, moderationHelpers, errorMessage
└── styles/              Plain CSS design system (variables, base, layout, forms, table,
                          badges, modal, states, dashboard, auth, pages, button, toast)
```

## How it maps to the backend

- **Auth** — JWT stored in `localStorage`, attached via an Axios request interceptor.
  A 401 response clears the session and redirects to `/login`.
- **Content types** (`stories`, `strategies`, `achievements`, `products`, `videos`,
  `enquiries`) all share one backend router shape (`GET /mine`, `POST`, `PUT /:id`,
  `DELETE /:id`). The admin panel mirrors this with a single config-driven
  `ContentManager` component (`src/pages/content/contentConfigs.js`) instead of six
  near-identical pages.
- **Approval flow** — Business Admins can only save as `DRAFT` or submit for `PENDING`
  review; Super Admins can set any status and approve/reject from the list view or the
  Content Moderation queue (`/admin/content/:type/:id/status`).
- **Uploads** — files are sent as `multipart/form-data` to the same endpoints the
  backend already exposes (no separate upload service). Stored paths like
  `/uploads/images/xxx.jpg` are resolved against `REACT_APP_FILES_ORIGIN`.
- **Businesses vs. Business Admins** — creating a business on someone's behalf is a
  two-step flow, matching the backend: first create the `BUSINESS_ADMIN` user
  (Business Admins page), then create their business profile (Businesses page), which
  the backend requires because `POST /api/business` needs an existing user without a
  business yet.
- **Questions & Answers** — publish immediately (no approval queue) per the backend's
  default status, but Super Admins can still hide (`REJECTED`) or delete abusive posts.

## Role-based access

| Area | Super Admin | Business Admin |
|---|---|---|
| Dashboard | platform-wide stats, pending queue, recent activity | own business's stats & quick actions |
| Businesses / Business Admins | full CRUD | — |
| Business Profile | — | manage own |
| Stories / Strategies / Achievements / Products / Videos / Enquiries | manage across all businesses | manage own only |
| Questions & Answers | manage + moderate | manage own + answer others' |
| Resource Categories / Posts | full CRUD | — |
| Content Moderation | approve / reject / delete | — |

Business Admin routes and nav items are hidden and route-guarded for Super Admin-only
areas, and vice versa (`src/components/common/ProtectedRoute.js`).

## Language (English / Tamil)

Each business has a `language` field (`en` | `ta`, stored on the Business record). Business
Admins pick it in **Business Profile → Edit profile → Preferred language**; the whole panel
switches immediately after saving and on every later login.

- `src/i18n/translations.js` — one dictionary per language (`en`, `ta`), flat dot-path keys.
- `src/context/LanguageContext.js` — reads `business.language` for Business Admins and exposes
  `t(key, vars)`. Missing Tamil keys fall back to English, then to the key itself.
- Super Admins have no business, so their panel is always English. Super Admins can still set
  a business's language from Businesses → Edit.
- To add text: add the key to **both** `en` and `ta`, then use `const { t } = useLanguage()`.
- `language` is sent with the normal business payload; per your backend change, a
  language-only edit does not reset the business status to PENDING.
