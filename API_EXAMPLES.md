# API Examples

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer your-auth-token
```

## Base URL

- **Production**: `https://api.gems-simce.dev`
- **Development**: `http://localhost:3000`
- **Staging**: `https://staging-api.gems-simce.dev`

## Endpoints

### 1. Health Check

Check if the API is running (no authentication required).

```bash
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600
}
```

### 2. Generate Gem (SIMCE Lenguaje)

Generate an educational improvement plan for Spanish language.

**Endpoint:**

```bash
POST /gems/simce-lenguaje
Authorization: Bearer your-token
Content-Type: application/json
```

**Request Body:**

```json
{
  "schoolId": "school-123",
  "teacherId": "teacher-456",
  "className": "Tercero Medio A",
  "studentCount": 35,
  "simulatedScores": {
    "reading": 245,
    "writing": 238,
    "listening": 250
  },
  "studentDifficulties": [
    "Cohesión textual",
    "Análisis de recursos retóricos"
  ]
}
```

**Response (200 OK):**

```json
{
  "id": "gem-789",
  "schoolId": "school-123",
  "teacherId": "teacher-456",
  "className": "Tercero Medio A",
  "generatedAt": "2024-01-15T10:35:00Z",
  "plan": {
    "section1": "Diagnóstico Inicial...",
    "section2": "Objetivos de Mejora...",
    "section3": "Estrategias Pedagógicas...",
    "section4": "Actividades Propuestas...",
    "section5": "Evaluación y Monitoreo...",
    "section6": "Recursos Necesarios..."
  },
  "estimatedGenerationTime": 35
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/gems/simce-lenguaje \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "schoolId": "school-123",
    "teacherId": "teacher-456",
    "className": "Tercero Medio A",
    "studentCount": 35,
    "simulatedScores": {
      "reading": 245,
      "writing": 238,
      "listening": 250
    },
    "studentDifficulties": ["Cohesión textual", "Análisis de recursos retóricos"]
  }'
```

### 3. Get Gem by ID

Retrieve a previously generated gem.

**Endpoint:**

```bash
GET /gems/:id
Authorization: Bearer your-token
```

**Response (200 OK):**

```json
{
  "id": "gem-789",
  "schoolId": "school-123",
  "teacherId": "teacher-456",
  "className": "Tercero Medio A",
  "generatedAt": "2024-01-15T10:35:00Z",
  "plan": {
    "section1": "...",
    "section2": "..."
  }
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:3000/gems/gem-789 \
  -H "Authorization: Bearer your-token"
```

### 4. List Gems by School

Get all gems generated for a specific school.

**Endpoint:**

```bash
GET /gems/school/:schoolId?limit=10&offset=0
Authorization: Bearer your-token
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "gem-789",
      "className": "Tercero Medio A",
      "generatedAt": "2024-01-15T10:35:00Z",
      "status": "completed"
    },
    {
      "id": "gem-790",
      "className": "Segundo Medio B",
      "generatedAt": "2024-01-14T15:20:00Z",
      "status": "completed"
    }
  ],
  "total": 42,
  "limit": 10,
  "offset": 0
}
```

### 5. Get User Profile

Retrieve authenticated user's profile information.

**Endpoint:**

```bash
GET /user
Authorization: Bearer your-token
```

**Response (200 OK):**

```json
{
  "id": "user-123",
  "email": "teacher@school.cl",
  "name": "María González",
  "role": "teacher",
  "schoolId": "school-123",
  "subscriptionPlan": "pro",
  "gemsGenerated": 42,
  "gemsLimit": 100,
  "createdAt": "2023-06-01T08:00:00Z"
}
```

### 6. Get Subscription Plan

Retrieve current subscription details.

**Endpoint:**

```bash
GET /subscription
Authorization: Bearer your-token
```

**Response (200 OK):**

```json
{
  "userId": "user-123",
  "plan": "pro",
  "status": "active",
  "gemsPerMonth": 100,
  "usedThisMonth": 42,
  "renewalDate": "2024-02-15",
  "autoRenew": true,
  "price": 9900
}
```

### 7. Update Subscription Plan

Upgrade or downgrade subscription.

**Endpoint:**

```bash
POST /subscription
Authorization: Bearer your-token
Content-Type: application/json
```

**Request Body:**

```json
{
  "newPlan": "premium",
  "paymentMethodId": "pm-stripe-123"
}
```

**Response (200 OK):**

```json
{
  "userId": "user-123",
  "plan": "premium",
  "status": "active",
  "gemsPerMonth": 500,
  "renewalDate": "2024-02-15"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "INVALID_INPUT",
  "message": "Missing required field: studentCount",
  "code": 400
}
```

### 401 Unauthorized

```json
{
  "error": "INVALID_TOKEN",
  "message": "Token expired or invalid",
  "code": 401
}
```

### 429 Rate Limited

```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "You have exceeded 100 requests/hour",
  "retryAfter": 3600,
  "code": 429
}
```

### 500 Internal Server Error

```json
{
  "error": "INTERNAL_ERROR",
  "message": "An unexpected error occurred. Please try again.",
  "code": 500
}
```

## Postman Collection

Import this Postman environment to test the API:

```json
{
  "info": {
    "name": "Gems SIMCE API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/health"
      }
    },
    {
      "name": "Generate Gem",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "url": "{{baseUrl}}/gems/simce-lenguaje",
        "body": {
          "mode": "raw",
          "raw": "{\"schoolId\":\"school-123\",\"teacherId\":\"teacher-456\"}"
        }
      }
    }
  ],
  "variable": [
    {"key": "baseUrl", "value": "http://localhost:3000"},
    {"key": "token", "value": "your-auth-token"}
  ]
}
```

## Rate Limiting

- **Free Plan**: 10 requests/hour
- **Pro Plan**: 100 requests/hour
- **Premium Plan**: 500 requests/hour

Rate limit headers included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705320600
```
