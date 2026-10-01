# Services Layer

This folder is the integration boundary between the UI and future backend APIs.

Each module (users, admins, categories, etc.) can have its own service file exposing async functions like:

```js
// src/services/usersService.js
export async function fetchAppUsers(params) { ... }
export async function blockUser(id) { ... }
```

Right now the UI uses mock data directly from `src/mock/data.js`. When APIs are ready, replace mock imports with service calls without touching UI components.

Suggested pattern:

```js
// UI component
const [users, setUsers] = useState([]);
useEffect(() => {
  fetchAppUsers({ page, search }).then(setUsers);
}, [page, search]);
```

A shared `apiClient` (fetch/axios wrapper) can be added here for auth headers, base URLs, error handling and interceptors.
