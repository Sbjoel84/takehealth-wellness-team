# TakeHealth Backend Architecture

## Project Folder Structure

```
takehealth-backend/
├── .env.example                    # Environment variables template
├── .env                           # Local environment (gitignored)
├── .eslintrc.js                   # ESLint configuration
├── .prettierrc                    # Prettier configuration
├── .nvmrc                         # Node.js version
├── nest-cli.json                  # NestJS CLI configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts         # Root controller
│   ├── app.service.ts             # Root service
│   │
│   ├── config/
│   │   ├── configuration.ts       # Environment configuration
│   │   ├── database.config.ts     # Database config
│   │   └── swagger.config.ts      # API documentation config
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── filters/
│   │   │   └── global-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   └── audit.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   ├── services/
│   │   │   └── prisma.service.ts
│   │   └── utils/
│   │       └── helpers.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── refresh.strategy.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── refresh-token.dto.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── update-user.dto.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   │
│   │   ├── clients/
│   │   │   ├── clients.module.ts
│   │   │   ├── clients.controller.ts
│   │   │   ├── clients.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-client.dto.ts
│   │   │   │   └── update-client.dto.ts
│   │   │   └── entities/
│   │   │       └── client.entity.ts
│   │   │
│   │   ├── appointments/
│   │   │   ├── appointments.module.ts
│   │   │   ├── appointments.controller.ts
│   │   │   ├── appointments.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-appointment.dto.ts
│   │   │   │   ├── update-appointment.dto.ts
│   │   │   │   └── appointment-status.dto.ts
│   │   │   └── entities/
│   │   │       └── appointment.entity.ts
│   │   │
│   │   ├── storage/
│   │   │   ├── storage.module.ts
│   │   │   ├── storage.controller.ts
│   │   │   ├── storage.service.ts
│   │   │   └── dto/
│   │   │       ├── upload.dto.ts
│   │   │       └── document.dto.ts
│   │   │
│   │   ├── documents/
│   │   │   ├── documents.module.ts
│   │   │   ├── documents.controller.ts
│   │   │   └── documents.service.ts
│   │   │
│   │   ├── branches/
│   │   │   ├── branches.module.ts
│   │   │   ├── branches.controller.ts
│   │   │   └── branches.service.ts
│   │   │
│   │   ├── onboarding/
│   │   │   ├── onboarding.module.ts
│   │   │   ├── onboarding.controller.ts
│   │   │   └── onboarding.service.ts
│   │   │
│   │   ├── approvals/
│   │   │   ├── approvals.module.ts
│   │   │   ├── approvals.controller.ts
│   │   │   └── approvals.service.ts
│   │   │
│   │   ├── audit/
│   │   │   ├── audit.module.ts
│   │   │   ├── audit.controller.ts
│   │   │   └── audit.service.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.controller.ts
│   │   │   └── notifications.service.ts
│   │   │
│   │   └── admin/
│   │       ├── admin.module.ts
│   │       ├── admin.controller.ts
│   │       └── admin.service.ts
│   │
│   └── shared/
│       ├── services/
│       │   ├── cache.service.ts
│       │   ├── email.service.ts
│       │   ├── sms.service.ts
│       │   └── queue.service.ts
│       └── middlewares/
│           ├── logger.middleware.ts
│           └── correlation-id.middleware.ts
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── scripts/
│   ├── backup.sh                 # Database backup script
│   ├── migrate.sh                # Migration script
│   └── seed.ts                   # Database seeder
│
├── logs/
│   ├── application.log
│   ├── error.log
│   └── audit.log
│
└── documentation/
    ├── API.md
    ├── DATABASE.md
    └── DEPLOYMENT.md
```

---

## Business Logic Flows

### 1. Public Registration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PUBLIC REGISTRATION                       │
└─────────────────────────────────────────────────────────────┘

1. User submits registration form
   POST /auth/register
   {
     "email": "user@example.com",
     "password": "securePassword123",
     "firstName": "John",
     "lastName": "Doe",
     "phone": "+2348012345678",
     "serviceType": "COUNSELLING"
   }

2. System creates onboarding form
   ┌─────────────────────────────────────┐
   │ onboarding_forms                     │
   │ status: PENDING                      │
   │ form_data: { ...registration data }  │
   │ created_at: 2024-02-11T...           │
   └─────────────────────────────────────┘

3. Send notification to admins
   ┌─────────────────────────────────────┐
   │ notifications                        │
   │ type: APPROVAL_REQUIRED              │
   │ title: New Client Registration       │
   │ message: New registration pending    │
   └─────────────────────────────────────┘

4. Admin reviews application
   - Login to admin dashboard
   - View pending registrations
   - Review client details

5. Admin decision:
   
   APPROVE:
   ┌─────────────────────────────────────┐
   │ ✓ Create user account               │
   │ ✓ Create client profile             │
   │ ✓ Update status = APPROVED          │
   │ ✓ Send approval notification        │
   │ ✓ Create audit log                  │
   └─────────────────────────────────────┘
   
   REJECT:
   ┌─────────────────────────────────────┐
   │ ✗ Update status = REJECTED          │
   │ ✗ Send rejection notification       │
   │ ✗ Create audit log                   │
   └─────────────────────────────────────┘
```

### 2. Appointment Booking Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    APPOINTMENT BOOKING                       │
└─────────────────────────────────────────────────────────────┘

1. Client books appointment
   POST /appointments
   {
     "clientId": "uuid...",
     "serviceType": "DENTAL",
     "preferredDate": "2024-03-15",
     "preferredTime": "10:00",
     "branchId": "uuid...",
     "reason": "Regular checkup"
   }

2. Validate availability
   - Check branch schedule
   - Check staff availability
   - Verify no conflicts

3. Create appointment record
   ┌─────────────────────────────────────┐
   │ appointments                         │
   │ status: PENDING                      │
   │ appointment_date: 2024-03-15        │
   │ start_time: "10:00"                 │
   │ created_at: 2024-02-11T...          │
   └─────────────────────────────────────┘

4. Create approval request
   ┌─────────────────────────────────────┐
   │ approvals                            │
   │ type: APPOINTMENT_BOOKING           │
   │ status: PENDING                     │
   │ requested_by: client_id             │
   └─────────────────────────────────────┘

5. Admin approval workflow:
   
   APPROVE:
   ┌─────────────────────────────────────┐
   │ ✓ Update appointment = APPROVED   │
   │ ✓ Send confirmation to client      │
   │ ✓ Add to branch schedule           │
   │ ✓ Send reminder notifications      │
   └─────────────────────────────────────┘
   
   RESCHEDULE:
   ┌─────────────────────────────────────┐
   │ ✓ Create new appointment slot      │
   │ ✓ Update status = RESCHEDULED      │
   │ ✓ Notify client of new time        │
   └─────────────────────────────────────┘
   
   CANCEL:
   ┌─────────────────────────────────────┐
   │ ✓ Update appointment = CANCELLED   │
   │ ✓ Free up slot                     │
   │ ✓ Notify client                    │
   └─────────────────────────────────────┘
```

### 3. Document Upload Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DOCUMENT UPLOAD                           │
└─────────────────────────────────────────────────────────────┘

1. Request signed upload URL
   POST /storage/upload-url
   {
     "clientId": "uuid...",
     "documentType": "MEDICAL_RECORD",
     "category": "lab_results",
     "originalName": "blood_test.pdf",
     "mimeType": "application/pdf",
     "fileSize": 1048576
   }

2. Validate request
   - Check user permissions
   - Validate file size (< 50MB)
   - Validate MIME type
   - Check storage quota

3. Generate signed URL
   ┌─────────────────────────────────────┐
   │ Response:                           │
   │ {                                  │
   │   "uploadUrl": "https://...",      │
   │   "filePath": "clients/.../...",  │
   │   "documentId": "uuid...",         │
   │   "expiresIn": 3600                │
   │ }                                  │
   └─────────────────────────────────────┘

4. Client uploads directly to S3
   PUT {uploadUrl}
   Content-Type: application/pdf
   Body: [file binary data]

5. Client confirms upload
   POST /storage/confirm-upload
   {
     "documentId": "uuid...",
     "fileHash": "sha256:..."
   }

6. Verify and finalize
   ┌─────────────────────────────────────┐
   │ ✓ Verify file in S3                 │
   │ ✓ Update document record           │
   │ ✓ Store file hash                  │
   │ ✓ Mark as verified                 │
   │ ✓ Create audit log                 │
   └─────────────────────────────────────┘
```

### 4. Admin Approval Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN APPROVAL WORKFLOW                   │
└─────────────────────────────────────────────────────────────┘

Approval Types:
├── CLIENT_REGISTRATION
│   └── When: New client registers
│   └── Admin action: Review & approve/reject
│   └── Result: Create user account or reject
│
├── APPOINTMENT_BOOKING
│   └── When: Client books appointment
│   └── Admin action: Confirm/reschedule/cancel
│   └── Result: Update appointment status
│
├── DOCUMENT_UPLOAD
│   └── When: Sensitive document uploaded
│   └── Admin action: Review for compliance
│   └── Result: Mark as verified or request new
│
└── SERVICE_REQUEST
    └── When: Client requests service change
    └── Admin action: Evaluate & approve/reject
    └── Result: Update service assignment

Approval Status Flow:
    ┌─────────┐
    │ PENDING │
    └────┬────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 APPROVED  REJECTED
    │         │
    ▼         ▼
 COMPLETE  CANCELLED
```

---

## Security Implementation

### Role-Based Access Control (RBAC)

```typescript
// Permission definitions
const PERMISSIONS = {
  SUPER_ADMIN: [
    'all:read',
    'all:write',
    'all:delete',
    'users:manage',
    'settings:manage',
    'audit:read'
  ],
  STAFF_ADMIN: [
    'clients:read',
    'clients:write',
    'appointments:manage',
    'documents:manage',
    'branches:read'
  ],
  CLIENT: [
    'profile:read',
    'profile:update',
    'own:appointments',
    'own:documents'
  ]
};

// Guard implementation
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.role?.permissions.includes(role));
  }
}
```

### JWT Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    JWT AUTHENTICATION                        │
└─────────────────────────────────────────────────────────────┘

1. Login Request
   POST /auth/login
   { email, password }

2. Verify credentials
   - Check user exists
   - Verify password hash
   - Check account status

3. Generate tokens
   ┌─────────────────────────────────────┐
   │ Access Token: JWT (15 min expiry)   │
   │ Refresh Token: JWT (30 day expiry)  │
   │ Store refresh token in Redis        │
   └─────────────────────────────────────┘

4. Return tokens
   {
     "accessToken": "eyJ...",
     "refreshToken": "eyJ...",
     "expiresIn": 900,
     "user": { ... }
   }

5. Subsequent requests
   Authorization: Bearer {accessToken}

6. Token refresh (when access expires)
   POST /auth/refresh
   { refreshToken }

7. Validate refresh token
   - Check in Redis
   - Generate new access token
```

---

## Error Handling

```typescript
// Global exception filter
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseData = exception.getResponse();
      
      if (typeof responseData === 'object') {
        message = (responseData as any).message || message;
        error = (responseData as any).error || error;
      } else {
        message = responseData as string;
      }
    }

    // Log error
    this.logger.error({
      statusCode: status,
      message,
      error,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString()
    });

    response.status(status).json({
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString()
    });
  }
}
```

---

## Data Validation

```typescript
// Example DTO with class-validator
export class CreateAppointmentDto {
  @IsUUID()
  clientId: string;

  @IsUUID()
  branchId: string;

  @IsEnum(AppointmentServiceType)
  serviceType: AppointmentServiceType;

  @IsDateString()
  appointmentDate: string;

  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:MM format'
  })
  startTime: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}
```

---

## Performance Considerations

### Caching Strategy

```typescript
// Redis cache implementation
@Injectable()
export class CacheService {
  constructor(
    private redis: RedisService,
    private configService: ConfigService
  ) {}

  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await fn();
    await this.redis.setex(key, ttl, JSON.stringify(result));
    return result;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

### Database Query Optimization

```typescript
// Use Prisma select for specific fields
const clients = await prisma.client.findMany({
  select: {
    id: true,
    full_name: true,
    email: true,
    status: true,
    created_at: true
  },
  where: {
    status: 'PENDING'
  },
  orderBy: {
    created_at: 'desc'
  },
  take: 20
});

// Use include for relations
const appointments = await prisma.appointment.findMany({
  include: {
    client: {
      select: {
        full_name: true,
        email: true
      }
    },
    branch: {
      select: {
        name: true,
        address: true
      }
    }
  }
});
```
