# Firestore Database Schema

## Overview

Gems SIMCE API uses Google Cloud Firestore as the primary NoSQL database. This document describes the complete schema, collections, and relationships.

## Collections Structure

### 1. schools

Stores information about educational institutions.

**Path:** `schools/{schoolId}`

**Fields:**

```typescript
{
  id: string;                    // Document ID (schoolCode from MINEDUC)
  name: string;                  // School official name
  region: string;                // Chilean region (e.g., "Metropolitana")
  commune: string;               // Commune name
  rbd: number;                   // RBD (school identification number)
  type: "municipal" | "private_subsidized" | "private_paid";
  level: "basic" | "media" | "both";
  ruralUrban: "urban" | "rural";
  studentCount: number;          // Total enrollment
  teacherCount: number;          // Total teachers
  principal: {
    name: string;
    email: string;
    phone: string;
  };
  address: string;
  createdAt: timestamp;
  updatedAt: timestamp;
  status: "active" | "inactive";
}
```

**Indexes:**
- `region, status`
- `type, status`
- `studentCount (descending)`

---

### 2. users

Stores user account information.

**Path:** `users/{userId}`

**Fields:**

```typescript
{
  id: string;                    // Firebase Auth UID
  email: string;                 // User email (unique)
  name: string;                  // Full name
  role: "teacher" | "admin" | "principal" | "inspector";
  schoolId: string;              // Reference to schools collection
  status: "active" | "inactive" | "suspended";
  subscriptionPlan: "free" | "pro" | "premium";
  gemsQuotaPerMonth: number;     // e.g., 10, 100, 500
  gemsUsedThisMonth: number;
  resetQuotaDate: timestamp;     // When monthly quota resets
  avatar: string;                // Avatar URL
  phone: string;
  preferences: {
    language: "es" | "en";
    notifications: boolean;
    darkMode: boolean;
  };
  lastLoginAt: timestamp;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

**Indexes:**
- `email (unique)`
- `schoolId, role`
- `subscriptionPlan, status`

---

### 3. gems

Stores generated educational improvement plans (Gems).

**Path:** `gems/{gemId}`

**Fields:**

```typescript
{
  id: string;                    // Auto-generated Firestore ID
  schoolId: string;              // Reference to schools
  teacherId: string;             // Reference to users
  className: string;             // e.g., "Tercero Medio A"
  subject: "lenguaje" | "matematica" | "historia";  // SIMCE subject
  generatedAt: timestamp;
  generationTime: number;        // Seconds taken (e.g., 35)
  status: "completed" | "processing" | "failed";
  
  // Input data
  input: {
    studentCount: number;
    simulatedScores: {
      reading?: number;
      writing?: number;
      listening?: number;
      mathematics?: number;
    };
    studentDifficulties: string[]; // e.g., ["Cohesión textual"]
  };
  
  // Generated plan (6 sections)
  plan: {
    section1_diagnostic: string;       // "Diagnóstico Inicial"
    section2_objectives: string;       // "Objetivos de Mejora"
    section3_strategies: string;       // "Estrategias Pedagógicas"
    section4_activities: string;       // "Actividades Propuestas"
    section5_evaluation: string;       // "Evaluación y Monitoreo"
    section6_resources: string;        // "Recursos Necesarios"
  };
  
  // Metadata
  exportedAt?: timestamp;        // When gem was exported to PDF
  sentAt?: timestamp;            // When sent via email
  archived: boolean;
  tags: string[];                // User-defined tags
}
```

**Indexes:**
- `schoolId, generatedAt (descending)`
- `teacherId, generatedAt (descending)`
- `status, generatedAt`
- `subject, schoolId`

---

### 4. subscriptions

Manages user subscription and billing information.

**Path:** `subscriptions/{subscriptionId}`

**Fields:**

```typescript
{
  id: string;                    // Auto-generated
  userId: string;                // Reference to users
  schoolId: string;              // Reference to schools
  plan: "free" | "pro" | "premium";
  status: "active" | "canceled" | "expired" | "trial";
  
  // Plan details
  pricing: {
    monthlyPrice: number;        // CLP
    currency: "CLP";
    billingCycle: "monthly" | "annual";
  };
  
  // Subscription periods
  startDate: timestamp;          // When subscription started
  renewalDate: timestamp;        // Next renewal date
  trialEndsAt?: timestamp;       // For trial subscriptions
  canceledAt?: timestamp;
  
  // Stripe integration
  stripeSubscriptionId: string;  // Stripe subscription ID
  stripeCustomerId: string;      // Stripe customer ID
  
  // Feature limits
  features: {
    gemsPerMonth: number;
    maxTeachers: number;
    supportLevel: "email" | "priority";
    customBranding: boolean;
  };
  
  autoRenew: boolean;
  paymentMethod: string;         // Last 4 digits or payment method type
  nextInvoiceDate: timestamp;
}
```

**Indexes:**
- `userId, status`
- `plan, status`
- `renewalDate (ascending)`

---

### 5. payments

Transactional payment records (audit trail).

**Path:** `payments/{paymentId}`

**Fields:**

```typescript
{
  id: string;                    // Auto-generated
  subscriptionId: string;        // Reference to subscriptions
  userId: string;                // Reference to users
  amount: number;                // CLP
  currency: "CLP";
  status: "pending" | "completed" | "failed" | "refunded";
  
  // Payment method
  method: "stripe" | "transfer" | "manual";
  stripePaymentIntentId?: string;
  
  // Dates
  createdAt: timestamp;
  completedAt?: timestamp;
  failureReason?: string;
  
  // Invoice info
  invoiceNumber: string;         // Format: INV-2024-001
  invoiceUrl: string;            // PDF URL
  
  description: string;           // e.g., "Monthly subscription - Pro Plan"
}
```

**Indexes:**
- `subscriptionId, createdAt (descending)`
- `userId, createdAt (descending)`
- `status, createdAt`

---

### 6. notifications

User notifications and activity log.

**Path:** `users/{userId}/notifications/{notificationId}`

**Fields:**

```typescript
{
  id: string;
  userId: string;                // Subcollection parent
  type: "gem_generated" | "subscription_renewed" | "quota_warning" | "system";
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;            // Deep link to relevant section
  createdAt: timestamp;
  expiresAt?: timestamp;         // Auto-delete old notifications
}
```

---

### 7. logs

Activity and audit logs (server-side only, not exposed via API).

**Path:** `logs/{logId}`

**Fields:**

```typescript
{
  id: string;
  userId: string;                // Who performed the action
  action: "create_gem" | "export_pdf" | "send_email" | "login" | "upgrade_plan";
  resourceType: "gem" | "subscription" | "user";
  resourceId: string;            // ID of affected resource
  status: "success" | "error";
  errorMessage?: string;
  ipAddress: string;
  userAgent: string;
  createdAt: timestamp;          // TTL: 90 days
}
```

---

## Relationships

```
users
  ├── schoolId → schools
  └── subscriptions
      ├── stripeCustomerId (external: Stripe)
      └── payments

gems
  ├── schoolId → schools
  ├── teacherId → users
  └── (exported PDFs stored in Cloud Storage)

subscriptions
  ├── userId → users
  └── schoolId → schools

notifications
  └── userId (subcollection parent)
```

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId && 
                      request.resource.data.role == resource.data.role;
    }
    
    // Teachers can read gems from their school
    match /gems/{gemId} {
      allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.schoolId == resource.data.schoolId;
      allow create: if request.auth.uid == request.resource.data.teacherId;
      allow delete: if request.auth.uid == resource.data.teacherId;
    }
    
    // Schools data is read-only for authenticated users
    match /schools/{schoolId} {
      allow read: if request.auth != null;
      allow write: if false; // Managed via admin API
    }
    
    // Subscriptions (users see only their own)
    match /subscriptions/{subId} {
      allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.id == resource.data.userId;
      allow write: if false; // Managed via admin API
    }
  }
}
```

## Indexes

Composite indexes required for optimal query performance:

```yaml
# schools
- fields: [(region: Ascending), (status: Ascending)]
- fields: [(type: Ascending), (status: Ascending)]

# users
- fields: [(schoolId: Ascending), (role: Ascending)]
- fields: [(subscriptionPlan: Ascending), (status: Ascending)]

# gems
- fields: [(schoolId: Ascending), (generatedAt: Descending)]
- fields: [(teacherId: Ascending), (generatedAt: Descending)]
- fields: [(status: Ascending), (generatedAt: Ascending)]
- fields: [(subject: Ascending), (schoolId: Ascending)]

# subscriptions
- fields: [(userId: Ascending), (status: Ascending)]
- fields: [(renewalDate: Ascending)]

# payments
- fields: [(subscriptionId: Ascending), (createdAt: Descending)]
- fields: [(status: Ascending), (createdAt: Ascending)]
```

## Data Size Estimates

Based on 1000 schools, 10,000 teachers, and 100,000 gems/month:

- **schools**: ~1 KB/doc × 1,000 = 1 MB
- **users**: ~2 KB/doc × 10,000 = 20 MB
- **gems**: ~50 KB/doc × 100,000 = 5 GB
- **subscriptions**: ~1 KB/doc × 10,000 = 10 MB
- **payments**: ~1 KB/doc × 10,000/month = 10 MB/month
- **notifications**: ~500 B/doc (TTL: 30 days)

**Total estimate**: ~5-6 GB after 1 year of operation

## Backup Strategy

- Daily automatic backups to Cloud Storage
- Point-in-time recovery enabled (7 days)
- Monthly exports to GCS for long-term archival
- Disaster recovery: <4 hour RTO, <1 hour RPO
