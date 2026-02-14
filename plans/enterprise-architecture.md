# TakeHealth Enterprise Architecture
## Inter-Module Communication, Transactions & Event-Driven Design

---

## 1. GLOBAL ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            TAKHEALTH PLATFORM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        API GATEWAY / CONTROLLERS                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        NESTJS SERVICE LAYER                           │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │  │
│  │  │ Clients │ │ Appoint │ │ Documents│ │ Onboard │ │ Approvals│       │  │
│  │  │ Service │ │ Service │ │ Service │ │ Service │ │ Service │       │  │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘       │  │
│  │       │          │          │          │          │              │  │
│  │  ┌────┴──────────┴──────────┴──────────┴──────────┴────┐         │  │
│  │  │              EVENT BUS (EventEmitter2)                  │         │  │
│  │  │   client.registered │ approved │ appointment.booked   │         │  │
│  │  │   document.uploaded │ verified │ approval.completed   │         │  │
│  │  └───────────────────────────────────────────────────────┘         │  │
│  │            │          │          │          │          │            │  │
│  │            ▼          ▼          ▼          ▼          ▼            │  │
│  │  ┌─────────────────────────────────────────────────────────────┐    │  │
│  │  │              ORCHESTRATION & COORDINATION LAYER               │    │  │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │    │  │
│  │  │  │ Notification │  │   Audit      │  │ Cache (Redis)    │   │    │  │
│  │  │  │   Service    │  │   Service    │  │   Service        │   │    │  │
│  │  │  └──────────────┘  └──────────────┘  └──────────────────┘   │    │  │
│  │  └─────────────────────────────────────────────────────────────┘    │  │
│  │                                    │                                 │  │
│  │                                    ▼                                 │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │                      PRISMA ORM (PostgreSQL)                  │  │  │
│  │  │         With Transaction Support & Soft Delete Enforced        │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                              │
│  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DOMAIN EVENTS SYSTEM

### 2.1 Event Definitions

```typescript
// src/shared/events/domain.events.ts

import { IEvent } from '@nestjs/event-emitter';

export interface DomainEvent extends IEvent {
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly metadata?: Record<string, unknown>;
}

// Client Events
export class ClientRegisteredEvent implements DomainEvent {
  readonly eventName = 'client.registered';
  readonly occurredAt = new Date();

  constructor(
    public readonly clientId: string,
    public readonly email: string,
    public readonly serviceType: string,
    public readonly correlationId?: string
  ) {}
}

export class ClientApprovedEvent implements DomainEvent {
  readonly eventName = 'client.approved';
  readonly occurredAt = new Date();

  constructor(
    public readonly clientId: string,
    public readonly userId: string,
    public readonly approvedBy: string,
    public readonly correlationId?: string
  ) {}
}

export class ClientRejectedEvent implements DomainEvent {
  readonly eventName = 'client.rejected';
  readonly occurredAt = new Date();

  constructor(
    public readonly clientId: string,
    public readonly rejectedBy: string,
    public readonly reason: string,
    public readonly correlationId?: string
  ) {}
}

// Appointment Events
export class AppointmentBookedEvent implements DomainEvent {
  readonly eventName = 'appointment.booked';
  readonly occurredAt = new Date();

  constructor(
    public readonly appointmentId: string,
    public readonly clientId: string,
    public readonly branchId: string,
    public readonly serviceType: string,
    public readonly correlationId?: string
  ) {}
}

export class AppointmentApprovedEvent implements DomainEvent {
  readonly eventName = 'appointment.approved';
  readonly occurredAt = new Date();

  constructor(
    public readonly appointmentId: string,
    public readonly clientId: string,
    public readonly approvedBy: string,
    public readonly correlationId?: string
  ) {}
}

export class AppointmentCancelledEvent implements DomainEvent {
  readonly eventName = 'appointment.cancelled';
  readonly occurredAt = new Date();

  constructor(
    public readonly appointmentId: string,
    public readonly clientId: string,
    public readonly cancelledBy: string,
    public readonly reason: string,
    public readonly correlationId?: string
  ) {}
}

// Document Events
export class DocumentUploadedEvent implements DomainEvent {
  readonly eventName = 'document.uploaded';
  readonly occurredAt = new Date();

  constructor(
    public readonly documentId: string,
    public readonly clientId: string,
    public readonly documentType: string,
    public readonly isSensitive: boolean,
    public readonly correlationId?: string
  ) {}
}

export class DocumentVerifiedEvent implements DomainEvent {
  readonly eventName = 'document.verified';
  readonly occurredAt = new Date();

  constructor(
    public readonly documentId: string,
    public readonly clientId: string,
    public readonly verifiedBy: string,
    public readonly correlationId?: string
  ) {}
}

// Approval Events
export class ApprovalRequiredEvent implements DomainEvent {
  readonly eventName = 'approval.required';
  readonly occurredAt = new Date();

  constructor(
    public readonly approvalId: string,
    public readonly approvalType: string,
    public readonly entityId: string,
    public readonly entityType: string,
    public readonly correlationId?: string
  ) {}
}

export class ApprovalCompletedEvent implements DomainEvent {
  readonly eventName = 'approval.completed';
  readonly occurredAt = new Date();

  constructor(
    public readonly approvalId: string,
    public readonly status: 'APPROVED' | 'REJECTED',
    public readonly entityId: string,
    public readonly entityType: string,
    public readonly correlationId?: string
  ) {}
}

// Union type for all events
export type TakeHealthEvent =
  | ClientRegisteredEvent
  | ClientApprovedEvent
  | ClientRejectedEvent
  | AppointmentBookedEvent
  | AppointmentApprovedEvent
  | AppointmentCancelledEvent
  | DocumentUploadedEvent
  | DocumentVerifiedEvent
  | ApprovalRequiredEvent
  | ApprovalCompletedEvent;
```

### 2.2 Event Emitter Module Configuration

```typescript
// src/shared/events/events.module.ts

import { Module, Global } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Global()
@Module({
  providers: [
    {
      provide: 'EVENT_EMITTER',
      useFactory: () =>
        new EventEmitter2({
          wildcard: false,
          delimiter: '.',
          newListener: false,
          removeListener: false,
          maxListeners: 100,
          verboseMemoryLeak: false,
          ignoreErrors: false,
        }),
    },
  ],
  exports: ['EVENT_EMITTER'],
})
export class EventsModule {}
```

---

## 3. EVENT SUBSCRIBERS (Listeners)

### 3.1 Notification Subscriber

```typescript
// src/modules/notifications/events.subscribers.ts

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
import {
  ClientApprovedEvent,
  ClientRejectedEvent,
  AppointmentApprovedEvent,
  AppointmentCancelledEvent,
  DocumentUploadedEvent,
} from '../../shared/events/domain.events';

@Injectable()
export class NotificationsSubscriber {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('client.approved')
  async handleClientApproved(event: ClientApprovedEvent) {
    await this.notificationsService.sendClientApprovalNotification(
      event.clientId,
      event.userId
    );
  }

  @OnEvent('client.rejected')
  async handleClientRejected(event: ClientRejectedEvent) {
    await this.notificationsService.sendClientRejectionNotification(
      event.clientId,
      event.reason
    );
  }

  @OnEvent('appointment.approved')
  async handleAppointmentApproved(event: AppointmentApprovedEvent) {
    await this.notificationsService.sendAppointmentConfirmation(
      event.appointmentId,
      event.clientId
    );
  }

  @OnEvent('appointment.cancelled')
  async handleAppointmentCancelled(event: AppointmentCancelledEvent) {
    await this.notificationsService.sendCancellationNotice(
      event.appointmentId,
      event.clientId,
      event.reason
    );
  }

  @OnEvent('document.uploaded')
  async handleDocumentUploaded(event: DocumentUploadedEvent) {
    if (event.isSensitive) {
      await this.notificationsService.notifyAdminOfSensitiveDocument(
        event.documentId,
        event.clientId
      );
    }
  }
}
```

### 3.2 Audit Subscriber

```typescript
// src/modules/audit/events.subscribers.ts

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditService } from './audit.service';
import { TakeHealthEvent } from '../../shared/events/domain.events';

@Injectable()
export class AuditSubscriber {
  constructor(private readonly auditService: AuditService) {}

  @OnEvent('*', { async: true })
  async handleAnyEvent(event: TakeHealthEvent) {
    // Log all events asynchronously
    await this.auditService.logEvent({
      eventName: event.eventName,
      occurredAt: event.occurredAt,
      metadata: {
        correlationId: event.correlationId,
        ...event,
      },
    });
  }
}
```

---

## 4. PRISMA TRANSACTION PATTERNS

### 4.1 Transaction Helper Service

```typescript
// src/common/services/transaction.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Client, User, OnboardingForm, Approval } from '@prisma/client';

export interface TransactionResult {
  client: Client;
  user: User;
  onboardingForm: OnboardingForm;
  approval: Approval;
}

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates client and all related records in a single transaction
   */
  async createApprovedClient(
    onboardingFormId: string,
    approvedById: string,
    userData: {
      email: string;
      passwordHash: string;
      firstName: string;
      lastName: string;
    }
  ): Promise<TransactionResult> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get onboarding form
      const onboardingForm = await tx.onboardingForm.findUnique({
        where: { id: onboardingFormId },
        include: { client: true },
      });

      if (!onboardingForm) {
        throw new Error('Onboarding form not found');
      }

      if (onboardingForm.status !== 'PENDING') {
        throw new Error('Onboarding form is not pending approval');
      }

      // 2. Create User account
      const user = await tx.user.create({
        data: {
          email: userData.email,
          password_hash: userData.passwordHash,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role_id: await this.getDefaultClientRoleId(tx),
          is_active: true,
          email_verified: true,
        },
      });

      // 3. Create Client profile
      const client = await tx.client.update({
        where: { id: onboardingForm.clientId },
        data: {
          user_id: user.id,
          status: 'APPROVED',
          updated_at: new Date(),
        },
      });

      // 4. Update onboarding form
      const updatedForm = await tx.onboardingForm.update({
        where: { id: onboardingFormId },
        data: {
          status: 'APPROVED',
          reviewed_by: approvedById,
          reviewed_at: new Date(),
        },
      });

      // 5. Find and update related approval
      const approval = await tx.approval.findFirst({
        where: {
          client_id: client.id,
          status: 'PENDING',
          approval_type: 'CLIENT_REGISTRATION',
        },
      });

      if (approval) {
        await tx.approval.update({
          where: { id: approval.id },
          data: {
            status: 'APPROVED',
            reviewed_by: approvedById,
            decision_data: {
              approved_at: new Date().toISOString(),
              client_id: client.id,
            },
          },
        });
      }

      // 6. Create initial notification for client
      await tx.notification.create({
        data: {
          user_id: user.id,
          type: 'ACCOUNT_APPROVED',
          title: 'Account Approved',
          message: 'Your registration has been approved. You can now book appointments.',
          data: { client_id: client.id },
        },
      });

      // 7. Update branch statistics if applicable
      if (client.branch_id) {
        await tx.branch.update({
          where: { id: client.branch_id },
          data: {
            statistics: {
              increment: { total_clients: 1 },
            },
          },
        });
      }

      return {
        client,
        user,
        onboardingForm: updatedForm,
        approval: approval!,
      };
    }, {
      maxWait: 10000, // 10 seconds max wait for transaction
      timeout: 30000, // 30 seconds transaction timeout
    });
  }

  /**
   * Approves appointment in transaction
   */
  async approveAppointment(
    appointmentId: string,
    approvedById: string
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1. Get appointment
      const appointment = await tx.appointment.findUnique({
        where: { id: appointmentId },
        include: { client: true },
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // 2. Update appointment status
      await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: 'APPROVED',
          is_confirmed: true,
          confirmed_at: new Date(),
          updated_at: new Date(),
        },
      });

      // 3. Complete related approval if exists
      await tx.approval.updateMany({
        where: {
          reference_id: appointmentId,
          reference_type: 'appointment',
          status: 'PENDING',
        },
        data: {
          status: 'APPROVED',
          reviewed_by: approvedById,
        },
      });

      // 4. Create notification for client
      await tx.notification.create({
        data: {
          user_id: appointment.client.user_id!,
          type: 'APPOINTMENT_CONFIRMED',
          title: 'Appointment Confirmed',
          message: `Your appointment on ${appointment.appointment_date.toDateString()} has been confirmed.`,
          data: { appointment_id: appointmentId },
        },
      });
    });
  }

  private async getDefaultClientRoleId(tx: Prisma.TransactionClient): Promise<string> {
    const role = await tx.role.findFirst({
      where: { name: 'CLIENT' },
    });
    return role?.id || '';
  }
}
```

---

## 5. CROSS-MODULE ORCHESTRATION SERVICES

### 5.1 Client Orchestration Service

```typescript
// src/modules/clients/orchestration/client-orchestration.service.ts

import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';
import { TransactionService } from '../../../common/services/transaction.service';
import {
  ClientRegisteredEvent,
  ClientApprovedEvent,
} from '../../../shared/events/domain.events';
import { Role, ServiceType } from '@prisma/client';

export interface RegisterClientInput {
  fullName: string;
  email: string;
  phone?: string;
  serviceType: ServiceType;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: any;
  currentMedications?: string;
  allergies?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ApproveClientInput {
  onboardingFormId: string;
  approvedById: string;
  userData: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  };
}

@Injectable()
export class ClientOrchestrationService {
  private readonly logger = new Logger(ClientOrchestrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionService: TransactionService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  /**
   * Registers a new client - creates onboarding form and approval request
   */
  async registerClient(input: RegisterClientInput) {
    const correlationId = this.generateCorrelationId();

    // Check for existing client
    const existingClient = await this.prisma.client.findUnique({
      where: { email: input.email },
    });

    if (existingClient) {
      throw new ConflictException('Client with this email already exists');
    }

    // Generate assessment ID
    const assessmentId = this.generateAssessmentId(input.serviceType);

    // Create client and onboarding form in transaction
    const client = await this.prisma.$transaction(async (tx) => {
      // 1. Create client
      const client = await tx.client.create({
        data: {
          full_name: input.fullName,
          email: input.email,
          phone: input.phone,
          service_type: input.serviceType,
          date_of_birth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
          gender: input.gender?.toUpperCase() as any,
          address: input.address,
          emergency_contact: input.emergencyContact,
          emergency_phone: input.emergencyPhone,
          medical_history: input.medicalHistory,
          current_medications: input.currentMedications,
          allergies: input.allergies,
          status: 'PENDING',
          created_at: new Date(),
        },
      });

      // 2. Create onboarding form
      const onboardingForm = await tx.onboardingForm.create({
        data: {
          client_id: client.id,
          form_type: input.serviceType,
          form_data: {
            medicalHistory: input.medicalHistory,
            currentMedications: input.currentMedications,
            allergies: input.allergies,
          },
          assessment_id: assessmentId,
          status: 'PENDING',
          submitted_at: new Date(),
        },
      });

      // 3. Create approval request
      const approval = await tx.approval.create({
        data: {
          client_id: client.id,
          approval_type: 'CLIENT_REGISTRATION',
          reference_id: client.id,
          reference_type: 'client',
          status: 'PENDING',
          requested_by: client.id,
          request_data: {
            assessmentId,
            serviceType: input.serviceType,
          },
          created_at: new Date(),
        },
      });

      // 4. Create initial notification for admin
      await tx.notification.create({
        data: {
          user_id: await this.getAdminUserId(tx),
          type: 'APPROVAL_REQUIRED',
          title: 'New Client Registration',
          message: `New client ${input.fullName} has registered and awaits approval.`,
          data: {
            client_id: client.id,
            form_id: onboardingForm.id,
            approval_id: approval.id,
          },
        },
      });

      return { client, onboardingForm, approval };
    });

    // Emit domain event
    this.eventEmitter.emit(
      new ClientRegisteredEvent(
        client.client.id,
        client.client.email,
        client.client.service_type,
        correlationId
      )
    );

    this.logger.log(
      `Client registered: ${client.client.id} with assessment ID: ${client.onboardingForm.assessment_id}`
    );

    return {
      id: client.client.id,
      fullName: client.client.full_name,
      email: client.client.email,
      serviceType: client.client.service_type,
      status: client.client.status,
      assessmentId: client.onboardingForm.assessment_id,
      message: 'Registration submitted successfully. Awaiting admin approval.',
    };
  }

  /**
   * Approves a client - creates user account, updates all records
   */
  async approveClient(input: ApproveClientInput) {
    const correlationId = this.generateCorrelationId();

    // Execute transaction
    const result = await this.transactionService.createApprovedClient(
      input.onboardingFormId,
      input.approvedById,
      input.userData
    );

    // Emit domain event
    this.eventEmitter.emit(
      new ClientApprovedEvent(
        result.client.id,
        result.user.id,
        input.approvedById,
        correlationId
      )
    );

    this.logger.log(
      `Client approved: ${result.client.id}, user created: ${result.user.id}`
    );

    return {
      client: result.client,
      user: result.user,
      onboardingForm: result.onboardingForm,
    };
  }

  /**
   * Rejects a client
   */
  async rejectClient(
    clientId: string,
    rejectedById: string,
    reason: string
  ) {
    await this.prisma.$transaction(async (tx) => {
      // Update client status
      await tx.client.update({
        where: { id: clientId },
        data: {
          status: 'REJECTED',
          updated_at: new Date(),
        },
      });

      // Update onboarding form
      await tx.onboardingForm.updateMany({
        where: { client_id: clientId },
        data: {
          status: 'REJECTED',
          review_notes: reason,
          reviewed_by: rejectedById,
          reviewed_at: new Date(),
        },
      });

      // Update approval
      await tx.approval.updateMany({
        where: {
          client_id: clientId,
          approval_type: 'CLIENT_REGISTRATION',
          status: 'PENDING',
        },
        data: {
          status: 'REJECTED',
          reviewed_by: rejectedById,
          decision_data: {
            rejected_at: new Date().toISOString(),
            reason,
          },
        },
      });

      // Get client email for notification
      const client = await tx.client.findUnique({
        where: { id: clientId },
      });

      // Create notification for admin (feedback)
      await tx.notification.create({
        data: {
          user_id: rejectedById,
          type: 'ACCOUNT_REJECTED',
          title: 'Client Rejected',
          message: `Client ${client?.full_name || clientId} has been rejected. Reason: ${reason}`,
          data: { client_id: clientId, reason },
        },
      });
    });

    this.logger.log(`Client rejected: ${clientId}, reason: ${reason}`);
  }

  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAssessmentId(serviceType: ServiceType): string {
    const prefixes: Record<string, string> = {
      COUNSELLING: 'TH-CNS',
      DENTAL: 'TH-DEN',
      ELITE_SPORT: 'TH-ESP',
      FITNESS: 'TH-FIT',
      REHAB: 'TH-RHB',
      SPA: 'TH-SPA',
      NUTRITION: 'TH-NUT',
      GENERAL: 'TH-GEN',
      HEALTH360: 'TH-H360',
    };
    const prefix = prefixes[serviceType] || 'TH-GEN';
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${prefix}-${timestamp}`;
  }

  private async getAdminUserId(tx: any): Promise<string> {
    const admin = await tx.user.findFirst({
      where: {
        role: {
          name: { in: ['SUPER_ADMIN', 'STAFF_ADMIN'] },
        },
        is_active: true,
      },
      take: 1,
    });
    return admin?.id || '';
  }
}
```

### 5.2 Appointment Orchestration Service

```typescript
// src/modules/appointments/orchestration/appointment-orchestration.service.ts

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';
import { TransactionService } from '../../../common/services/transaction.service';
import {
  AppointmentBookedEvent,
  AppointmentApprovedEvent,
  AppointmentCancelledEvent,
} from '../../../shared/events/domain.events';

export interface BookAppointmentInput {
  clientId: string;
  branchId: string;
  serviceType: string;
  appointmentDate: Date;
  startTime: string;
  notes?: string;
  createdById: string;
}

@Injectable()
export class AppointmentOrchestrationService {
  private readonly logger = new Logger(AppointmentOrchestrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionService: TransactionService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  /**
   * Books an appointment - validates, creates record, and triggers approval
   */
  async bookAppointment(input: BookAppointmentInput) {
    const correlationId = this.generateCorrelationId();

    // Validate client is approved
    const client = await this.prisma.client.findUnique({
      where: { id: input.clientId },
    });

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    if (client.status !== 'APPROVED') {
      throw new BadRequestException('Client account must be approved before booking');
    }

    // Validate branch exists and is active
    const branch = await this.prisma.branch.findUnique({
      where: { id: input.branchId },
    });

    if (!branch || !branch.is_active) {
      throw new BadRequestException('Invalid or inactive branch');
    }

    // Check for conflicting appointments
    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        branch_id: input.branchId,
        appointment_date: input.appointmentDate,
        start_time: input.startTime,
        status: { in: ['PENDING', 'CONFIRMED', 'APPROVED'] },
      },
    });

    if (conflictingAppointment) {
      throw new BadRequestException('This time slot is not available');
    }

    // Create appointment in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create appointment
      const appointment = await tx.appointment.create({
        data: {
          client_id: input.clientId,
          branch_id: input.branchId,
          created_by_id: input.createdById,
          appointment_date: input.appointmentDate,
          start_time: input.startTime,
          service_type: input.serviceType as any,
          status: 'PENDING',
          notes: input.notes,
          created_at: new Date(),
        },
      });

      // 2. Create approval request
      const approval = await tx.approval.create({
        data: {
          client_id: input.clientId,
          approval_type: 'APPOINTMENT_BOOKING',
          reference_id: appointment.id,
          reference_type: 'appointment',
          status: 'PENDING',
          requested_by: input.clientId,
          request_data: {
            appointmentDate: input.appointmentDate.toISOString(),
            startTime: input.startTime,
            serviceType: input.serviceType,
            branchId: input.branchId,
          },
        },
      });

      // 3. Notify admin
      await tx.notification.create({
        data: {
          user_id: await this.getAdminUserId(tx),
          type: 'APPROVAL_REQUIRED',
          title: 'New Appointment Request',
          message: `New appointment request for ${input.serviceType} on ${input.appointmentDate.toDateString()}`,
          data: {
            appointment_id: appointment.id,
            approval_id: approval.id,
          },
        },
      });

      return { appointment, approval };
    });

    // Emit domain event
    this.eventEmitter.emit(
      new AppointmentBookedEvent(
        result.appointment.id,
        input.clientId,
        input.branchId,
        input.serviceType,
        correlationId
      )
    );

    this.logger.log(
      `Appointment booked: ${result.appointment.id}, approval pending: ${result.approval.id}`
    );

    return {
      id: result.appointment.id,
      clientId: result.appointment.client_id,
      branchId: result.appointment.branch_id,
      appointmentDate: result.appointment.appointment_date,
      startTime: result.appointment.start_time,
      status: result.appointment.status,
      message: 'Appointment booked successfully. Awaiting admin approval.',
    };
  }

  /**
   * Approves an appointment
   */
  async approveAppointment(appointmentId: string, approvedById: string) {
    await this.transactionService.approveAppointment(appointmentId, approvedById);

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    this.eventEmitter.emit(
      new AppointmentApprovedEvent(
        appointmentId,
        appointment!.client_id,
        approvedById
      )
    );

    this.logger.log(`Appointment approved: ${appointmentId}`);

    return { success: true, appointmentId };
  }

  /**
   * Cancels an appointment
   */
  async cancelAppointment(
    appointmentId: string,
    cancelledById: string,
    reason: string
  ) {
    await this.prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.findUnique({
        where: { id: appointmentId },
      });

      if (!appointment) {
        throw new BadRequestException('Appointment not found');
      }

      // Update appointment
      await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: 'CANCELLED',
          cancel_reason: reason,
          cancelled_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Update related approval
      await tx.approval.updateMany({
        where: {
          reference_id: appointmentId,
          reference_type: 'appointment',
          status: 'PENDING',
        },
        data: {
          status: 'CANCELLED',
          decision_data: {
            cancelled_at: new Date().toISOString(),
            cancelled_by: cancelledById,
            reason,
          },
        },
      });
    });

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    this.eventEmitter.emit(
      new AppointmentCancelledEvent(
        appointmentId,
        appointment!.client_id,
        cancelledById,
        reason
      )
    );

    this.logger.log(`Appointment cancelled: ${appointmentId}, reason: ${reason}`);
  }

  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getAdminUserId(tx: any): Promise<string> {
    const admin = await tx.user.findFirst({
      where: {
        role: {
          name: { in: ['SUPER_ADMIN', 'STAFF_ADMIN'] },
        },
        is_active: true,
      },
      take: 1,
    });
    return admin?.id || '';
  }
}
```

### 5.3 Document Orchestration Service

```typescript
// src/modules/documents/orchestration/document-orchestration.service.ts

import { Injectable, Logger, ForbiddenException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';
import { StorageService } from '../../storage/storage.service';
import {
  DocumentUploadedEvent,
  DocumentVerifiedEvent,
} from '../../../shared/events/domain.events';

export interface InitiateUploadInput {
  clientId: string;
  uploadedById: string;
  documentType: string;
  category?: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  branchId?: string;
}

@Injectable()
export class DocumentOrchestrationService {
  private readonly logger = new Logger(DocumentOrchestrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  /**
   * Initiates document upload - validates, generates signed URL, creates metadata
   */
  async initiateUpload(input: InitiateUploadInput) {
    // Validate client access
    const client = await this.prisma.client.findUnique({
      where: { id: input.clientId },
    });

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    // Generate signed upload URL
    const uploadResult = await this.storageService.generateUploadUrl({
      userId: input.uploadedById,
      clientId: input.clientId,
      documentType: input.documentType,
      category: input.category,
      originalName: input.originalName,
      mimeType: input.mimeType,
      fileSize: input.fileSize,
      branchId: input.branchId,
    });

    // Emit upload initiated event (for audit)
    this.logger.log(
      `Document upload initiated: ${uploadResult.documentId} for client: ${input.clientId}`
    );

    return {
      uploadUrl: uploadResult.uploadUrl,
      documentId: uploadResult.documentId,
      filePath: uploadResult.filePath,
      expiresIn: uploadResult.expiresIn,
    };
  }

  /**
   * Confirms document upload - verifies S3 object, updates status
   */
  async confirmUpload(documentId: string, uploadedById: string, fileHash: string) {
    // Get document
    const document = await this.prisma.clientDocument.findUnique({
      where: { id: documentId },
      include: { client: true },
    });

    if (!document) {
      throw new BadRequestException('Document not found');
    }

    if (document.uploaded_by_id !== uploadedById) {
      throw new ForbiddenException('You can only confirm your own uploads');
    }

    // Verify file in S3 and update hash
    await this.storageService.confirmUpload(documentId, fileHash);

    // Determine if document is sensitive
    const isSensitive = this.isSensitiveDocument(document.document_type);

    // Emit domain event
    this.eventEmitter.emit(
      new DocumentUploadedEvent(
        documentId,
        document.client_id,
        document.document_type,
        isSensitive
      )
    );

    this.logger.log(
      `Document confirmed: ${documentId}, sensitive: ${isSensitive}`
    );

    return {
      documentId,
      status: 'UPLOADED',
      isSensitive,
      message: 'Document uploaded successfully. Awaiting verification.',
    };
  }

  /**
   * Verifies a document - admin action
   */
  async verifyDocument(documentId: string, verifiedById: string) {
    const document = await this.prisma.clientDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new BadRequestException('Document not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.clientDocument.update({
        where: { id: documentId },
        data: {
          is_verified: true,
          verified_by: verifiedById,
          verified_at: new Date(),
        },
      });
    });

    this.eventEmitter.emit(
      new DocumentVerifiedEvent(
        documentId,
        document.client_id,
        verifiedById
      )
    );

    this.logger.log(`Document verified: ${documentId} by: ${verifiedById}`);

    return { success: true, documentId };
  }

  /**
   * Validates document access for a user
   */
  async validateAccess(documentId: string, userId: string, userRole: string): Promise<boolean> {
    const document = await this.prisma.clientDocument.findUnique({
      where: { id: documentId },
      include: { client: true },
    });

    if (!document) {
      return false;
    }

    // Admins have full access
    if (['SUPER_ADMIN', 'STAFF_ADMIN'].includes(userRole)) {
      return true;
    }

    // Clients can only access their own documents
    if (userRole === 'CLIENT') {
      return document.client?.user_id === userId;
    }

    return false;
  }

  private isSensitiveDocument(documentType: string): boolean {
    const sensitiveTypes = [
      'MEDICAL_RECORD',
      'LAB_RESULT',
      'PRESCRIPTION',
      'ID_VERIFICATION',
      'INSURANCE_DOC',
    ];
    return sensitiveTypes.includes(documentType);
  }
}
```

---

## 6. DEPENDENCY INJECTION & MODULE CONFIGURATION

### 6.1 App Module (Root)

```typescript
// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PassportModule } from '@nestjs/passport';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { configuration } from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './shared/events/events.module';

import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditModule } from './modules/audit/audit.module';
import { StorageModule } from './modules/storage/storage.module';
import { BranchesModule } from './modules/branches/branches.module';
import { CacheModule } from './shared/cache/cache.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // Event Emitter (Global)
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 100,
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Authentication
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Core Modules
    PrismaModule,
    EventsModule,
    CacheModule,

    // Feature Modules
    AuthModule,
    ClientsModule,
    AppointmentsModule,
    DocumentsModule,
    OnboardingModule,
    ApprovalsModule,
    NotificationsModule,
    AuditModule,
    StorageModule,
    BranchesModule,
  ],
})
export class AppModule {}
```

### 6.2 Clients Module

```typescript
// src/modules/clients/clients.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientOrchestrationService } from './orchestration/client-orchestration.service';
import { ClientsSubscriber } from './subscribers/clients.subscriber';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ApprovalsModule } from '../approvals/approvals.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    NotificationsModule,
    forwardRef(() => ApprovalsModule),
  ],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ClientOrchestrationService,
    ClientsSubscriber,
  ],
  exports: [ClientsService, ClientOrchestrationService],
})
export class ClientsModule {}
```

---

## 7. EVENT SUBSCRIBERS (Cross-Module Communication)

### 7.1 Clients Subscriber

```typescript
// src/modules/clients/subscribers/clients.subscriber.ts

import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientApprovedEvent } from '../../../shared/events/domain.events';
import { CacheService } from '../../../shared/cache/cache.service';

@Injectable()
export class ClientsSubscriber {
  private readonly logger = new Logger(ClientsSubscriber.name);

  constructor(private readonly cacheService: CacheService) {}

  @OnEvent('client.approved', { async: true })
  async handleClientApproved(event: ClientApprovedEvent) {
    // Invalidate client-related caches
    await this.cacheService.invalidatePattern(`clients:*`);
    await this.cacheService.invalidatePattern(`dashboard:*`);

    this.logger.log(
      `Cache invalidated for approved client: ${event.clientId}`
    );
  }
}
```

### 7.2 Appointments Subscriber

```typescript
// src/modules/appointments/subscribers/appointments.subscriber.ts

import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AppointmentBookedEvent,
  AppointmentApprovedEvent,
} from '../../../shared/events/domain.events';
import { CacheService } from '../../../shared/cache/cache.service';

@Injectable()
export class AppointmentsSubscriber {
  private readonly logger = new Logger(AppointmentsSubscriber.name);

  constructor(private readonly cacheService: CacheService) {}

  @OnEvent('appointment.booked', { async: true })
  async handleAppointmentBooked(event: AppointmentBookedEvent) {
    // Invalidate appointment caches
    await this.cacheService.invalidatePattern(`appointments:*`);
    await this.cacheService.invalidatePattern(`dashboard:*`);

    this.logger.log(
      `Cache invalidated for new appointment: ${event.appointmentId}`
    );
  }

  @OnEvent('appointment.approved', { async: true })
  async handleAppointmentApproved(event: AppointmentApprovedEvent) {
    // Invalidate appointment and dashboard caches
    await this.cacheService.invalidatePattern(`appointments:*`);
    await this.cacheService.invalidatePattern(`dashboard:*`);

    this.logger.log(
      `Cache invalidated for approved appointment: ${event.appointmentId}`
    );
  }
}
```

---

## 8. RBAC & SECURITY ENFORCEMENT

### 8.1 Ownership Validator

```typescript
// src/common/guards/ownership.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_OWNER_KEY } from '../decorators/owner.decorator';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isOwnerOnly = this.reflector.getAllAndOverride<boolean>(IS_OWNER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isOwnerOnly) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id || request.params.clientId;

    if (!resourceId) {
      throw new ForbiddenException('Resource ID not found');
    }

    // Get user's role and client profile
    const userWithProfile = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { client_profile: true },
    });

    // Super admin and staff bypass ownership check
    if (['SUPER_ADMIN', 'STAFF_ADMIN'].includes(user.role?.name)) {
      return true;
    }

    // Client can only access their own resources
    if (user.role?.name === 'CLIENT') {
      const clientProfile = userWithProfile?.client_profile;
      
      if (clientProfile && clientProfile.id !== resourceId) {
        throw new ForbiddenException(
          'You do not have permission to access this resource'
        );
      }
    }

    return true;
  }
}
```

### 8.2 Document Access Guard

```typescript
// src/common/guards/document-access.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentsService } from '../../modules/documents/documents.service';

@Injectable()
export class DocumentAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly documentsService: DocumentsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const documentId = request.params.documentId || request.params.id;

    if (!documentId) {
      return true;
    }

    const hasAccess = await this.documentsService.validateAccess(
      documentId,
      user.id,
      user.role?.name
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not have permission to access this document'
      );
    }

    return true;
  }
}
```

---

## 9. CACHE SERVICE (Redis)

```typescript
// src/shared/cache/cache.service.ts

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit {
  private readonly logger = new Logger(CacheService.name);
  private redis: Redis;
  private readonly keyPrefix: string;

  constructor(private readonly configService: ConfigService) {
    this.keyPrefix = this.configService.get('redis.keyPrefix') || 'takehealth:';
  }

  async onModuleInit() {
    const host = this.configService.get('redis.host') || 'localhost';
    const port = this.configService.get('redis.port') || 6379;
    const password = this.configService.get('redis.password');

    this.redis = new Redis({
      host,
      port,
      password: password || undefined,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis');
    });

    this.redis.on('error', (err) => {
      this.logger.error('Redis error:', err);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(this.prefixKey(key));
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    await this.redis.setex(
      this.prefixKey(key),
      ttlSeconds,
      JSON.stringify(value)
    );
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(this.prefixKey(key));
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(this.prefixKey(pattern));
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  async invalidatePatternAsync(pattern: string): Promise<void> {
    // Fire and forget - don't await
    this.invalidatePattern(pattern).catch((err) => {
      this.logger.error(`Failed to invalidate pattern ${pattern}:`, err);
    });
  }

  private prefixKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  // Dashboard stats caching example
  async getDashboardStats(): Promise<any> {
    return this.get('dashboard:stats');
  }

  async setDashboardStats(data: any, ttlSeconds: number = 300): Promise<void> {
    await this.set('dashboard:stats', data, ttlSeconds);
  }
}
```

---

## 10. WORKFLOW SUMMARY

### A. Public Registration Workflow

```
1. POST /clients/register
   └─> ClientOrchestrationService.registerClient()
       ├─> Prisma: Create client (PENDING)
       ├─> Prisma: Create onboarding form
       ├─> Prisma: Create approval request
       ├─> Emit: client.registered event
       └─> Return: assessment ID

2. @OnEvent('client.registered')
   └─> NotificationsSubscriber: Notify admin
   └─> AuditSubscriber: Log action

3. POST /clients/approve
   └─> ClientOrchestrationService.approveClient()
       └─> TransactionService.createApprovedClient()
           ├─> Prisma Transaction:
           │   ├─> Create user account
           │   ├─> Update client (APPROVED)
           │   ├─> Update onboarding (APPROVED)
           │   ├─> Update approval (APPROVED)
           │   └─> Create notification
           └─> Emit: client.approved event

4. @OnEvent('client.approved')
   └─> NotificationsSubscriber: Send approval email
   └─> CacheSubscriber: Invalidate caches
   └─> AuditSubscriber: Log action
```

### B. Appointment Booking Workflow

```
1. POST /appointments/book
   └─> AppointmentOrchestrationService.bookAppointment()
       ├─> Validate client (must be APPROVED)
       ├─> Validate branch
       ├─> Check availability
       ├─> Prisma Transaction:
       │   ├─> Create appointment (PENDING)
       │   └─> Create approval request
       └─> Emit: appointment.booked event

2. @OnEvent('appointment.booked')
   └─> NotificationsSubscriber: Alert admin
   └─> AuditSubscriber: Log action

3. PUT /appointments/:id/approve
   └─> TransactionService.approveAppointment()
       ├─> Prisma Transaction:
       │   ├─> Update appointment (APPROVED)
       │   └─> Complete approval
       └─> Emit: appointment.approved event

4. @OnEvent('appointment.approved')
   └─> NotificationsSubscriber: Confirm to client
   └─> CacheSubscriber: Invalidate caches
```

### C. Document Upload Workflow

```
1. POST /documents/initiate
   └─> DocumentOrchestrationService.initiateUpload()
       ├─> Validate client access
       ├─> StorageService: Generate signed URL
       └─> Return: upload URL

2. Client uploads directly to S3

3. POST /documents/confirm
   └─> DocumentOrchestrationService.confirmUpload()
       ├─> StorageService: Verify S3 object
       ├─> Prisma: Update document status
       └─> Emit: document.uploaded event

4. @OnEvent('document.uploaded')
   └─> If sensitive: Notify admin
   └─> AuditSubscriber: Log action

5. PUT /documents/:id/verify (Admin)
   └─> DocumentOrchestrationService.verifyDocument()
       ├─> Prisma: Update verification status
       └─> Emit: document.verified event
```

---

## 11. DEPENDENCY GRAPH

```
                    ┌─────────────────┐
                    │    AppModule     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────────┐
│  AuthModule   │   │ ClientsModule │   │ AppointmentsModule│
└───────┬───────┘   └───────┬───────┘   └───────┬───────────┘
        │                   │                    │
        │    ┌──────────────┼────────────────────┘
        │    │              │
        ▼    ▼              ▼
┌─────────────────────────────────────────────────────┐
│              EventsModule (EventEmitter2)            │
│                                                     │
│   client.registered → NotificationsSubscriber       │
│   client.approved → NotificationsSubscriber        │
│   appointment.booked → NotificationsSubscriber     │
│   appointment.approved → CacheSubscriber            │
│   document.uploaded → NotificationsSubscriber      │
└─────────────────────────────────────────────────────┘
        │              │              │
        ▼              ▼              ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│    AuditModule│ │  CacheModule  │ │Notifications  │
│  (Audit logs) │ │   (Redis)     │ │   (Email/SMS) │
└───────────────┘ └───────────────┘ └───────────────┘
```

---

## 12. SECURITY ENFORCEMENT LAYERS

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Network                                               │
│  ├── HTTPS enforced                                             │
│  ├── Rate limiting (ThrottlerModule)                           │
│  └── CORS configuration                                         │
│                                                                  │
│  Layer 2: Authentication                                        │
│  ├── JwtAuthGuard (all protected routes)                        │
│  ├── JWT token validation                                       │
│  └── Refresh token rotation                                     │
│                                                                  │
│  Layer 3: Authorization                                         │
│  ├── RolesGuard (role-based access)                            │
│  ├── OwnershipGuard (resource ownership)                        │
│  └── DocumentAccessGuard (document-level access)               │
│                                                                  │
│  Layer 4: Data Validation                                       │
│  ├── DTO validation (class-validator)                          │
│  ├── Entity validation (class-transformer)                      │
│  └── Custom validation pipes                                    │
│                                                                  │
│  Layer 5: Query Security                                        │
│  ├── Soft delete filtering (deleted_at IS NULL)                 │
│  ├── User-scoped queries                                        │
│  └── Role-based data filtering                                  │
│                                                                  │
│  Layer 6: Audit & Monitoring                                    │
│  ├── All actions logged                                         │
│  ├── IP address recording                                       │
│  └── Suspicious activity detection                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. ERROR HANDLING & TRANSACTIONS

```typescript
// Example: Comprehensive error handling in orchestration

async function complexWorkflow(clientId: string, adminId: string) {
  try {
    return await this.prisma.$transaction(
      async (tx) => {
        // Step 1: Get client
        const client = await tx.client.findUnique({
          where: { id: clientId },
        });

        if (!client) {
          throw new NotFoundException('Client not found');
        }

        // Step 2: Validate status
        if (client.status !== 'PENDING') {
          throw new BadRequestException(
            'Client is not pending approval'
          );
        }

        // Step 3: Perform action
        const updated = await tx.client.update({
          where: { id: clientId },
          data: { status: 'APPROVED' },
        });

        // Step 4: Related operations
        await tx.notification.create({
          data: { /* ... */ },
        });

        return updated;
      },
      {
        maxWait: 10000,
        timeout: 30000,
      }
    );
  } catch (error) {
    // Log error
    this.logger.error(
      `Transaction failed for client ${clientId}:`,
      error
    );

    // Re-throw with context
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new InternalServerErrorException(
        'Database operation failed'
      );
    }

    throw error;
  }
}
```

---

## 14. PERFORMANCE OPTIMIZATION

### 14.1 Query Optimization

```typescript
// Bad: N+1 query problem
const clients = await prisma.client.findMany();
for (const client of clients) {
  const appointments = await prisma.appointment.findMany({
    where: { client_id: client.id },
  }); // ❌ N+1 queries!
}

// Good: Using include
const clients = await prisma.client.findMany({
  include: {
    appointments: {
      where: { status: 'APPROVED' },
      take: 5,
    },
    documents: {
      where: { is_verified: true },
    },
  },
}); // ✅ Single query

// Good: Using select for specific fields
const clients = await prisma.client.findMany({
  select: {
    id: true,
    full_name: true,
    email: true,
    status: true,
  },
});
```

### 14.2 Cache Strategy

```typescript
// Dashboard stats - cached for 5 minutes
@OnEvent('client.registered')
async handleNewClient() {
  // Invalidate old cache
  await this.cacheService.invalidatePattern('dashboard:stats');
}

// In service
async getDashboardStats() {
  const cached = await this.cacheService.getDashboardStats();
  if (cached) {
    return cached;
  }

  const stats = await this.calculateStats();
  await this.cacheService.setDashboardStats(stats, 300); // 5 min TTL

  return stats;
}
```

---

This architecture provides:
- **Decoupled modules** communicating via events
- **Atomic transactions** for data consistency
- **Event-driven coordination** for notifications and caching
- **Role-based security** at multiple layers
- **Audit logging** for compliance
- **Performance optimization** via caching and query optimization
