# API

Base URL: `NEXT_PUBLIC_API_URL` (local: `http://localhost:4000`)

All JSON responses:

```json
{ "success": true, "data": {} }
```

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Invalid request" } }
```

Paginated lists also include `meta: { limit, nextCursor, hasMore }`.

## Auth

| Method | Path | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public (sets HTTP-only cookies) |
| POST | `/api/auth/logout` | public |
| POST | `/api/auth/verify-email` | public |
| POST | `/api/auth/forgot-password` | public |
| POST | `/api/auth/reset-password` | public |
| GET | `/api/auth/me` | authenticated |

## Catalog

| Method | Path | Access |
| --- | --- | --- |
| GET | `/api/health` | public |
| GET | `/api/categories` | public |
| POST/PATCH | `/api/categories` | ADMIN |
| GET | `/api/styles` | public (cursor pagination) |
| GET | `/api/styles/:slug` | public |
| GET | `/api/professionals` | public search + filters |
| GET | `/api/professionals/:slug` | public (approved only) |
| PATCH | `/api/professionals/me` | PROFESSIONAL |
| GET/POST/PATCH | `/api/professionals/:id/services` | public GET; owner/admin write |
| GET/PUT | `/api/professionals/:id/availability` | public GET; owner write |
| GET/POST | `/api/professionals/:id/portfolio` | public GET; owner write |

## Bookings

`POST /api/bookings` (CUSTOMER): server loads service, price, duration, professional WhatsApp, checks availability, locks the professional row, rejects overlaps, then stores the booking **before** returning a WhatsApp URL.

`GET /api/bookings`, `GET /api/bookings/:id`, `PATCH /api/bookings/:id/status`

## Social

`POST/DELETE/GET /api/favorites` (CUSTOMER)

`POST /api/reviews` (CUSTOMER, completed booking only)

## Admin

All `/api/admin/*` routes require `ADMIN`. Audit logs record approvals, suspensions, setting changes, and portfolio moderation.
