# API (High level)

Base URL: `/api`

- `POST /auth/signup`
- `POST /auth/login`
- `GET /users/me`
- `PATCH /users/me`

- `GET /trips`
- `POST /trips`
- `GET /trips/{trip_id}`
- `PATCH /trips/{trip_id}`
- `DELETE /trips/{trip_id}`

- `GET /cities?query=...`

- `GET /trips/{trip_id}/stops`
- `POST /trips/{trip_id}/stops`
- `PATCH /stops/{stop_id}`
- `DELETE /stops/{stop_id}`

- `GET /stops/{stop_id}/activities`
- `POST /stops/{stop_id}/activities`
- `PATCH /activities/{activity_id}`
- `DELETE /activities/{activity_id}`

- `GET /budget/trips/{trip_id}`

- `POST /share/trips/{trip_id}`
- `GET /public/{share_id}`
- `POST /public/{share_id}/copy`
