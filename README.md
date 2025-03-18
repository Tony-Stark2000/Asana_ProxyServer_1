# Asana Proxy Server

A proxy server to handle Asana API (v1.0) requests securely from web applications without exposing API tokens to the client.

## Overview

This server acts as a middleware between your frontend application and the Asana API. It proxies all Asana API requests through a single endpoint, keeping your Asana access token secure on the server-side.

## Installation

1. Clone this repository:

```bash
git clone https://github.com/Tony-Stark2000/Asana_ProxyServer_1.git
cd Asana_ProxyServer_1
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
ASANA_API_URL=https://app.asana.com/api/1.0
ASANA_ACCESS_TOKEN=your_asana_personal_access_token
```

4. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Usage

The server exposes a single endpoint for all Asana API operations:

### Endpoint: `POST /api/asanaproxy`

This endpoint accepts a JSON payload with the following structure:

```json
{
	"apiPath": "/users/me",
	"method": "GET",
	"queryParams": {
		"param1": "value1",
		"param2": "value2"
	},
	"postData": {
		"key1": "value1",
		"key2": "value2"
	},
	"apiHeaders": {
		"Custom-Header": "value"
	}
}
```

#### Parameters

-   `apiPath` (required): The Asana API endpoint path (without the base URL)
-   `method` (optional): The HTTP method (GET, POST, PUT, DELETE, etc.). Defaults to "GET"
-   `queryParams` (optional): Query parameters to append to the URL
-   `postData` (optional): Request body for POST, PUT, or PATCH requests
-   `apiHeaders` (optional): Additional headers to send with the request

## Examples

### Get current user information

```javascript
fetch("http://localhost:3000/api/asanaproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/users/me",
		method: "GET"
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

### Get all workspaces

```javascript
fetch("http://localhost:3000/api/asanaproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/workspaces",
		method: "GET"
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

### Get all projects in a workspace

```javascript
fetch("http://localhost:3000/api/asanaproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/workspaces/12345/projects",
		method: "GET",
		queryParams: {
			archived: false
		}
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

### Get tasks from a project

```javascript
fetch("http://localhost:3000/api/asanaproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/projects/12345/tasks",
		method: "GET",
		queryParams: {
			completed_since: "now",
			opt_fields: "name,assignee,due_date,completed"
		}
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

### Create a new task

```javascript
fetch("http://localhost:3000/api/asanaproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/tasks",
		method: "POST",
		postData: {
			data: {
				name: "New task title",
				notes: "Task description goes here",
				workspace: "12345",
				projects: ["67890"],
				assignee: "user_id_or_email",
				due_on: "2023-12-31"
			}
		}
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

### Update a task

```javascript
fetch("http://localhost:3000/api/asanaproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/tasks/12345",
		method: "PUT",
		postData: {
			data: {
				name: "Updated task title",
				notes: "Updated description",
				completed: true
			}
		}
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

### Get task details

```javascript
fetch("http://localhost:3000/api/asanaproxy", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		apiPath: "/tasks/12345",
		method: "GET",
		queryParams: {
			opt_fields: "name,notes,assignee,due_date,completed,projects,tags"
		}
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data));
```

## Error Handling

The server will forward any errors from the Asana API with appropriate status codes and error messages.

## Security Notes

-   This proxy server is designed to keep your Asana access token secure by storing it on the server.
-   Consider implementing additional authentication for the proxy server in a production environment.
-   The CORS middleware is enabled to allow cross-origin requests. Configure it appropriately for your use case.

## Asana API Documentation

For more information about available endpoints and parameters, refer to the [official Asana API documentation](https://developers.asana.com/reference/rest-api-reference).
