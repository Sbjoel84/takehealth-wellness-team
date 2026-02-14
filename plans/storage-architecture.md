# TakeHealth Storage Architecture

## Overview
Production-ready cloud storage design for healthcare document management with HIPAA-compliant security measures.

---

## 1. Bucket Structure

### Primary Bucket: `takehealth-storage`

```
takehealth-storage/
├── clients/                          # Client-specific files
│   ├── {client_id}/                  # UUID-based client folder
│   │   ├── documents/                # Medical records, ID verification
│   │   │   ├── medical_records/
│   │   │   ├── lab_results/
│   │   │   ├── prescriptions/
│   │   │   ├── id_verification/
│   │   │   ├── insurance_docs/
│   │   │   └── consent_forms/
│   │   ├── profile/                  # Profile pictures
│   │   │   ├── avatar/
│   │   │   └── identification/
│   │   └── onboarding/               # Onboarding documents
│   │       ├── intake_forms/
│   │       └── health_assessments/
│   │
├── appointments/                     # Appointment-related files
│   ├── {appointment_id}/             # UUID-based appointment folder
│   │   ├── attachments/
│   │   │   ├── reports/
│   │   │   ├── images/
│   │   │   └── other/
│   │   └── notes/
│   │
├── admin/                            # Admin-specific uploads
│   ├── staff/{staff_id}/             # Staff documents
│   ├── branch/{branch_id}/            # Branch documents
│   └── system/                       # System-wide documents
│       ├── templates/
│       └── policies/
│
├── temp/                             # Temporary uploads (auto-cleanup)
│   ├── uploads/
│   └── processing/
│
└── backups/                          # Database backups
    ├── daily/
    ├── weekly/
    └── monthly/
```

---

## 2. Environment Separation

### Development Environment
```
takehealth-dev-storage/
├── clients/
├── appointments/
├── admin/
└── temp/
```

### Staging Environment
```
takehealth-staging-storage/
├── clients/
├── appointments/
├── admin/
└── temp/
```

### Production Environment
```
takehealth-prod-storage/
├── clients/
├── appointments/
├── admin/
├── temp/
└── backups/
```

---

## 3. File Naming Conventions

### Pattern: `{timestamp}_{uuid}_{original_name}`

**Examples:**
```
# Client document
1707652800000_a1b2c3d4e5f6_medical_report.pdf

# Profile picture
1707652800000_a1b2c3d4e5f6_profile.jpg

# Appointment attachment
1707652800000_f6e5d4c3b2a1_lab_result.png
```

### Allowed Characters
- Alphanumeric: `a-z`, `A-Z`, `0-9`
- Underscore: `_`
- Hyphen: `-`
- Dot: `.` (before extension only)

### Maximum Length
- File name: 255 characters
- Path: 1024 characters

---

## 4. File Metadata Storage (Database)

### Documents Table Schema

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| client_id | UUID | Foreign key to client |
| uploaded_by_id | UUID | Foreign key to uploader |
| document_type | Enum | medical_record, id_verification, etc. |
| category | String | Sub-category |
| file_name | String | Stored file name |
| original_name | String | Original file name |
| file_url | String | Full S3 URL |
| file_path | String | S3 storage path |
| file_size | Int | Size in bytes |
| mime_type | String | MIME type |
| file_hash | String | SHA-256 hash |
| encryption_key | String | Encryption reference |
| is_verified | Boolean | Verification status |
| created_at | DateTime | Creation timestamp |
| expires_at | DateTime | Document expiry |

---

## 5. Security Implementation

### A. Access Control

#### Role-Based Access
```typescript
// RBAC Matrix
const ACCESS_POLICY = {
  CLIENT: {
    own_documents: ['read', 'download'],
    own_profile: ['read', 'update'],
    appointments: ['create', 'read', 'cancel']
  },
  STAFF: {
    branch_documents: ['read', 'upload'],
    branch_appointments: ['create', 'read', 'update'],
    client_profiles: ['read']
  },
  ADMIN: {
    all_documents: ['read', 'upload', 'delete'],
    all_appointments: ['create', 'read', 'update', 'delete'],
    all_clients: ['read', 'update', 'delete'],
    audit_logs: ['read'],
    system_settings: ['read', 'update']
  },
  SUPER_ADMIN: {
    full_access: ['*']
  }
}
```

### B. Signed URLs

#### Generate Signed Upload URL
```typescript
async function generateUploadUrl(
  userId: string,
  clientId: string,
  documentType: string,
  fileName: string,
  mimeType: string
): Promise<{ uploadUrl: string; filePath: string; expiresIn: number }> {
  const filePath = generateFilePath(clientId, documentType, fileName);
  const expiresIn = 3600; // 1 hour

  const uploadUrl = await s3.getSignedUrl('putObject', {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: filePath,
    ContentType: mimeType,
    Expires: expiresIn,
    ACL: 'private',
    Metadata: {
      'uploaded-by': userId,
      'client-id': clientId,
      'document-type': documentType
    }
  });

  return { uploadUrl, filePath, expiresIn };
}
```

#### Generate Signed Download URL
```typescript
async function generateDownloadUrl(
  userId: string,
  filePath: string,
  documentId: string
): Promise<{ downloadUrl: string; expiresIn: number }> {
  // Validate user access
  const hasAccess = await validateDocumentAccess(userId, documentId);
  if (!hasAccess) {
    throw new ForbiddenException('Access denied');
  }

  const expiresIn = 900; // 15 minutes

  const downloadUrl = await s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: filePath,
    Expires: expiresIn,
    ResponseContentDisposition: 'attachment'
  });

  return { downloadUrl, expiresIn };
}
```

### C. File Validation

#### Upload Validation
```typescript
const UPLOAD_CONSTRAINTS = {
  maxFileSize: {
    profile_picture: 5 * 1024 * 1024,      // 5MB
    medical_document: 50 * 1024 * 1024,     // 50MB
    general_document: 25 * 1024 * 1024,     // 25MB
    image: 10 * 1024 * 1024                 // 10MB
  },
  allowedMimeTypes: {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    medical: [
      'application/pdf',
      'image/dicom',
      'application/hl7-v2'
    ]
  },
  blockedMimeTypes: [
    'application/x-executable',
    'application/x-msdownload',
    'application/javascript',
    'text/html'
  ]
};
```

### D. Encryption

#### Server-Side Encryption (SSE)
```typescript
// S3 Bucket Server-Side Encryption
const s3EncryptionConfig = {
  ServerSideEncryption: 'AES256',
  SSEKMSKeyId: process.env.AWS_KMS_KEY_ID,
  BucketKeyEnabled: true
};

// Client-Side Encryption (for sensitive documents)
const encryptionConfig = {
  algorithm: 'aes-256-gcm',
  keyDerivation: 'pbkdf2',
  iterations: 100000
};
```

---

## 6. Backup Strategy

### A. Database Backups

```bash
# Daily automated backup (pg_dump)
0 2 * * * pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
  -Fc -Z 9 > /backups/daily/takehealth_$(date +\%Y\%m\%d).dump

# Weekly full backup (Sunday)
0 3 * * 0 pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
  -Fc -Z 9 > /backups/weekly/takehealth_week$(date +\%U).dump
```

### B. Object Storage Versioning

```bash
# S3 Bucket Versioning Configuration
aws s3api put-bucket-versioning \
  --bucket takehealth-storage \
  --versioning-configuration Status=Enabled

# Lifecycle Policy - 30-day retention
aws s3api put-bucket-lifecycle-configuration \
  --bucket takehealth-storage \
  --lifecycle-configuration file://lifecycle.json
```

### C. Lifecycle Policy

```json
{
  "Rules": [
    {
      "ID": "DeleteOldVersions",
      "Status": "Enabled",
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 30
      }
    },
    {
      "ID": "MoveToGlacier",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "GLACIER_IR"
        }
      ]
    }
  ]
}
```

---

## 7. Scalability Design

### A. Stateless Backend

```
┌─────────────────┐     ┌─────────────────┐
│   Load Balancer │────▶│  NestJS App 1   │
│   (ALB)         │     │  (Stateless)    │
└─────────────────┘     └─────────────────┘
                              │
                              ▼
┌─────────────────┐     ┌─────────────────┐
│   CloudFront    │◀────│  NestJS App 2   │
│   (CDN)         │     │  (Stateless)    │
└─────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌─────────────────┐
                        │   S3 Storage    │
                        │   (Scalable)    │
                        └─────────────────┘
```

### B. CDN Configuration

```typescript
const cloudfrontConfig = {
  defaultCacheBehavior: {
    AllowedMethods: ['GET', 'HEAD'],
    TargetOriginId: 'S3-takehealth-storage',
    ForwardedValues: {
      QueryString: false,
      Cookies: { Forward: 'none' }
    },
    ViewerProtocolPolicy: 'redirect-http-to-https',
    Compress: true
  },
  restrictions: {
    GeoRestriction: {
      RestrictionType: 'whitelist',
      Locations: ['NG', 'US', 'GB'] // Allowed countries
    }
  }
};
```

### C. Environment Configuration

```typescript
// configuration.ts
export default () => ({
  storage: {
    provider: process.env.STORAGE_PROVIDER, // 's3' or 'supabase'
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.AWS_S3_ENDPOINT // For MinIO/local dev
    },
    supabase: {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_ANON_KEY,
      bucket: process.env.SUPABASE_BUCKET
    }
  }
});
```

---

## 8. Monitoring & Logging

### A. CloudWatch Metrics

```yaml
Metrics:
  - BucketSizeBytes
  - NumberOfObjects
  - AllRequests
  - GetRequests
  - PutRequests
  - DeleteRequests
  - BytesDownloaded
  - BytesUploaded
```

### B. Access Logging

```bash
# S3 Server Access Logging
aws s3api put-bucket-logging \
  --bucket takehealth-storage \
  --bucket-logging-status file://logging-config.json
```

```json
{
  "LoggingEnabled": {
    "TargetBucket": "takehealth-logs",
    "TargetPrefix": "access-logs/"
  }
}
```

---

## 9. Disaster Recovery

### A. Cross-Region Replication

```yaml
# S3 Cross-Region Replication
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  ReplicationRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: s3.amazonaws.com
            Action: sts:AssumeRole
  ReplicaBucket:
    Type: AWS::S3::Bucket
    Properties:
      ReplicationConfiguration:
        Role: !GetAtt ReplicationRole.Arn
        Rules:
          - Destination:
              Bucket: !Join ['', ['arn:aws:s3:::', !Ref ReplicaBucketName]]
              StorageClass: STANDARD_IA
            Status: Enabled
```

### B. RTO/RPO Targets

| Metric | Target | Description |
|--------|--------|-------------|
| RPO | 1 hour | Maximum data loss |
| RTO | 4 hours | Recovery time objective |
| Backup Frequency | Every 1 hour | Transaction log backups |
| Test Frequency | Monthly | DR simulation tests |
