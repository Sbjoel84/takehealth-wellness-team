# TakeHealth Admin Dashboard - Architecture Document

## 1. Executive Summary

Design and implementation of a production-ready admin dashboard for TakeHealth Global Ltd - a comprehensive healthcare, fitness, wellness, and medical services platform. The admin dashboard enables administrators to manage clients, appointments, documents, and other system resources.

### Technology Stack

- **Frontend:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Backend:** NestJS (REST API)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (access + refresh tokens) with bcrypt
- **File Storage:** AWS S3 or local uploads

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN DASHBOARD                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Sidebar    │  │   Header    │  │   Main      │              │
│  │  Navigation │  │   User Info │  │   Content   │              │
│  └─────────────┘  └─────────────┘  │   Area      │              │
│                                    └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                     API CLIENT LAYER                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Auth API │ Clients API │ Appointments API │ Admin API     ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                        NESTJS BACKEND                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Auth Module │  │ Admin Module│  │ Clients     │              │
│  │ (JWT Guard) │  │ (RBAC)      │  │ Module      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │Appointments │  │ Documents   │  │ Audit       │              │
│  │ Module      │  │ Module      │  │ Module      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                      POSTGRESQL DATABASE                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│  │ Admins  │ │Clients  │ │Appoint- │ │Documents│                │
│  │ Table   │ │Table    │ │ments    │ │Table    │                │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema (Prisma)

### 3.1 Admin Table

```prisma
model Admin {
  id            String    @id @default(uuid())
  fullName      String
  email         String    @unique
  passwordHash  String
  role          AdminRole @default(STAFF_ADMIN)
  avatarUrl     String?
  phone         String?
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  appointments  Appointment[]
  documents    Document[]
  auditLogs    AuditLog[]
  adminNotes   AdminNote[]

  @@index([email])
  @@index([role])
}
```

### 3.2 Clients Table (Public users who register via forms)

```prisma
model Client {
  id            String        @id @default(uuid())
  fullName      String
  email         String        @unique
  phone         String?
  serviceType   ServiceType   @default(GENERAL)
  
  // Personal Details
  dateOfBirth   DateTime?
  gender        String?
  nin           String?
  maritalStatus String?
  occupation    String?
  address       String?
  
  // Emergency Contact
  emergencyContact     String?
  emergencyPhone       String?
  
  // Medical/Health Info (JSON for flexibility)
  medicalHistory       Json?
  currentMedications  String?
  allergies           String?
  
  // Status
  status        ClientStatus @default(ACTIVE)
  
  // Timestamps
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  // Relations
  appointments  Appointment[]
  documents    Document[]
  intakeForms  IntakeForm[]
  adminNotes   AdminNote[]

  @@index([email])
  @@index([phone])
  @@index([serviceType])
  @@index([status])
  @@index([createdAt])
}
```

### 3.3 Appointments Table

```prisma
model Appointment {
  id              String            @id @default(uuid())
  clientId        String
  adminId         String?           // Assigned admin (for intake forms)
  
  appointmentDate DateTime
  appointmentTime String            // HH:mm format
  duration        Int               @default(60) // in minutes
  status          AppointmentStatus @default(PENDING)
  
  // Service Details
  serviceType     ServiceType
  serviceName     String?
  notes           String?
  
  // Tracking
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  cancelledAt     DateTime?
  rescheduledFrom String?           // Previous appointment ID
  
  // Relations
  client          Client            @relation(fields: [clientId], references: [id], onDelete: Cascade)
  admin           Admin?            @relation(fields: [adminId], references: [id])
  
  @@index([clientId])
  @@index([adminId])
  @@index([appointmentDate])
  @@index([status])
}
```

### 3.4 Documents Table

```prisma
model Document {
  id            String      @id @default(uuid())
  clientId      String
  uploadedBy    String      // Admin ID
  
  documentName  String
  documentType  DocumentType
  fileUrl       String
  fileSize      Int?       // in bytes
  mimeType      String?
  
  // Description/Meta
  description   String?
  tags          String[]
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  // Relations
  client        Client      @relation(fields: [clientId], references: [id], onDelete: Cascade)
  uploadedByAdmin Admin      @relation(fields: [uploadedBy], references: [id])

  @@index([clientId])
  @@index([uploadedBy])
  @@index([documentType])
}
```

### 3.5 Intake Forms Table (Stores completed intake form data)

```prisma
model IntakeForm {
  id            String      @id @default(uuid())
  clientId      String
  formType      IntakeFormType
  formData      Json         // Stores the complete form submission
  
  // Assessment ID
  assessmentId  String      @unique  // e.g., "TH-CNS-0001"
  
  // Status
  status        FormStatus  @default(DRAFT)
  submittedAt   DateTime?
  reviewedAt    DateTime?
  reviewedBy    String?
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  // Relations
  client        Client      @relation(fields: [clientId], references: [id], onDelete: Cascade)

  @@index([clientId])
  @@index([formType])
  @@index([assessmentId])
  @@index([status])
}
```

### 3.6 Admin Notes Table (Internal notes on clients)

```prisma
model AdminNote {
  id            String    @id @default(uuid())
  clientId      String
  adminId       String
  
  note          String    @db.Text
  
  isPrivate     Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  client        Client    @relation(fields: [clientId], references: [id], onDelete: Cascade)
  admin         Admin     @relation(fields: [adminId], references: [id])

  @@index([clientId])
  @@index([adminId])
}
```

### 3.7 Audit Log Table

```prisma
model AuditLog {
  id          String      @id @default(uuid())
  adminId     String?
  
  action      AuditAction
  entityType  String
  entityId    String?
  
  oldValue    Json?
  newValue    Json?
  
  ipAddress   String?
  userAgent   String?
  
  createdAt   DateTime    @default(now())
  
  // Relations
  admin       Admin?      @relation(fields: [adminId], references: [id])

  @@index([adminId])
  @@index([entityType, entityId])
  @@index([action])
  @@index([createdAt])
}
```

### 3.8 Enums

```prisma
enum AdminRole {
  SUPER_ADMIN    // Full access
  STAFF_ADMIN    // Limited access
}

enum ServiceType {
  COUNSELLING
  DENTAL
  ELITE_SPORT
  FITNESS
  REHAB
  SPA
  GENERAL
}

enum ClientStatus {
  ACTIVE
  INACTIVE
  CANCELLED
  COMPLETED
}

enum AppointmentStatus {
  PENDING
  APPROVED
  CANCELLED
  RESCHEDULED
  COMPLETED
  NO_SHOW
}

enum IntakeFormType {
  COUNSELLING_INTAKE
  DENTAL_INTAKE
  ELITE_SPORT_INTAKE
  FITNESS_ASSESSMENT
  REHAB_ASSESSMENT
  SPA_INTAKE
}

enum FormStatus {
  DRAFT
  SUBMITTED
  REVIEWED
  ARCHIVED
}

enum DocumentType {
  INTAKE_FORM
  MEDICAL_RECORD
  IDENTIFICATION
  INSURANCE
  CONTRACT
  OTHER
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  LOGOUT
  APPROVE
  CANCEL
  UPLOAD
  DOWNLOAD
}
```

---

## 4. API Endpoints

### 4.1 Authentication (`/api/v1/auth`)

```typescript
// POST /api/v1/auth/login
// POST /api/v1/auth/logout
// POST /api/v1/auth/refresh
// GET /api/v1/auth/me
// PUT /api/v1/auth/password
```

### 4.2 Admin Management (`/api/v1/admin`)

```typescript
// GET /api/v1/admin - List all admins (super_admin only)
// GET /api/v1/admin/:id - Get admin by ID
// POST /api/v1/admin - Create new admin
// PUT /api/v1/admin/:id - Update admin
// DELETE /api/v1/admin/:id - Deactivate admin
// PUT /api/v1/admin/:id/role - Update admin role
```

### 4.3 Clients Management (`/api/v1/clients`)

```typescript
// GET /api/v1/clients - List clients (with pagination, search, filter)
// GET /api/v1/clients/:id - Get client details
// PUT /api/v1/clients/:id - Update client
// DELETE /api/v1/clients/:id - Soft delete client
// POST /api/v1/clients/:id/notes - Add admin note
// GET /api/v1/clients/:id/notes - Get client notes
// DELETE /api/v1/clients/:id/notes/:noteId - Delete note
```

### 4.4 Appointments (`/api/v1/appointments`)

```typescript
// GET /api/v1/appointments - List appointments
// GET /api/v1/appointments/:id - Get appointment details
// POST /api/v1/appointments - Create appointment
// PUT /api/v1/appointments/:id - Update appointment
// PUT /api/v1/appointments/:id/status - Update status
// PUT /api/v1/appointments/:id/approve - Approve appointment
// PUT /api/v1/appointments/:id/cancel - Cancel appointment
// PUT /api/v1/appointments/:id/reschedule - Reschedule
// PUT /api/v1/appointments/:id/assign - Assign admin
```

### 4.5 Documents (`/api/v1/documents`)

```typescript
// GET /api/v1/documents - List documents
// GET /api/v1/documents/:id - Get document details
// POST /api/v1/documents - Upload document
// DELETE /api/v1/documents/:id - Delete document
// GET /api/v1/documents/client/:clientId - Get client documents
```

### 4.6 Intake Forms (`/api/v1/intake-forms`)

```typescript
// GET /api/v1/intake-forms - List intake forms
// GET /api/v1/intake-forms/:id - Get form details
// POST /api/v1/intake-forms - Submit new intake form
// PUT /api/v1/intake-forms/:id - Update form
// PUT /api/v1/intake-forms/:id/submit - Submit for review
// PUT /api/v1/intake-forms/:id/review - Mark as reviewed
```

### 4.7 Dashboard Stats (`/api/v1/dashboard`)

```typescript
// GET /api/v1/dashboard/stats - Get overview statistics
// GET /api/v1/dashboard/recent - Recent activity
// GET /api/v1/dashboard/appointments/upcoming - Upcoming appointments
// GET /api/v1/dashboard/appointments/pending - Pending approvals
```

---

## 5. Frontend Architecture

### 5.1 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (shadcn/ui)
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   └── common/
│       ├── DataTable.tsx
│       ├── StatsCard.tsx
│       └── Modal.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── clients/
│   │   ├── ClientList.tsx
│   │   ├── ClientDetail.tsx
│   │   └── ClientForms.tsx
│   ├── appointments/
│   │   ├── AppointmentList.tsx
│   │   └── AppointmentCalendar.tsx
│   ├── documents/
│   │   └── DocumentManager.tsx
│   └── admin/
│       ├── AdminList.tsx
│       └── AdminProfile.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useApi.ts
│   └── usePagination.ts
├── lib/
│   ├── api-client.ts
│   └── utils.ts
├── types/
│   └── api.ts
└── App.tsx
```

### 5.2 Dashboard UI Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  LOGO     Dashboard | Clients | Appointments | Documents | Settings  │
├──────────────────────────────────────────────────────────────────────┤
│  SIDEBAR  │  Welcome, Admin Name                    │  [Logout]      │
│  ───────  │                                              │              │
│  Dashboard│  ┌─────────────────────────────────────────┐ │              │
│  Clients  │  │  OVERVIEW STATS                       │ │              │
│  • List   │  │  ┌────────┐ ┌────────┐ ┌────────┐    │ │              │
│  • Detail │  │  │Clients │ │Appointm │ │Pending │    │ │              │
│  Appoint- │  │  │  248   │ │   89   │ │   12   │    │ │              │
│  ments    │  │  └────────┘ └────────┘ └────────┘    │ │              │
│  Documents│  └─────────────────────────────────────────┘ │              │
│  Settings │                                               │              │
│  ───────  │  ┌─────────────────────────────────────────┐ │              │
│  Audits   │  │  UPCOMING APPOINTMENTS                 │ │              │
│           │  │  ┌────────────────────────────────────┐ │ │              │
│           │  │  │ John Doe - Counselling  │ Jan 15   │ │ │              │
│           │  │  │ Jane Smith - Dental   │ Jan 16   │ │ │              │
│           │  │  │ Mike Johnson - Fitness │ Jan 17   │ │ │              │
│           │  │  └────────────────────────────────────┘ │ │              │
│           │  └─────────────────────────────────────────┘ │              │
│           │                                               │              │
│           │  ┌─────────────────────────────────────────┐ │              │
│           │  │  RECENT CLIENTS                        │ │              │
│           │  │  ┌────────────────────────────────────┐ │ │              │
│           │  │  │ Name        │ Service  │ Status  │ │ │              │
│           │  │  │ John Doe    │ Counsel  │ Active  │ │ │              │
│           │  │  │ Jane Smith  │ Dental   │ New     │ │ │              │
│           │  │  └────────────────────────────────────┘ │ │              │
│           │  └─────────────────────────────────────────┘ │              │
│           └───────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.3 Key Features

#### Dashboard Overview
- Total clients count
- Upcoming appointments (7 days)
- Pending approvals
- Cancelled appointments (this month)
- Recent activity log

#### Client Management
- DataTable with search, filter, sort, pagination
- View full client profile
- Add internal admin notes
- Upload/manage documents (PDF, images)
- Soft delete functionality

#### Appointment Management
- Table view and calendar view
- Approve/cancel/reschedule actions
- Assign admin to appointment
- Real-time status updates

#### Admin Management (Super Admin only)
- Create new admins
- Role assignment (super_admin vs staff_admin)
- Audit log of admin actions

---

## 6. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐                                               │
│   │ Admin Login │                                               │
│   └──────┬──────┘                                               │
│          │ POST /api/v1/auth/login                              │
│          │ {email, password}                                    │
│          ▼                                                       │
│   ┌─────────────┐     ┌─────────────────────────────────┐       │
│   │ Validate    │     │  Return tokens                  │       │
│   │ Credentials │────▶│  {accessToken, refreshToken}    │       │
│   │ (bcrypt)    │     └─────────────────────────────────┘       │
│   └──────┬──────┘                                               │
│          │                                                      │
│   ┌──────▼──────┐     ┌─────────────────────────────────┐       │
│   │ Generate    │     │  Store in localStorage           │       │
│   │ JWT Tokens  │────▶│  accessToken, refreshToken      │       │
│   └─────────────┘     └─────────────────────────────────┘       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Protected Routes (require valid accessToken)           │   │
│   │  GET /api/v1/dashboard                                 │   │
│   │  GET /api/v1/clients                                   │   │
│   │  POST /api/v1/appointments                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Token Refresh (when accessToken expires)              │   │
│   │  POST /api/v1/auth/refresh                             │   │
│   │  {refreshToken} ───▶ New {accessToken, refreshToken}  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Logout                                                 │   │
│   │  POST /api/v1/auth/logout ───▶ Clear tokens            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Security Best Practices

### 7.1 Authentication Security
- Password hashing with bcrypt (cost factor 10+)
- JWT access token expiry: 15 minutes
- JWT refresh token expiry: 7 days
- Secure HTTP-only cookies for tokens (recommended)
- Rate limiting on login endpoints

### 7.2 Authorization
- Role-based access control (RBAC)
- AdminGuard for protected routes
- Method-level security with decorators
- Ownership validation for resources

### 7.3 API Security
- Input validation with class-validator
- DTOs for request validation
- Helmet.js for security headers
- CORS configured for allowed origins
- Rate limiting (100 requests/minute)
- SQL injection prevention (Prisma ORM)

### 7.4 File Upload Security
- Allowed file types validation
- File size limit (10MB max)
- Virus scanning (optional)
- Secure file storage (S3 with presigned URLs)
- Upload logging

### 7.5 Audit Logging
- All admin actions logged
- IP address and user agent captured
- Old/new values for updates
- Retention policy (90 days)

---

## 8. Implementation Phases

### Phase 1: MVP (2 weeks)
- [ ] Admin authentication (login/logout)
- [ ] Admin dashboard overview with stats
- [ ] Client list with search/filter
- [ ] Client detail view
- [ ] Basic appointment management

### Phase 2: Core Features (2 weeks)
- [ ] Intake forms management (6 types)
- [ ] Document upload/management
- [ ] Appointment calendar view
- [ ] Admin notes on clients
- [ ] Super admin features

### Phase 3: Polish (1 week)
- [ ] Responsive design
- [ ] Loading states
- [ ] Confirmation modals
- [ ] Toast notifications
- [ ] Audit logging

---

## 9. Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/takehealth

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
AUDIT_LOG_RETENTION=90
```

---

## 10. Next Steps

1. **Database Schema** - Create Prisma schema and run migrations
2. **Backend API** - Implement NestJS modules with controllers/services
3. **Authentication** - Set up JWT auth guards and strategies
4. **Frontend Setup** - Create React + TypeScript project with Vite
5. **UI Components** - Install and configure shadcn/ui
6. **Dashboard UI** - Build sidebar, header, and main layout
7. **API Integration** - Create API client and hooks
8. **Feature Implementation** - Build each feature module
9. **Testing** - Unit and e2e tests
10. **Deployment** - Docker configuration and CI/CD
