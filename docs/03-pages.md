# Pages

| Flow | URL | Access | Main content and actions |
|---:|---|---|---|
| 1 | `/` | Public | Search form, category links, provider cards, location button. Uses seed data. |
| 2 | `/search` | Public | Filters and map/list results. Calls category and provider search APIs. |
| 3 | `/providers/[id]` | Public | Provider details, services, portfolio, reviews, booking and review dialogs. |
| 4 | `/register` | Public | Customer/provider form. Sends `POST /api/auth/register`. |
| 5 | `/login` | Public | Demo login form. Sends `POST /api/auth/login`. |
| 6 | `/client/dashboard` | Customer UI guard | Booking list and review action. Calls `GET /api/bookings`, then `POST /api/reviews`. |
| 7 | `/provider/dashboard` | Provider UI guard | Request actions, service editing, coverage settings. Calls provider and booking APIs. |

Shared layout is in `src/app/layout.tsx`; navigation and footer are in `src/components`. Role checks are client-side and do not protect APIs.
