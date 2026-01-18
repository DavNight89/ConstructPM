# Workflows Module - Implementation Documentation

**Purpose**: Complete documentation for the Workflows module with execution engine, conditional logic, and action handlers

**Last Updated**: November 3, 2025

**Author**: Development Team

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Database Schemas](#database-schemas)
- [API Endpoints](#api-endpoints)
- [Execution Engine](#execution-engine)
- [Action Handlers](#action-handlers)
- [Condition Evaluator](#condition-evaluator)
- [Usage Examples](#usage-examples)
- [Testing](#testing)

## Overview

The Workflows module provides a powerful automation engine that allows users to create custom workflows triggered by various events. It supports:

- **Multiple Trigger Types**: Form submission, status changes, schedules, manual execution, webhooks
- **Conditional Logic**: If/Then/Else conditions with AND/OR operators
- **Action System**: Email, SMS, database updates, webhooks, task assignments
- **Execution History**: Complete audit trail of workflow executions
- **Template Variables**: Dynamic data injection using `{{variable}}` syntax
- **Async Execution**: Non-blocking workflow execution

## Architecture

```
workflows/
├── schemas/
│   ├── workflow.schema.ts              # Main workflow schema (MongoDB)
│   └── workflow-execution.schema.ts    # Execution history schema (MongoDB)
├── dto/
│   ├── create-workflow.dto.ts          # Create workflow DTO
│   ├── update-workflow.dto.ts          # Update workflow DTO
│   └── execute-workflow.dto.ts         # Execute workflow DTO
├── services/
│   ├── action-handlers/
│   │   ├── email-action.handler.ts     # Email action handler
│   │   ├── sms-action.handler.ts       # SMS action handler
│   │   ├── database-action.handler.ts  # Database action handler
│   │   └── webhook-action.handler.ts   # Webhook action handler
│   ├── condition-evaluator.service.ts  # Condition evaluation engine
│   └── workflow-execution.service.ts   # Main execution engine
├── workflows.service.ts                 # Workflow CRUD operations
├── workflows.controller.ts              # REST API controller
└── workflows.module.ts                  # Module definition
```

## Features

### 1. Trigger Types

| Trigger Type | Description | Config Example |
|--------------|-------------|----------------|
| `form_submit` | Triggered when a form is submitted | `{ formId: "abc123" }` |
| `status_change` | Triggered when status changes | `{ entity: "project", statusFrom: "active", statusTo: "completed" }` |
| `schedule` | Triggered on a schedule | `{ cron: "0 9 * * *" }` |
| `manual` | Manually triggered via API | `{}` |
| `webhook` | Triggered by external webhook | `{ secret: "xyz" }` |

### 2. Action Types

| Action Type | Description | Config Example |
|-------------|-------------|----------------|
| `send_email` | Send email via NodeMailer | `{ to: "{{user.email}}", subject: "Hello", body: "..." }` |
| `send_sms` | Send SMS via Twilio | `{ to: "{{user.phone}}", message: "..." }` |
| `update_database` | Update database records | `{ collection: "projects", operation: "update", query: {...}, data: {...} }` |
| `create_record` | Create new database record | `{ collection: "tasks", data: {...} }` |
| `webhook` | Call external webhook | `{ url: "https://...", method: "POST", body: {...} }` |
| `assign_task` | Assign task to user | `{ taskId: "...", userId: "..." }` |
| `update_status` | Update entity status | `{ entity: "project", entityId: "...", status: "..." }` |

### 3. Condition Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Exact match | `field: "status", operator: "equals", value: "completed"` |
| `not_equals` | Not equal | `field: "priority", operator: "not_equals", value: "low"` |
| `greater_than` | Greater than (numeric) | `field: "budget", operator: "greater_than", value: 10000` |
| `less_than` | Less than (numeric) | `field: "progress", operator: "less_than", value: 50` |
| `contains` | String/array contains | `field: "tags", operator: "contains", value: "urgent"` |
| `not_contains` | Does not contain | `field: "tags", operator: "not_contains", value: "archived"` |
| `is_empty` | Empty check | `field: "notes", operator: "is_empty"` |
| `is_not_empty` | Not empty check | `field: "assignee", operator: "is_not_empty"` |

## Database Schemas

### Workflow Schema (MongoDB)

```typescript
{
  name: string;                    // Workflow name
  description: string;             // Optional description
  trigger: {
    type: TriggerType;
    config: Record<string, any>;
  };
  actions: [
    {
      type: ActionType;
      config: Record<string, any>;
      conditions?: WorkflowCondition[];  // Optional action-specific conditions
    }
  ];
  conditions: WorkflowCondition[];  // Global workflow conditions
  isActive: boolean;                // Enable/disable workflow
  createdBy: ObjectId;              // User who created
  organizationId: ObjectId;         // Organization
  metadata: Record<string, any>;    // Additional data
  createdAt: Date;
  updatedAt: Date;
}
```

### Workflow Execution Schema (MongoDB)

```typescript
{
  workflowId: ObjectId;             // Reference to workflow
  workflowName: string;             // Workflow name snapshot
  status: ExecutionStatus;          // pending, running, success, failed, partial
  triggerData: Record<string, any>; // Data that triggered workflow
  actionResults: [
    {
      actionType: string;
      status: 'success' | 'failed';
      message?: string;
      error?: string;
      executedAt: Date;
      duration?: number;
    }
  ];
  startedAt: Date;
  completedAt: Date;
  duration: number;                 // Total execution time (ms)
  errorMessage: string;             // Error if failed
  triggeredBy: ObjectId;            // User who triggered
  organizationId: ObjectId;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Workflow Management

#### `POST /api/workflows`
Create a new workflow

**Request Body:**
```json
{
  "name": "Send email on form submission",
  "description": "Automatically sends email when safety form is submitted",
  "trigger": {
    "type": "form_submit",
    "config": {
      "formId": "507f1f77bcf86cd799439011"
    }
  },
  "actions": [
    {
      "type": "send_email",
      "config": {
        "to": "{{submitter.email}}",
        "subject": "Form Submitted: {{form.title}}",
        "body": "Your form has been submitted successfully."
      }
    }
  ],
  "conditions": [
    {
      "field": "priority",
      "operator": "equals",
      "value": "high"
    }
  ],
  "isActive": true
}
```

#### `GET /api/workflows`
Get all workflows

**Query Parameters:**
- `organizationId` (optional)
- `isActive` (optional): boolean
- `triggerType` (optional): string

#### `GET /api/workflows/:id`
Get workflow by ID

#### `PATCH /api/workflows/:id`
Update workflow

#### `DELETE /api/workflows/:id`
Soft delete workflow (sets `isActive` to false)

#### `DELETE /api/workflows/:id/hard`
Permanently delete workflow

#### `POST /api/workflows/:id/toggle`
Toggle workflow active status

#### `GET /api/workflows/statistics`
Get workflow statistics

**Query Parameters:**
- `organizationId` (optional)

**Response:**
```json
{
  "total": 25,
  "active": 20,
  "inactive": 5,
  "byTriggerType": [
    { "type": "form_submit", "count": 15 },
    { "type": "status_change", "count": 5 },
    { "type": "schedule", "count": 5 }
  ]
}
```

### Workflow Execution

#### `POST /api/workflows/:id/execute`
Execute a workflow manually

**Request Body:**
```json
{
  "triggerData": {
    "formId": "507f1f77bcf86cd799439011",
    "submissionId": "507f1f77bcf86cd799439012",
    "data": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "triggeredBy": "507f1f77bcf86cd799439013",
  "metadata": {
    "source": "manual",
    "ip": "192.168.1.1"
  }
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "workflowId": "507f1f77bcf86cd799439011",
  "workflowName": "Send email on form submission",
  "status": "pending",
  "startedAt": "2025-11-03T15:30:00Z",
  ...
}
```

#### `GET /api/workflows/:id/executions`
Get execution history for a workflow

**Query Parameters:**
- `limit` (optional, default: 50)

#### `GET /api/workflows/executions/:executionId`
Get execution details by ID

#### `GET /api/workflows/executions`
Get all executions with filters

**Query Parameters:**
- `status` (optional): pending, running, success, failed, partial
- `workflowId` (optional)
- `organizationId` (optional)
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `limit` (optional, default: 100)

## Execution Engine

### Workflow Execution Flow

```
1. Receive trigger event
2. Find matching workflows
3. Create execution record (status: pending)
4. Update status to "running"
5. Evaluate workflow-level conditions
   ├─ If conditions fail → Mark as success (skipped)
   └─ If conditions pass → Continue
6. For each action:
   ├─ Evaluate action-specific conditions
   ├─ If conditions pass → Execute action
   └─ Record action result
7. Determine final status:
   ├─ All actions succeeded → success
   ├─ All actions failed → failed
   └─ Mixed results → partial
8. Update execution record with results
9. Calculate duration and save
```

### Template Variable Replacement

The execution engine supports dynamic template variables using `{{path.to.variable}}` syntax:

```javascript
// Trigger data
{
  user: {
    name: "John Doe",
    email: "john@example.com"
  },
  project: {
    title: "Construction Site A",
    budget: 100000
  }
}

// Template
"Hello {{user.name}}, your project {{project.title}} with budget ${{project.budget}} is ready."

// Result
"Hello John Doe, your project Construction Site A with budget $100000 is ready."
```

## Action Handlers

### Email Action Handler

**Features:**
- Template variable replacement
- Multiple recipients (to, cc, bcc)
- Attachments support
- HTML/text body
- Email templates

**Example Config:**
```json
{
  "to": ["{{user.email}}", "admin@company.com"],
  "cc": ["manager@company.com"],
  "subject": "Project {{project.name}} Status Update",
  "template": "project-update",
  "body": "Hello {{user.name}}, your project status is now {{project.status}}."
}
```

### SMS Action Handler

**Features:**
- Template variable replacement
- Multiple recipients
- Character limit validation
- Twilio integration ready

**Example Config:**
```json
{
  "to": "{{user.phone}}",
  "message": "Your task {{task.title}} is due today!",
  "from": "+1234567890"
}
```

### Database Action Handler

**Features:**
- Create, update, delete operations
- Template variable replacement in queries
- Multiple collection support
- Nested data updates

**Example Config:**
```json
{
  "collection": "projects",
  "operation": "update",
  "query": {
    "_id": "{{project.id}}"
  },
  "data": {
    "status": "completed",
    "completedAt": "{{now}}",
    "completedBy": "{{user.id}}"
  }
}
```

### Webhook Action Handler

**Features:**
- Full HTTP method support (GET, POST, PUT, DELETE, PATCH)
- Custom headers
- Template variable replacement
- Timeout configuration
- Request/response logging

**Example Config:**
```json
{
  "url": "https://api.external.com/webhook",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer {{apiToken}}",
    "Content-Type": "application/json"
  },
  "body": {
    "event": "form_submitted",
    "formId": "{{form.id}}",
    "data": "{{form.data}}"
  },
  "timeout": 5000
}
```

## Condition Evaluator

### Condition Evaluation Logic

The condition evaluator supports complex boolean logic with AND/OR operators:

```javascript
// Example: (status = "active" AND priority = "high") OR (budget > 10000)
[
  {
    field: "status",
    operator: "equals",
    value: "active",
    logicalOperator: "AND"
  },
  {
    field: "priority",
    operator: "equals",
    value: "high",
    logicalOperator: "OR"
  },
  {
    field: "budget",
    operator: "greater_than",
    value: 10000
  }
]
```

### Nested Path Support

Supports nested object access using dot notation:

```javascript
// Trigger data
{
  project: {
    client: {
      name: "ABC Corp",
      tier: "premium"
    }
  }
}

// Condition
{
  field: "project.client.tier",
  operator: "equals",
  value: "premium"
}
```

## Usage Examples

### Example 1: Send Email on High-Priority Form Submission

```json
{
  "name": "Alert on High-Priority Safety Form",
  "trigger": {
    "type": "form_submit",
    "config": {
      "formId": "safety-inspection-form-id"
    }
  },
  "conditions": [
    {
      "field": "priority",
      "operator": "equals",
      "value": "high"
    }
  ],
  "actions": [
    {
      "type": "send_email",
      "config": {
        "to": ["safety@company.com", "{{project.manager.email}}"],
        "subject": "URGENT: High-Priority Safety Issue - {{project.name}}",
        "body": "A high-priority safety issue has been reported on {{project.name}}. Details: {{submission.description}}"
      }
    },
    {
      "type": "send_sms",
      "config": {
        "to": "{{project.manager.phone}}",
        "message": "URGENT: Safety issue on {{project.name}}. Check email for details."
      }
    }
  ],
  "isActive": true
}
```

### Example 2: Update Project Status on Completion

```json
{
  "name": "Mark Project Complete",
  "trigger": {
    "type": "status_change",
    "config": {
      "entity": "project",
      "statusTo": "completed"
    }
  },
  "actions": [
    {
      "type": "update_database",
      "config": {
        "collection": "projects",
        "operation": "update",
        "query": { "_id": "{{project.id}}" },
        "data": {
          "completedAt": "{{now}}",
          "completedBy": "{{user.id}}",
          "finalBudget": "{{project.totalSpent}}"
        }
      }
    },
    {
      "type": "send_email",
      "config": {
        "to": "{{project.client.email}}",
        "subject": "Project {{project.name}} Completed",
        "body": "Your project has been completed successfully."
      }
    },
    {
      "type": "webhook",
      "config": {
        "url": "https://accounting.company.com/api/invoice/generate",
        "method": "POST",
        "body": {
          "projectId": "{{project.id}}",
          "amount": "{{project.totalSpent}}"
        }
      }
    }
  ],
  "isActive": true
}
```

### Example 3: Conditional Actions with Complex Logic

```json
{
  "name": "Budget Alert System",
  "trigger": {
    "type": "form_submit",
    "config": {
      "formId": "expense-report-form-id"
    }
  },
  "actions": [
    {
      "type": "send_email",
      "config": {
        "to": "finance@company.com",
        "subject": "Standard Expense Report",
        "body": "New expense: ${{expense.amount}}"
      },
      "conditions": [
        {
          "field": "expense.amount",
          "operator": "less_than",
          "value": 1000
        }
      ]
    },
    {
      "type": "send_email",
      "config": {
        "to": ["finance@company.com", "cfo@company.com"],
        "subject": "HIGH EXPENSE ALERT",
        "body": "Large expense requires approval: ${{expense.amount}}"
      },
      "conditions": [
        {
          "field": "expense.amount",
          "operator": "greater_than",
          "value": 1000
        }
      ]
    }
  ],
  "isActive": true
}
```

## Testing

### Manual Testing via Swagger

1. Navigate to http://localhost:3001/api/docs
2. Find "Workflows" section
3. Test endpoints:
   - Create workflow
   - List workflows
   - Execute workflow
   - View execution history

### Testing Workflow Execution

```bash
# Create a test workflow
curl -X POST http://localhost:3001/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Workflow",
    "trigger": { "type": "manual", "config": {} },
    "actions": [{
      "type": "send_email",
      "config": {
        "to": "test@example.com",
        "subject": "Test",
        "body": "Hello {{user.name}}"
      }
    }],
    "isActive": true
  }'

# Execute the workflow
curl -X POST http://localhost:3001/api/workflows/{workflowId}/execute \
  -H "Content-Type: application/json" \
  -d '{
    "triggerData": {
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }'

# Check execution status
curl http://localhost:3001/api/workflows/{workflowId}/executions
```

## Module Statistics

- **Total Files**: 14
- **MongoDB Schemas**: 2 (Workflow, WorkflowExecution)
- **DTOs**: 3 (Create, Update, Execute)
- **Services**: 6 (WorkflowsService, WorkflowExecutionService, ConditionEvaluator, 4 Action Handlers)
- **Controllers**: 1
- **REST Endpoints**: 11
- **Trigger Types**: 5
- **Action Types**: 7
- **Condition Operators**: 8

## Future Enhancements

1. **Scheduled Workflows**: Integration with cron/Bull queue for scheduled execution
2. **Workflow Templates**: Pre-built workflow templates for common scenarios
3. **Visual Workflow Builder**: Drag-and-drop UI for creating workflows
4. **Workflow Analytics**: Execution metrics, success rates, performance monitoring
5. **Advanced Actions**: File operations, PDF generation, data transformations
6. **Workflow Testing**: Test mode for dry-run execution
7. **Versioning**: Workflow version history and rollback
8. **Error Handling**: Retry logic, exponential backoff, dead-letter queue

---

**Related Documents**:
- [BACKEND_README.md](./BACKEND_README.md) - Backend setup
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [MODULE_FORMS.md](./MODULE_FORMS.md) - Forms module integration

**Last Updated**: November 3, 2025
